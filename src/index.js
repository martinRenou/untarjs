

import initializeWasm from "./helper.js";

const fetchByteArray = async (url) => {
    let response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let arrayBuffer = await response.arrayBuffer();
    let byte_array = new Uint8Array(arrayBuffer);
    return byte_array;
}

const init = async () => {
    return await initializeWasm();
}

const extractData = (data) => {
    let extractedData;
    const wasmModule = init();
    try {
        if (!wasmModule) {
            throw new Error('WASM module not initialized.');
        }
        if (wasmModule) {
            const inputPtr = wasmModule._malloc(data.length);
            wasmModule.HEAPU8.set(data, inputPtr);
            const outputSizePtr = wasmModule._malloc(data.length);

            const extractedDataPtr = wasmModule._extract_archive(inputPtr, data.length, outputSizePtr);

            const extractedSize = wasmModule.getValue(outputSizePtr, 'i32');

            console.log('Extracted size:', extractedSize);

            if (extractedDataPtr === 0) {
                throw new Error('Archive extraction failed.');
            }

            extractedData = new Uint8Array(wasmModule.HEAPU8.subarray(extractedDataPtr, extractedDataPtr + extractedSize));

            wasmModule._free(inputPtr);
            wasmModule._free(outputSizePtr);
            wasmModule._free(extractedDataPtr);

            return extractedData;
        }
    } catch (error) {
        console.log('Error during extracting:', error);
    }
}

const extract = async (url) => {
    let extractedData;
    try {
        let data = await fetchByteArray(url);
        console.log('Data downloaded:', data);

        extractedData = extractData(data);
    } catch (error) {
        console.error('Error during extracting:', error);
    }
    return extractedData;
}

export default {
    extract,
    extractData
}