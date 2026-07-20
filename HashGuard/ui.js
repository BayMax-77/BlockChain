
// ============================================================================
// HashGuard Lite
// ui.js
// ----------------------------------------------------------------------------
// Responsibilities:
//
// 1. Control the visual state of the application.
// 2. Show and hide sections depending on user actions.
// 3. Update text displayed to the user.
// 4. Handle copy-to-clipboard actions.
// 5. Keep UI logic separated from business logic.
//
// This file does NOT:
// - calculate hashes
// - call Bitcoin APIs
//
// Those responsibilities belong to other modules.
// ============================================================================



// ============================================================================
// DOM ELEMENTS
// ============================================================================


const fileInfo =
    document.querySelector("#fileInfo");

const hashSection = document.querySelector("#hashSection");

const hashResultSection =
    document.querySelector("#hashResultSection");

const bitcoinSection =
    document.querySelector("#bitcoinSection");


const hashElement =
    document.querySelector("#hash");


const feeElement =
    document.querySelector("#fee");


const btcPriceElement =
    document.querySelector("#btcPrice");


const costElement =
    document.querySelector("#cost");


const statusElement =
    document.querySelector("#status");


const costExplanation =
    document.querySelector("#costExplanation");


const copyButton =
    document.querySelector("#copyButton");

const algorithmButtons =
    document.querySelectorAll(".algorithm-button");



// ============================================================================
// FILE SELECTION UI
// ----------------------------------------------------------------------------
// Called when the user selects a file.
//
// At this moment we only reveal the next step.
// We do NOT calculate the hash yet.
// ============================================================================


export function showHashOptions(file) {

    if (!file) {

        return;

    }


    hashSection.hidden = false;


    fileInfo.textContent =
        `Size: ${formatFileSize(file.size)}`;


    setStatus(
        "File selected. Choose a hash algorithm."
    );

}



// ============================================================================
// HASH RESULT UI
// ============================================================================


export function showHash(hash) {


    hashResultSection.hidden = false;


    hashElement.textContent = hash;


    setStatus(
        "Hash generated successfully."
    );


}



// ============================================================================
// BITCOIN SECTION
// ----------------------------------------------------------------------------
// Bitcoin information remains hidden until a hash exists.
// ============================================================================


export function showBitcoinSection() {


    bitcoinSection.hidden = false;


}


// ============================================================================
// RESET HASH DATA
// ----------------------------------------------------------------------------
// Used when the user selects a new file.
//
// Old hash and Bitcoin information are removed because
// they belong to the previous file.
// ============================================================================

export function resetHashData() {


    hashResultSection.hidden = true;


    bitcoinSection.hidden = true;


    hashElement.textContent = "-";


    feeElement.textContent = "-";


    btcPriceElement.textContent = "-";


    costElement.textContent = "-";


    costExplanation.textContent =
        "* Estimate based on the selected hash algorithm.";


}



// ============================================================================
// BITCOIN DATA UPDATE
// ============================================================================


export function updateBitcoinInfo({

    feeRate,

    btcPrice,

    cost,

    hashBytes,

    transactionSize

}) {


    feeElement.textContent =
        `${feeRate} sat/vByte`;


    btcPriceElement.textContent =
        formatCurrency(btcPrice);


    costElement.textContent =
        formatCurrency(cost);


    costExplanation.textContent =
    `Estimated using a ${hashBytes}-byte hash (~${transactionSize} vBytes transaction). 
    Actual cost varies with network fees and publication method.`;

}


// ============================================================================
// STATUS
// ============================================================================


export function setStatus(message) {


    statusElement.textContent = message;


}



// ============================================================================
// LOADING STATE
// ----------------------------------------------------------------------------
// Used while waiting for APIs or calculations.
// ============================================================================


export function showLoading(message) {


    setStatus(message);


}



// ============================================================================
// ERROR HANDLING
// ============================================================================


export function showError(message) {


    setStatus(
        "Error: " + message
    );


    statusElement.classList.add(
        "status-error"
    );


}




// ============================================================================
// HASH ALGORITHM SELECTION
// ----------------------------------------------------------------------------
// Handles the visual selection of the hashing algorithm.
//
// The selected button receives the "active" class.
// The chosen algorithm can be retrieved by app.js.
// ============================================================================

let selectedAlgorithm = "SHA-256";

algorithmButtons.forEach(button => {

    button.addEventListener("click", () => {

        algorithmButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedAlgorithm =
            button.dataset.algorithm;

    });

});

export function getSelectedAlgorithm() {

    return selectedAlgorithm;

}










// ============================================================================
// COPY HASH BUTTON
// ----------------------------------------------------------------------------
// Small button next to the hash.
// Allows the user to copy the fingerprint easily.
// ============================================================================


copyButton.addEventListener(

    "click",

    async () => {


        const hash =
            hashElement.textContent;


        if (!hash || hash === "-") {

            return;

        }



        await navigator.clipboard.writeText(hash);



        copyButton.textContent =
            "✅";



        setTimeout(() => {


            copyButton.textContent =
                "📋";


        }, 1500);



    }

);



// ============================================================================
// HELPERS
// ============================================================================


function formatCurrency(value) {


    return new Intl.NumberFormat(

        "en-US",

        {

            style:"currency",

            currency:"EUR",

            maximumFractionDigits:2

        }

    ).format(value);


}


function formatFileSize(bytes) {

    if (bytes === 0) {

        return "0 Bytes";

    }


    const units = [

        "Bytes",
        "KB",
        "MB",
        "GB"

    ];


    const index =
        Math.floor(

            Math.log(bytes) /
            Math.log(1024)

        );


    return (

        Math.round(

            bytes /
            Math.pow(1024,index)

        )

        +

        " " +

        units[index]

    );

}