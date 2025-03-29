const codes = {};

const generateInviteCode = () => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  codes[code] = Date.now() + 15 * 60 * 1000; // expires in 15 minutes
  return code;
};

const validateInviteCode = (code) => {
  if (codes[code] && codes[code] > Date.now()) {
    return true;
  }
  delete codes[code];
  return false;
};

const expireOldCodes = () => {
  Object.keys(codes).forEach((code) => {
    if (codes[code] < Date.now()) delete codes[code];
  });
};

module.exports = { generateInviteCode, validateInviteCode, expireOldCodes };
