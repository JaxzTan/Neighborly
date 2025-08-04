'use client';

import { useEffect, useState } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness, jwtToAddress } from '@mysten/zklogin';
import { jwtDecode } from 'jwt-decode';
import { TransactionBlock } from '@mysten/sui/transactions';

// Constants
const GOOGLE_CLIENT_ID = '693990656522-rt3g1okl4vcsf92ev766d4k1cer9g3vb.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000';
const SUI_FULLNODE_URL = getFullnodeUrl('devnet');
const suiClient = new SuiClient({ url: SUI_FULLNODE_URL });

// This is the main component for your page
export default function HomePage() {
  const [userAddress, setUserAddress] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const jwt_token = hash.get('id_token');
    if (jwt_token) {
      const decodedJwt = jwtDecode(jwt_token);
      setJwt(jwt_token);
      setSubject(decodedJwt.sub);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (jwt && subject) {
      getSaltAndAddress();
    }
  }, [jwt, subject]);

  const handleLogin = async () => {
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), Number(epoch) + 2, randomness);
    sessionStorage.setItem('ephemeralKeyPair', JSON.stringify(Array.from(ephemeralKeyPair.getSecretKey())));
    sessionStorage.setItem('nonce', nonce);
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'id_token',
      scope: 'openid email',
      nonce: nonce,
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const getSaltAndAddress = async () => {
    try {
      // Call our own local API route
      const response = await fetch('/api/salt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: jwt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get salt from local API.');
      }

      const { salt } = await response.json();

      if (!salt) {
        throw new Error('Salt not found in response from local API.');
      }

      const address = jwtToAddress(jwt, salt);
      setUserAddress(address);

    } catch (error) {
      console.error('Failed to get salt or address:', error);
    }
  };

  const handleSignTransaction = async () => {
    if (!userAddress || !jwt) return;
    alert("Signing transaction... check console logs for details.");

    try {
      const privateKey = sessionStorage.getItem('ephemeralKeyPair');
      if (!privateKey) {
        throw new Error('Ephemeral key pair not found in session storage.');
      }
      const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(Uint8Array.from(JSON.parse(privateKey)));
      
      const txb = new TransactionBlock();
      txb.setSender(userAddress);
      // This is a dummy transaction. Replace with your actual transaction logic.
      txb.splitCoins(txb.gas, [txb.pure(1000)]); 

      const { epoch } = await suiClient.getLatestSuiSystemState();
      
      const saltResponse = await fetch('/api/salt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: jwt }),
      });
      const { salt } = await saltResponse.json();

      if (!salt) {
        throw new Error('Failed to get salt for transaction proof.');
      }

      const proofResponse = await fetch('https://prover.mystenlabs.com/v1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jwt: jwt,
          extendedEphemeralPublicKey: ephemeralKeyPair.getPublicKey().toSuiPublicKey(),
          maxEpoch: Number(epoch) + 2,
          jwtRandomness: generateRandomness(),
          salt: salt,
          keyClaimName: 'sub',
        }),
      });
      const zkProof = await proofResponse.json();

      if (!zkProof || !zkProof.signature) {
        throw new Error('Failed to get ZK proof from prover.');
      }

      const { signature } = await txb.sign({
        client: suiClient,
        signer: ephemeralKeyPair,
      });

      const response = await suiClient.executeTransactionBlock({
        transactionBlock: await txb.build({ client: suiClient }),
        signature: zkProof.signature,
      });

      console.log('Transaction Response:', response);
      alert(`Transaction successful! Digest: ${response.digest}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. See console for details.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>zkLogin Tutorial</h1>
      {!userAddress ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <div>
          <h2>Welcome!</h2>
          <p><strong>Your Sui Address:</strong> {userAddress}</p>
          <button onClick={handleSignTransaction}>Sign a Test Transaction</button>
        </div>
      )}
    </div>
  );
}