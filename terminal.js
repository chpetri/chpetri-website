const COMMANDS = Object.freeze([
  "help",
  "about",
  "whoami",
  "experience",
  "skills",
  "certs",
  "evidence",
  "education",
  "contact",
  "cat cv.txt",
  "cv",
  "open cv",
  "projects",
  "open projects",
  "clear",
]);

const OUTPUTS = Object.freeze({
  help: [
    "Available commands:",
    "help · about · whoami · experience · skills · certs · evidence",
    "education · contact · cv · projects · open cv · clear",
  ],
  whoami: [
    "Christian Petri",
    "IT Security · Networks · Systems · Darmstadt, Germany",
    "Background: technical support, systems & network security",
  ],
  experience: [
    "11/2024–05/2025  Technical Support / IT Technician — Computer für alle",
    "09/2022–10/2024  Independent IT study & hands-on technical labs",
    "2021             Working Student / Strategy & Public Relations — eprimo",
    "2020–2021        Working Student / Business Consulting — Signition Holding",
  ],
  skills: [
    "Security: vulnerability management, testing [lab], risk analysis, reporting",
    "Networking: TCP/IP, subnetting, DNS, DHCP, routing, NAT, VPN",
    "Systems: Windows 10/11, Linux, hardware and fault diagnostics",
    "Tools: Wireshark, Nmap, Burp Suite, Git, PowerShell [fundamentals]",
  ],
  certs: [
    "02/2026  CompTIA CNVP",
    "02/2026  CompTIA PenTest+",
    "02/2026  Cyber Security Advisor (IHK)",
    "12/2025  CompTIA Security+",
    "08/2025  CompTIA Network+",
  ],
  education: [
    "2019–2022  Studies in Business Administration — Hochschule Darmstadt",
    "2018–2019  Studies in Online Communication — Hochschule Darmstadt",
  ],
  contact: [
    "Location   Darmstadt, Germany",
    "Email      contact@chpetri.com",
    "GitHub     github.com/chpetri",
    "LinkedIn   linkedin.com/in/christianpetri1",
    "TryHackMe  tryhackme.com/p/chpetri",
  ],
  cv: [
    "CURRICULUM VITAE — SUMMARY",
    "Christian Petri · IT Security · Networks · Systems · Darmstadt, Germany",
    "Practical background in technical support & full-time IT security training.",
    "",
    "• Direct commands: experience · skills · certs · education · contact",
    "• Curated bilingual profile & printable view: open cv (or click 'CV' in top nav)",
  ],
  "cat cv.txt": [
    "PROFILE",
    "Practical background in hardware diagnostics and technical support,",
    "combined with full-time training in IT security and networking.",
    "Curated bilingual profile: open cv (or click 'CV' in top nav)",
  ],
  projects: [
    "PROJECTS",
    "Practical projects across networking, systems and security are in progress.",
    "Type 'skills' or 'certs' to view active practical qualification areas.",
    "Project index: open projects (or click 'Projects' in top nav)",
  ],
});

const ALIASES = Object.freeze({
  about: "whoami",
  evidence: "certs",
});

const NAVIGATION = Object.freeze({
  "open cv": "./cv/",
  "open projects": "./projects/",
});

export function executeCommand(input) {
  if (typeof input !== "string") {
    return { type: "output", lines: ["error: command must be text"] };
  }

  if (input.length > 80) {
    return { type: "output", lines: ["error: command exceeds 80 characters"] };
  }

  const command = input.trim().toLowerCase().replace(/\s+/g, " ");
  if (!command) return { type: "output", lines: [] };
  if (command === "clear") return { type: "clear" };
  if (Object.hasOwn(NAVIGATION, command)) return { type: "navigate", href: NAVIGATION[command] };
  const resolvedCommand = Object.hasOwn(ALIASES, command) ? ALIASES[command] : command;
  if (Object.hasOwn(OUTPUTS, resolvedCommand)) return { type: "output", lines: [...OUTPUTS[resolvedCommand]] };

  return { type: "output", lines: [`command not found: ${command}`, "Type help for available commands."] };
}

function initialiseTerminal() {
  const form = document.querySelector("#terminal-form");
  const input = document.querySelector("#terminal-input");
  const log = document.querySelector("#terminal-log");
  if (!(form instanceof HTMLFormElement) || !(input instanceof HTMLInputElement) || !(log instanceof HTMLElement)) return;

  const history = [];
  let historyIndex = 0;

  const appendLine = (text, className = "") => {
    const line = document.createElement("p");
    line.textContent = text;
    if (className) line.className = className;
    log.append(line);
    while (log.childElementCount > 100) log.firstElementChild?.remove();
  };

  const clearLog = () => log.replaceChildren();

  const runCommand = (rawCommand) => {
    if (!rawCommand.trim()) return;

    history.push(rawCommand.slice(0, 80));
    if (history.length > 50) history.shift();
    historyIndex = history.length;
    appendLine(`guest@chpetri:~$ ${rawCommand}`, "terminal-command");

    const result = executeCommand(rawCommand);
    if (result.type === "clear") clearLog();
    if (result.type === "navigate") window.location.assign(result.href);
    if (result.type === "output") result.lines.forEach((line) => appendLine(line));

    input.value = "";
    log.scrollTop = log.scrollHeight;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runCommand(input.value);
  });

  const chips = document.querySelectorAll(".quick-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const cmd = chip.getAttribute("data-cmd");
      if (cmd) {
        runCommand(cmd);
        input.focus();
      }
    });
  });

  input.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      clearLog();
      return;
    }

    if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] ?? "";
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (event.key === "ArrowDown" && history.length) {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] ?? "";
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const prefix = input.value.trimStart().toLowerCase();
      const matches = COMMANDS.filter((command) => command.startsWith(prefix));
      if (matches.length === 1) input.value = matches[0];
      if (matches.length > 1) appendLine(matches.join("  "));
    }
  });
}

function initialiseThemeToggle() {
  const toggleBtn = document.querySelector("#theme-toggle");
  if (!toggleBtn) return;
  const nameSpan = toggleBtn.querySelector(".theme-toggle-name");

  const getSavedTheme = () => {
    try {
      return localStorage.getItem("site-theme");
    } catch {
      return null;
    }
  };

  const setSavedTheme = (theme) => {
    try {
      localStorage.setItem("site-theme", theme);
    } catch {
      // ignore storage errors
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (nameSpan) {
      nameSpan.textContent = theme === "smoked" ? "Smoked" : "Petrol";
    }
    toggleBtn.setAttribute("aria-label", `Current theme: ${theme === "smoked" ? "Smoked Blue" : "Petrol Slate"}. Click to switch.`);
  };

  const initialTheme = getSavedTheme() || document.documentElement.dataset.theme || "petrol";
  applyTheme(initialTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme || "petrol";
    const nextTheme = currentTheme === "smoked" ? "petrol" : "smoked";
    applyTheme(nextTheme);
    setSavedTheme(nextTheme);
  });
}

if (typeof document !== "undefined") {
  initialiseTerminal();
  initialiseThemeToggle();
}

export { COMMANDS };
