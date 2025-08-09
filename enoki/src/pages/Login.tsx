//import React from "react";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
} from "@mysten/dapp-kit";
import {
  isEnokiWallet,
  type AuthProvider,
  type EnokiWallet,
} from "@mysten/enoki";

const Login = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();

  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>()
  );

  const googleWallet = walletsByProvider.get("google");
  const facebookWallet = walletsByProvider.get("facebook");

  if (currentAccount) {
    return <div>Current address: {currentAccount.address}</div>;
  }

  return (
    <>
      {googleWallet ? (
        <button
          onClick={() => {
            connect({ wallet: googleWallet });
          }}
        >
          Sign in with Google
        </button>
      ) : null}
      {facebookWallet ? (
        <button
          onClick={() => {
            connect({ wallet: facebookWallet });
          }}
        >
          Sign in with Facebook
        </button>
      ) : null}
    </>
  );
};

export default Login;
