#!/usr/bin/env bash
# Publish the built site to the Hetzner web space over FTPS (explicit TLS) with lftp.
#
# Credentials are never stored in this repository and never passed on the command line:
# lftp reads them from ~/.netrc (chmod 600), one line:
#   machine www761.your-server.de login <ftp user> password <ftp password>
# The FTP account's root is expected to be the web root (public_html).
#
# Usage:  scripts/deploy-ftp.sh            check, build, test, upload, verify
#         DRY_RUN=1 scripts/deploy-ftp.sh  build and test, then only show what would change
#         PRUNE=1 scripts/deploy-ftp.sh    also delete files on the server that the build
#                                          no longer contains (asks before deleting)
#
# Requires lftp (Arch: pacman -S lftp; Debian/Ubuntu: apt install lftp).
#
# The host is the Hetzner server that serves chpetri.com (reverse DNS of its address):
# its FTP certificate covers *.your-server.de, not the domain.
#
# Proxy variables (ftp_proxy, all_proxy, ...) and personal lftp rc files are ignored on
# purpose: a proxy that speaks plain HTTP would receive the FTP password in clear text.
set -euo pipefail

host="${CHPETRI_FTP_HOST:-www761.your-server.de}"
site="https://chpetri.com"
cd "$(dirname "$0")/.."

fail() { echo "deploy: $*" >&2; exit 1; }

command -v lftp >/dev/null || fail "lftp is missing (Arch: pacman -S lftp; Debian/Ubuntu: apt install lftp)"

# Publish only what is reviewed: a clean checkout of a commit that is on GitHub's main.
if [[ -z "${DRY_RUN:-}" ]]; then
  [[ -z "$(git status --porcelain --ignored -- public/)" ]] || fail "public/ contains uncommitted or ignored files; they would be published"
  [[ -z "$(git status --porcelain)" ]] || fail "the working tree has uncommitted changes; commit and push them first"
  git fetch --quiet origin main
  git merge-base --is-ancestor HEAD origin/main || fail "HEAD is not on origin/main; push it first, so the repository shows what is deployed"
fi

# The dry run logs in as well, so the login must be in place either way.
netrc="$HOME/.netrc"
[[ -f "$netrc" ]] || fail "~/.netrc is missing (see the header of this script)"
[[ "$(stat -c %a "$netrc")" == 600 ]] || fail "~/.netrc must be chmod 600"
# without a matching entry lftp would log in anonymously, and then without TLS
grep -qE "^[[:space:]]*machine[[:space:]]+${host//./\\.}([[:space:]]|$)" "$netrc" || fail "~/.netrc has no entry for $host"

npm ci --no-audit --no-fund
npm audit --audit-level=high
PUBLISH_CHECK=1 npm test

# Runs one mirror of dist/ onto the web root; the arguments are extra mirror options.
# "open <host>" (not an ftp:// URL) is what makes lftp take the login from ~/.netrc.
# TLS 1.2: over TLS 1.3, lftp 4.9 cut uploads short and still reported success
# (4 of 6 test uploads of a 129 kB PDF stopped at 64-115 kB; with TLS 1.2, 6 of 6 were whole).
mirror() {
  lftp --norc -c "
set cmd:fail-exit yes
set ftp:proxy ''
set hftp:proxy ''
set http:proxy ''
set https:proxy ''
set ftp:ssl-allow yes
set ftp:ssl-auth TLS
set ftp:ssl-force yes
set ftp:ssl-protect-data yes
set ftp:ssl-protect-list yes
set ssl:verify-certificate yes
set ssl:priority NORMAL:-VERS-TLS1.3
set net:max-retries 2
set net:timeout 30
open $host
lcd dist
mirror --reverse --no-perms --exclude-glob .well-known/acme-challenge/ $*
"
}

plan="$(mirror --delete --dry-run)"
uploads="$(grep -c '^get ' <<<"$plan" || true)"
stale="$(sed -nE 's#^rm (-r )?[a-z]+://[^/]*/##p' <<<"$plan")"

echo "$uploads files to upload"
if [[ -n "$stale" ]]; then
  echo "on the server, but no longer in the build:"
  sed 's/^/  /' <<<"$stale"
fi

if [[ -n "${DRY_RUN:-}" ]]; then
  echo "dry run: nothing uploaded"
  exit 0
fi

if [[ -n "$stale" && -n "${PRUNE:-}" ]]; then
  read -r -p "Delete these $(wc -l <<<"$stale") entries on the server? [y/N] " answer </dev/tty || fail "no terminal to confirm the deletion on"
  [[ "$answer" == [yY] ]] || fail "nothing changed"
  mirror --delete
else
  mirror
  [[ -z "$stale" ]] || echo "kept the files listed above; run with PRUNE=1 to delete them"
fi

# Every published file must now be served byte for byte as built. Skipped: .htaccess
# (never served) and the stubs under about/ and projects/ (Apache redirects those paths).
cd dist
mismatch=0
while IFS= read -r -d '' file; do
  path="${file#./}"
  live="$(curl -q --noproxy '*' --proto '=https' --silent --fail "$site/$path" | sha256sum)" || live="unreachable"
  if [[ "$live" != "$(sha256sum < "$path")" ]]; then
    echo "differs: $site/$path" >&2
    mismatch=1
  fi
done < <(find . -type f ! -name .htaccess ! -path './about/*' ! -path './projects/*' -print0 | sort -z)
if (( mismatch )); then fail "the live site differs from the build; run the script again (a cache, or an upload cut short)"; fi
echo "verified: $site serves this build"
