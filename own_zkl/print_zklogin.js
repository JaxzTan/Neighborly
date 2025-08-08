// Simulate zkLogin output (replace with real zkLogin logic)
const zkLoginResult = {
  salt: "0x4a3b2c1d98a6b5c4", // Random salt (hex)
  ephemeralPublicKey: "0x8f3a1b2c...", // From @mysten/zklogin
  suiAddress: "0x5b2c3d4e5f...", // Derived Sui address
  jwt: "eyJhbGciOiJSUzI1NiIs..." // Truncated for security
};

// Print to terminal
console.log("=== zkLogin Results ===");
console.log("Salt:", zkLoginResult.salt);
console.log("Ephemeral Public Key:", zkLoginResult.ephemeralPublicKey);
console.log("Sui Address:", zkLoginResult.suiAddress);
console.log("JWT (truncated):", zkLoginResult.jwt.slice(0, 20) + "...");