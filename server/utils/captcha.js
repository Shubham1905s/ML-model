import crypto from "crypto";

const CAPTCHA_LENGTH = 6;
const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const SPECIALS = "@#$%&*?!";

const captchaStore = new Map();

function randomChar(source) {
  const index = crypto.randomInt(0, source.length);
  return source[index];
}

function cleanupExpiredCaptchas() {
  const now = Date.now();
  for (const [id, value] of captchaStore.entries()) {
    if (value.expiresAt <= now) {
      captchaStore.delete(id);
    }
  }
}

function shuffle(value) {
  const chars = value.split("");
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function generateCaptchaText() {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const all = `${lower}${upper}${digits}${SPECIALS}`;
  const required = [
    randomChar(lower),
    randomChar(upper),
    randomChar(digits),
    randomChar(SPECIALS)
  ];
  while (required.length < CAPTCHA_LENGTH) {
    required.push(randomChar(all));
  }
  return shuffle(required.join(""));
}

export function createCaptchaSvg(text) {
  const noise = Array.from({ length: 6 }, (_, index) => {
    const x1 = 10 + index * 20;
    const y1 = 5 + crypto.randomInt(0, 35);
    const x2 = x1 + 20;
    const y2 = 5 + crypto.randomInt(0, 35);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d3c4ae" stroke-width="1" />`;
  }).join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48">
  <rect width="100%" height="100%" fill="#fffaf3" rx="8" />
  ${noise}
  <text x="12" y="32" font-size="24" font-family="monospace" fill="#7d3b12" letter-spacing="2">${text}</text>
</svg>
  `.trim();
}

export function issueCaptcha(purpose = "general") {
  cleanupExpiredCaptchas();
  const id = crypto.randomUUID();
  const text = generateCaptchaText();
  captchaStore.set(id, {
    text,
    purpose,
    expiresAt: Date.now() + CAPTCHA_TTL_MS
  });
  return {
    captchaId: id,
    captchaSvg: createCaptchaSvg(text),
    expiresInSeconds: Math.floor(CAPTCHA_TTL_MS / 1000)
  };
}


export function verifyCaptcha({ captchaId, captchaText, purpose = "general" }) {
  cleanupExpiredCaptchas();
  const found = captchaStore.get(captchaId);
  if (!found) return false;
  captchaStore.delete(captchaId);
  if (found.purpose !== purpose || found.expiresAt <= Date.now()) return false;
  return String(captchaText || "") === found.text;
}
