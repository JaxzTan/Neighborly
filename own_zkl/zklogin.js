import { generateNonce, computeZkLoginAddress } from '@mysten/zklogin';

export function createZkLoginSession(jwt) {
  // Generate salt (16-byte hex)
  const salt = '0x' + crypto.getRandomValues(new Uint8Array(16)).join('');
  
  // Ephemeral key pair
  const { ephemeralPublicKey } = generateNonce();
  
  // Derive Sui address
  const suiAddress = computeZkLoginAddress({
    jwt,
    ephemeralPublicKey,
    salt,
    keyClaim: 'sub' // From config.json
  });

  return { salt, ephemeralPublicKey, suiAddress };
}