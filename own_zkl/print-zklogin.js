const crypto = require('crypto');

// Simulate zkLogin output
const zkLoginResult = {
  salt: "0x" + crypto.randomBytes(16).toString('hex'),
  ephemeralPublicKey: "0x" + crypto.randomBytes(32).toString('hex').slice(0, 24) + "...",
  suiAddress: "0x" + crypto.randomBytes(32).toString('hex').slice(0, 24) + "...",
  jwt: "eyJhbGciOiJSUzI1NiIs...".slice(0, 20) + "..."
};

console.log("=== zkLogin Results ===");
console.log(zkLoginResult);
