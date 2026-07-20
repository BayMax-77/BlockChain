// ============================================================================
// HashGuard Lite
// bitcoin-api.js
// ----------------------------------------------------------------------------
// Responsibilities:
//
// 1. Retrieve current Bitcoin network fees.
// 2. Retrieve current Bitcoin market price.
// 3. Estimate the cost of publishing a hash on Bitcoin.
//
// This module does not interact with the user interface.
// ============================================================================



// ============================================================================
// Configuration
// ============================================================================


// Estimated transaction:
//
// base transaction
// + OP_RETURN output
// + hash payload

const BASE_TRANSACTION_SIZE = 120;
const OP_RETURN_OVERHEAD = 25;


// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================



export async function loadBitcoinData() {


    const [

        feeRate,

        btcPrice

    ] = await Promise.all([


        fetchFeeRate(),


        fetchBitcoinPrice()


    ]);



    return {


        feeRate,


        btcPrice


    };


}



// ============================================================================
// COST ESTIMATION
// ----------------------------------------------------------------------------
// Estimates the size of a future Bitcoin transaction carrying
// the selected hash inside an OP_RETURN output.
//
// This is much closer to reality than using a fixed size.
// ============================================================================

export function estimatePublicationCost({

    feeRate,

    btcPrice,

    hashBytes

}) {

    // Estimated transaction size.

    const transactionSize =

        BASE_TRANSACTION_SIZE +

        OP_RETURN_OVERHEAD +

        hashBytes;

    // Fee in satoshis.

    const satoshis =

        feeRate *

        transactionSize;

    // Convert satoshis to BTC.

    const btc =

        satoshis /

        100_000_000;

    // Convert BTC to EUR.

    const eur =

        btc *

        btcPrice;

    return {

        feeRate,

        hashBytes,

        transactionSize,

        satoshis,

        btc,

        eur

    };

}



// ============================================================================
// BITCOIN FEE API
// ============================================================================


async function fetchFeeRate() {


    const response =

        await fetch(

            "https://mempool.space/api/v1/fees/recommended"

        );



    if (!response.ok) {


        throw new Error(

            "Unable to load Bitcoin fees."

        );


    }



    const data =

        await response.json();



    // hourFee provides a balanced estimate
    // between speed and cost.

    return data.hourFee;


}



// ============================================================================
// BITCOIN PRICE API
// ============================================================================


async function fetchBitcoinPrice() {


    const response =

        await fetch(

            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur"

        );



    if (!response.ok) {


        throw new Error(

            "Unable to load Bitcoin price."

        );


    }



    const data =

        await response.json();



    return data.bitcoin.eur;


}



// ============================================================================
// HELPERS
// ============================================================================


export function satoshisToBTC(satoshis) {


    return satoshis /

        100_000_000;


}