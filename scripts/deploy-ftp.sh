#!/usr/bin/env bash
# Upload the built site to the Hetzner web space over FTPS (explicit TLS).
#
# Credentials are never stored in this repository and never passed on the command line:
# curl reads them from ~/.netrc (chmod 600), one line:
#   machine www761.your-server.de login <ftp user> password <ftp password>
# The FTP account's root is expected to be the web root (public_html).
#
# Usage:  scripts/deploy-ftp.sh            build, test, upload, verify
#         DRY_RUN=1 scripts/deploy-ftp.sh  build, test, list what would be uploaded
#         FTP_HOST=other.host scripts/deploy-ftp.sh
#
# The host is the Hetzner server that serves chpetri.com (reverse DNS of its address):
# its FTP certificate covers *.your-server.de, not the domain.
#
# Files are only added or overwritten, never deleted on the server.
set -euo pipefail

host="${FTP_HOST:-www761.your-server.de}"
cd "$(dirname "$0")/.."

npm test

if [[ -z "${DRY_RUN:-}" ]]; then
  [[ -f "$HOME/.netrc" ]] || { echo "~/.netrc is missing (see the header of this script)" >&2; exit 1; }
  [[ "$(stat -c %a "$HOME/.netrc")" == 600 ]] || { echo "~/.netrc must be chmod 600" >&2; exit 1; }
  grep -q "machine $host" "$HOME/.netrc" || { echo "~/.netrc has no entry for $host" >&2; exit 1; }
fi

cd dist
count=0
while IFS= read -r -d '' file; do
  path="${file#./}"
  if [[ -n "${DRY_RUN:-}" ]]; then
    echo "would upload $path"
  else
    curl --silent --show-error --fail --netrc --ssl-reqd --ftp-create-dirs \
      --upload-file "$file" "ftp://$host/$path"
    echo "uploaded $path"
  fi
  count=$((count + 1))
done < <(find . -type f -print0 | sort -z)
echo "$count files"

if [[ -z "${DRY_RUN:-}" ]]; then
  # the live start page must be byte-identical to the build
  live="$(curl --silent --fail https://chpetri.com/ | sha256sum)"
  built="$(sha256sum < index.html)"
  if [[ "$live" == "$built" ]]; then echo "verified: https://chpetri.com/ serves this build"; else echo "warning: https://chpetri.com/ differs from the build (cache?)" >&2; exit 1; fi
fi
