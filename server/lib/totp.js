// TOTP implementation using Node.js built-in crypto only
// RFC 6238 (TOTP) + RFC 4226 (HOTP)
const crypto = require('crypto');

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(encoded) {
  let bits = 0, value = 0;
  const output = [];
  const str = encoded.toUpperCase().replace(/=+$/, '');
  for (const char of str) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

function base32Encode(buf) {
  let bits = 0, value = 0;
  let out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32_CHARS[(value << (5 - bits)) & 31];
  return out;
}

function hotp(secret, counter) {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  // Write 64-bit counter big-endian
  const hi = Math.floor(counter / 0x100000000);
  const lo = counter >>> 0;
  buf.writeUInt32BE(hi, 0);
  buf.writeUInt32BE(lo, 4);
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[19] & 0xf;
  const code = ((hmac[offset] & 0x7f) << 24)
             | ((hmac[offset+1] & 0xff) << 16)
             | ((hmac[offset+2] & 0xff) << 8)
             |  (hmac[offset+3] & 0xff);
  return String(code % 1000000).padStart(6, '0');
}

function generateSecret() {
  return base32Encode(crypto.randomBytes(20));
}

function generateTOTP(secret, offset = 0) {
  const counter = Math.floor(Date.now() / 1000 / 30) + offset;
  return hotp(secret, counter);
}

function verifyTOTP(secret, token) {
  // Accept current window ±1 step (90 second window)
  for (const offset of [-1, 0, 1]) {
    if (generateTOTP(secret, offset) === token) return true;
  }
  return false;
}

function otpauthURL(secret, email, issuer = 'SecurePathway') {
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

// Generate a data URL QR code using pure SVG (no external lib)
// Returns the otpauth URL - client will render the QR using a canvas approach
function setupData(email) {
  const secret = generateSecret();
  const url = otpauthURL(secret, email);
  return { secret, url };
}

module.exports = { generateSecret, generateTOTP, verifyTOTP, otpauthURL, setupData };
