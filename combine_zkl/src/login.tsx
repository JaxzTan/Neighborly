import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // default import
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  generateNonce,
  generateRandomness,
  jwtToAddress,
} from "@mysten/sui/zklogin";

interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

export default function Login() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 1️⃣ Connect to Sui
    const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });

    // 2️⃣ Get latest epoch info
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + 2;

    // 3️⃣ Generate ephemeral keys + randomness + nonce
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(
      ephemeralKeyPair.getPublicKey(), // pass PublicKey
      maxEpoch,
      randomness
    );

    console.log("Nonce:", nonce);

    // 4️⃣ Redirect to Google login
    const clientId =
      "828657040441-banrovfmrahqtekfs33201q9q7j7afb1.apps.googleusercontent.com";
    const redirectUri = window.location.origin + "/login";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=id_token&scope=openid%20email&nonce=${nonce}`;

    window.location.href = authUrl;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("id_token")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const idToken = params.get("id_token");
      if (idToken) {
        const decoded = jwtDecode<JwtPayload>(idToken);
        console.log("Decoded JWT:", decoded);

        // Temporary salt — replace with backend fetch if needed
        const userSalt = generateRandomness().toString();

        const zkAddress = jwtToAddress(idToken, userSalt);
        console.log("zkLogin Address:", zkAddress);
        setUserAddress(zkAddress);

        // Redirect after login
        navigate("/afterlogin");
      }
    }
  }, [navigate]);

  return (
    <div>
      <h1>zkLogin with Google</h1>
      <button onClick={handleLogin}>Login with Google</button>
      {userAddress && <p>Your zkLogin Address: {userAddress}</p>}
    </div>
  );
}
