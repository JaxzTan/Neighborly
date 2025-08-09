import { registerEnokiWallets } from '@mysten/enoki';
 
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
 
registerEnokiWallets({
	client: suiClient,
	network: 'testnet',
	apiKey: 'YOUR_PUBLIC_ENOKI_API_KEY',
	providers: {
		google: {
			clientId: 'YOUR_GOOGLE_CLIENT_ID',
		},
		facebook: {
			clientId: 'YOUR_FACEBOOK_CLIENT_ID',
		},
		twitch: {
			clientId: 'YOUR_TWITCH_CLIENT_ID',
		},
	},
});