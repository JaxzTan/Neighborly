import { registerEnokiWallets } from "@mysten/enoki";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js";

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

registerEnokiWallets({
  client: suiClient,
  network: "testnet",
  apiKey: "enoki_public_122a632424c2ef913a0321e56fb65f27",
  providers: {
    google: {
      clientId: "YOUR_GOOGLE_CLIENT_ID",
    },
    facebook: {
      clientId: "YOUR_FACEBOOK_CLIENT_ID",
    },
    twitch: {
      clientId: "YOUR_TWITCH_CLIENT_ID",
    },
  },
});
