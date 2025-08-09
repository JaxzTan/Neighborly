import React, { useState, useEffect, useCallback } from 'react';
import {
  ConnectButton,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
  useCurrentAccount
} from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import '@mysten/dapp-kit/dist/index.css';

// --- Configuration ---
// IMPORTANT: Replace these placeholders with your actual deployed package and object IDs.
// You get these IDs after running sui client publish ... in your terminal.
const PACKAGE_ID = "0x...YOUR_PACKAGE_ID";
const MARKETPLACE_ID = "0x...YOUR_MARKETPLACE_SHARED_OBJECT_ID";

// --- Main Application Component ---
const App = () => {
  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-sm h-[800px] bg-[#556072] rounded-[40px] shadow-2xl p-2 border-4 border-black overflow-hidden">
            <div className="w-full h-full bg-[#556072] rounded-[32px] overflow-y-auto scrollbar-hide">
                <Marketplace />
            </div>
        </div>
    </div>
  );
};


// --- Marketplace Component ---
const Marketplace = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

  const [listings, setListings] = useState([]);
  const [myEscrows, setMyEscrows] = useState([]);
  const [itemToSell, setItemToSell] = useState({id: '', price: ''});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState('');

  /**
   * Fetches active listings by querying the ItemListed event.
   */
  const fetchListings = useCallback(async () => {
    if (!PACKAGE_ID.startsWith('0x')) return;
    setLoading('Fetching listings...');
    try {
      const events = await suiClient.queryEvents({
        query: { MoveEventType: ${PACKAGE_ID}::marketplace::ItemListed },
        order: 'descending',
      });
      
      const listingsData = events.data.map(event => ({
        id: event.parsedJson.listing_id,
        itemId: event.parsedJson.item_id,
        price: event.parsedJson.price,
        seller: event.parsedJson.seller,
        // In a real app, you'd fetch metadata for name/image here
        name: Item ${event.parsedJson.item_id.slice(0, 6)}...,
        imageUrl: https://placehold.co/400x400/a3856a/ffffff?text=${event.parsedJson.item_id.slice(2, 6)}
      }));
      
      setListings(listingsData);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Could not fetch marketplace listings.");
    } finally {
      setLoading('');
    }
  }, [suiClient]);

  /**
   * Fetches escrows owned by the current user.
   */
  const fetchMyEscrows = useCallback(async () => {
    if (!currentAccount || !PACKAGE_ID.startsWith('0x')) return;
    setLoading('Fetching your escrows...');
    try {
      const objects = await suiClient.getOwnedObjects({ owner: currentAccount.address });
      const escrowObjectIds = objects.data
        .filter(obj => obj.data?.type === ${PACKAGE_ID}::marketplace::Escrow<${PACKAGE_ID}::item::Item>)
        .map(obj => obj.data.objectId);

      if (escrowObjectIds.length > 0) {
        const escrowsData = await suiClient.multiGetObjects({
          ids: escrowObjectIds,
          options: { showContent: true },
        });
        const myEscrows = escrowsData
          .filter(escrow => escrow.data)
          .map(escrow => ({
            id: escrow.data.objectId,
            ...escrow.data.content.fields
          }));
        setMyEscrows(myEscrows);
      } else {
        setMyEscrows([]);
      }
    } catch (err) {
      console.error("Error fetching escrows:", err);
      setError("Could not fetch your escrows.");
    } finally {
      setLoading('');
    }
  }, [suiClient, currentAccount]);

  useEffect(() => {
    fetchListings();
    if (currentAccount) {
      fetchMyEscrows();
    }
  }, [currentAccount, fetchListings, fetchMyEscrows]);


  // --- Transaction Handlers ---

  const handleSellItem = () => {
    if (!currentAccount || !itemToSell.id || !itemToSell.price) {
      setError("Please provide an Item ID and a price.");
      return;
    }
    setLoading('Creating listing...');

    const txb = new TransactionBlock();
    txb.moveCall({
      target: ${PACKAGE_ID}::marketplace::list,
      typeArguments: [${PACKAGE_ID}::item::Item],
      arguments: [
        txb.object(MARKETPLACE_ID),
        txb.object(itemToSell.id),
        txb.pure(parseInt(itemToSell.price, 10) * 1_000_000_000, 'u64'), // Price in SUI -> MIST
      ],
    });

    signAndExecuteTransactionBlock(
      { transactionBlock: txb },
      { onSuccess: () => { alert('Success! Your item is listed.'); fetchListings(); setLoading(''); },
        onError: (err) => { setError('Listing failed.'); console.error(err); setLoading(''); }
      }
    );
  };

  const handleBuyItem = (listing) => {
    if (!currentAccount) return;
    setLoading('Processing purchase...');

    const txb = new TransactionBlock();
    const [paymentCoin] = txb.splitCoins(txb.gas, [txb.pure(listing.price, 'u64')]);
    txb.moveCall({
      target: ${PACKAGE_ID}::marketplace::initiate_escrow,
      typeArguments: [${PACKAGE_ID}::item::Item],
      arguments: [ txb.object(MARKETPLACE_ID), txb.object(listing.id), paymentCoin ],
    });

    signAndExecuteTransactionBlock(
      { transactionBlock: txb },
      { onSuccess: () => { alert('Purchase successful! Check "My Escrows".'); fetchListings(); fetchMyEscrows(); setLoading(''); },
        onError: (err) => { setError('Purchase failed.'); console.error(err); setLoading(''); }
      }
    );
  };

  const handleConfirmReceipt = (escrowId) => {
    setLoading('Confirming receipt...');
    const txb = new TransactionBlock();
    txb.moveCall({
      target: ${PACKAGE_ID}::marketplace::confirm_receipt,
      typeArguments: [${PACKAGE_ID}::item::Item],
      arguments: [ txb.object(MARKETPLACE_ID), txb.object(escrowId) ],
    });
    signAndExecuteTransactionBlock(
      { transactionBlock: txb },
      { onSuccess: () => { alert('Receipt confirmed! Item is yours.'); fetchMyEscrows(); setLoading(''); },
        onError: (err) => { setError('Confirmation failed.'); console.error(err); setLoading(''); }
      }
    );
  };

  const handleCancelEscrow = (escrowId) => {
    setLoading('Cancelling escrow...');
    const txb = new TransactionBlock();
    txb.moveCall({
      target: ${PACKAGE_ID}::marketplace::cancel_by_timeout,
      typeArguments: [${PACKAGE_ID}::item::Item],
      arguments: [ txb.object(MARKETPLACE_ID), txb.object(escrowId) ],
    });
    signAndExecuteTransactionBlock(
      { transactionBlock: txb },
      { onSuccess: () => { alert('Escrow cancelled.'); fetchMyEscrows(); setLoading(''); },
        onError: (err) => { setError('Cancellation failed.'); console.error(err); setLoading(''); }
      }
    );
  };

  // --- Render Method ---
  return (
    <div className="bg-[#556072] text-white p-4 font-serif flex flex-col h-full">
      <header className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-2xl font-bold">Neighborly</h1>
        <ConnectButton />
      </header>

      {/* Sell Items Section */}
      <div className="bg-[#404a5c] p-3 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">List an Item for Sale</h2>
        <input type="text" placeholder="Object ID of item to sell" value={itemToSell.id} onChange={(e) => setItemToSell({...itemToSell, id: e.target.value})} className="w-full p-2 mb-2 rounded-md bg-[#556072] text-white" />
        <input type="number" placeholder="Price in SUI" value={itemToSell.price} onChange={(e) => setItemToSell({...itemToSell, price: e.target.value})} className="w-full p-2 mb-2 rounded-md bg-[#556072] text-white" />
        <button onClick={handleSellItem} disabled={!currentAccount || !!loading} className="w-full p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500">
          {loading ? 'Processing...' : 'SELL ITEM'}
        </button>
      </div>

      <hr className="border-gray-500 mb-4" />

      {/* My Escrows Section */}
      {currentAccount && myEscrows.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">My Escrows</h2>
          <div className="space-y-2">
            {myEscrows.map(escrow => (
              <div key={escrow.id} className="bg-[#404a5c] p-2 rounded-lg text-xs">
                <p>Escrow ID: {escrow.id.slice(0, 10)}...</p>
                <p>Seller: {escrow.seller.slice(0, 10)}...</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleConfirmReceipt(escrow.id)} className="flex-1 p-1 rounded bg-green-500 hover:bg-green-600">Confirm Receipt</button>
                  <button onClick={() => handleCancelEscrow(escrow.id)} className="flex-1 p-1 rounded bg-red-500 hover:bg-red-600">Cancel (if expired)</button>
                </div>
              </div>
            ))}
          </div>
          <hr className="border-gray-500 my-4" />
        </div>
      )}

      {/* Listings Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Marketplace Listings</h2>
        <div className="grid grid-cols-2 gap-4">
          {listings.length > 0 ? listings.map((listing) => (
            <div key={listing.id} className="bg-[#404a5c] rounded-lg p-2 flex flex-col">
              <img src={listing.imageUrl} alt={listing.name} className="w-full h-32 object-cover rounded-md mb-2" />
              <h3 className="font-semibold text-sm">{listing.name}</h3>
              <p className="text-xs text-gray-300 mb-2">{(listing.price / 1_000_000_000).toFixed(3)} SUI</p>
              <button onClick={() => handleBuyItem(listing)} disabled={!currentAccount || !!loading} className="mt-auto w-full text-xs p-2 rounded-md bg-green-500 hover:bg-green-600 disabled:bg-gray-500">
                Buy Now
              </button>
            </div>
          )) : <p className="col-span-2 text-center">No listings found.</p>}
        </div>
      </div>

      {error && <div className="mt-4 p-2 bg-red-500 text-white rounded-lg fixed bottom-5 right-5">{error}</div>}
    </div>
  );
};

export default App;