// ============================================================================
// HashGuard Lite
// app.js
// ----------------------------------------------------------------------------
// Responsibilities:
//
// 1. Detect when the user selects a file.
// 2. Let the user choose a hashing algorithm.
// 3. Generate the selected cryptographic hash.
// 4. Display the hash through ui.js.
// 5. Load Bitcoin information after hash creation.
// 6. Estimate the publication cost.
//
// This file controls the application flow.
// UI changes are handled by ui.js.
// Bitcoin logic is handled by bitcoin-api.js.
// ============================================================================


import {

    loadBitcoinData,

    estimatePublicationCost

} from "./bitcoin-api.js";



import {

    showHashOptions,

    showHash,

    showBitcoinSection,

    resetHashData,

    updateBitcoinInfo,

    setStatus,

    showLoading,

    showError,

    getSelectedAlgorithm

} from "./ui.js";



// ============================================================================
// DOM ELEMENTS
// ============================================================================


const fileInput =
    document.querySelector("#fileInput");


const hashButton =
    document.querySelector("#hashButton");




// ============================================================================
// APPLICATION STATE
// ----------------------------------------------------------------------------
// Stores the selected file temporarily.
// We do not hash immediately after upload.
// ============================================================================


let selectedFile = null;



// ============================================================================
// EVENTS
// ============================================================================


fileInput.addEventListener(

    "change",

    handleFileSelection

);



hashButton.addEventListener(

    "click",

    generateHash

);



// ============================================================================
// FILE SELECTION
// ----------------------------------------------------------------------------
// The user chooses a file.
// At this stage:
//
// - We save the file.
// - We show the algorithm selector.
// - We wait for user confirmation.
//
// No hash is generated yet.
// ============================================================================


function handleFileSelection(event) {


    selectedFile =
        event.target.files[0];


    resetHashData();



    if (!selectedFile) {


        setStatus(
            "No file selected."
        );


        return;

    }



    showHashOptions(selectedFile);


    setStatus(
        "Choose a hash algorithm."
    );


}



// ============================================================================
// HASH GENERATION
// ============================================================================


async function generateHash() {


    if (!selectedFile) {


        setStatus(
            "Please select a file first."
        );


        return;

    }



    try {


        showLoading(
            "Calculating hash..."
        );



        const algorithm = getSelectedAlgorithm();



        const hash =
            await calculateHash(

                selectedFile,

                algorithm

            );



        showHash(hash);



        // After the hash exists,
        // Bitcoin information becomes relevant.

        showBitcoinSection();



        await loadBitcoinEstimate(hash);



    }

    catch(error) {


        console.error(error);


        showError(
            error.message
        );


    }


}



// ============================================================================
// HASH CALCULATION
// ----------------------------------------------------------------------------
// Uses the browser Web Crypto API.
//
// Supported algorithms:
//
// SHA-256
// SHA-384
// SHA-512
//
// The output is converted into hexadecimal format.
// ============================================================================


async function calculateHash(

    file,

    algorithm

) {


    const buffer =
        await file.arrayBuffer();



    const hashBuffer =
        await crypto.subtle.digest(

            algorithm,

            buffer

        );



    const hashArray =
        Array.from(

            new Uint8Array(hashBuffer)

        );



    return hashArray

        .map(

            byte =>

            byte
            .toString(16)
            .padStart(2,"0")

        )

        .join("");



}



// ============================================================================
// BITCOIN INFORMATION
// ----------------------------------------------------------------------------
// Estimates the publication cost based on the hash length.
//
// Larger hashes require slightly larger OP_RETURN payloads,
// therefore slightly larger Bitcoin transactions.
// ============================================================================

async function loadBitcoinEstimate(hash) {

    try {

        showLoading(
            "Loading Bitcoin information..."
        );

        const bitcoin =
            await loadBitcoinData();

        // Number of bytes contained in the hash.
        // Every hexadecimal byte occupies two characters.

        const hashBytes =
            hash.length / 2;

        const estimate =
            estimatePublicationCost({

                feeRate:
                    bitcoin.feeRate,

                btcPrice:
                    bitcoin.btcPrice,

                hashBytes

            });

        updateBitcoinInfo({

            feeRate:
                bitcoin.feeRate,

            btcPrice:
                bitcoin.btcPrice,

            cost:
                estimate.eur,

            transactionSize:
                estimate.transactionSize,

            hashBytes

        });

        setStatus(
            "Ready."
        );

    }

    catch(error) {

        console.error(error);

        showError(
            "Unable to load Bitcoin data."
        );

    }

}