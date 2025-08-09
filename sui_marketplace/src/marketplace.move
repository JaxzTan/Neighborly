module sui_marketplace::marketplace {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::table::{Self, Table};
    use sui::dynamic_object_field as ofield;
    use sui::clock::{Self, Clock};
    use sui::sui::SUI;
    use sui::event;

    // NOTE: The use std::vector; line has been removed as it was redundant.

    // Placeholder for your NFT or any other asset type.
    // Ensure it has key and store.
    // use sui_marketplace::item::{Self, Item};

    // --- Error Codes ---
    const E_INSUFFICIENT_FUNDS: u64 = 1;
    const E_SENDER_NOT_OWNER: u64 = 2;
    const E_ESCROW_NOT_EXPIRED: u64 = 3;

    // --- Core Structs ---

    public struct Marketplace<phantom COIN> has key {
        id: UID,
        profits: Table<address, Coin<COIN>>,
    }

    public struct Listing has key, store {
        id: UID,
        seller: address,
        price: u64,
    }

    public struct Escrow<phantom COIN> has key, store {
        id: UID,
        buyer: address,
        seller: address,
        funds: Coin<COIN>,
        deadline_ms: u64,
    }

    /// Event emitted when an item is listed for sale.
public struct ItemListed has copy, drop {
    // The ID of the new Listing object created.
    listing_id: ID,
    // The ID of the item being sold.
    item_id: ID,
    // The price of the item.
    price: u64,
    // The seller's address.
    seller: address,
}

    // --- Initialization ---
    fun init(ctx: &mut TxContext) {
        transfer::share_object(Marketplace<SUI> {
            id: object::new(ctx),
            profits: table::new(ctx),
        });
    }

    // --- Marketplace Functions ---

    public entry fun list<T: key + store>(
    _marketplace: &Marketplace<SUI>,
    obj: T,
    price: u64,
    ctx: &mut TxContext
) {
    let seller = TxContext::sender(ctx);
    // --- ADD THIS LINE ---
    let item_id = object::id(&obj); // Get the ID of the item before using it

    let mut listing = Listing {
        id: object::new(ctx),
        seller,
        price,
    };
    ofield::add(&mut listing.id, b"item", obj);

    event::emit(ItemListed {
        listing_id: object::id(&listing),
        item_id, // Now this variable exists
        price,
        seller,
    });

    transfer::transfer(listing, seller);
}

    public entry fun delist_and_take<T: key + store>(
        _marketplace: &Marketplace<SUI>,
        listing: Listing,
        ctx: &TxContext
    ) : T {
        assert!(TxContext::sender(ctx) == listing.seller, E_SENDER_NOT_OWNER);
        let item = ofield::remove<vector<u8>, T>(&mut listing.id, b"item");
        let Listing { id, seller: _, price: _ } = listing;
        object::delete(id);
        item
    }

    public entry fun initiate_escrow<T: key + store>(
        marketplace: &mut Marketplace<SUI>,
        listing: Listing,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) == listing.price, E_INSUFFICIENT_FUNDS);
        let item = ofield::remove<vector<u8>, T>(&mut listing.id, b"item");
        let Listing { id, seller, price: _ } = listing;
        object::delete(id);

        let deadline_ms = clock::timestamp_ms(clock) + 604800000; // 7 days in ms
        let mut escrow = Escrow<SUI> {
            id: object::new(ctx),
            buyer: TxContext::sender(ctx),
            seller,
            funds: payment,
            deadline_ms,
        };
        ofield::add(&mut escrow.id, b"item", item);
        transfer::transfer(escrow, TxContext::sender(ctx));
    }

    public entry fun confirm_receipt<T: key + store>(
        marketplace: &mut Marketplace<SUI>,
        escrow: Escrow<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(TxContext::sender(ctx) == escrow.buyer, E_SENDER_NOT_OWNER);
        let item = ofield::remove<vector<u8>, T>(&mut escrow.id, b"item");
        let Escrow { id, buyer, seller, funds, deadline_ms: _ } = escrow;

        if (table::contains(&marketplace.profits, seller)) {
            let seller_balance = table::borrow_mut(&mut marketplace.profits, seller);
            coin::join(seller_balance, funds);
        } else {
            table::add(&mut marketplace.profits, seller, funds);
        };

        transfer::transfer(item, buyer);
        object::delete(id);
    }

    public entry fun cancel_by_timeout<T: key + store>(
        _marketplace: &Marketplace<SUI>,
        escrow: Escrow<SUI>,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(TxContext::sender(ctx) == escrow.seller, E_SENDER_NOT_OWNER);
        assert!(clock::timestamp_ms(clock) >= escrow.deadline_ms, E_ESCROW_NOT_EXPIRED);
        let item = ofield::remove<vector<u8>, T>(&mut escrow.id, b"item");
        let Escrow { id, buyer, seller, funds, deadline_ms: _ } = escrow;

        transfer::transfer(item, seller);
        transfer::transfer(funds, buyer);
        object::delete(id);
    }

    public entry fun take_profits(
        marketplace: &mut Marketplace<SUI>,
        ctx: &mut TxContext
    ) {
        let seller = TxContext::sender(ctx);
        let profits_coin = table::remove(&mut marketplace.profits, seller);
        transfer::transfer(profits_coin, seller);
    }
}