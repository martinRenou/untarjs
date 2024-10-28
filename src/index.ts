import initializeWasm from "./helper.js";
import { WasmModule } from "./unpack.js";

const fetchByteArray = async (url: string): Promise<Uint8Array> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

const init = async (): Promise<WasmModule | null> => {
  try {
    const wasmModule = await initializeWasm();
    return wasmModule as WasmModule;
  } catch (error) {
    console.error("Error initializing WASM module:", error);
    return null;
  }
};

const extractData = async (data: Uint8Array): Promise<Uint8Array | null> => {
  const wasmModule = await init();

  if (!wasmModule) {
    console.error("WASM module not initialized.");
    return null;
  }

  try {
    const inputPtr = wasmModule._malloc(data.length);
    wasmModule.HEAPU8.set(data, inputPtr);

    const outputSizePtr = wasmModule._malloc(data.length);
    const extractedDataPtr = wasmModule._extract_archive(inputPtr, data.length, outputSizePtr);
    const extractedSize = wasmModule.getValue(outputSizePtr, "i32");
    if (extractedDataPtr === 0) {
      throw new Error("Archive extraction failed.");
    }
    const extractedData = new Uint8Array(
      wasmModule.HEAPU8.subarray(extractedDataPtr, extractedDataPtr + extractedSize)
    );

    wasmModule._free(inputPtr);
    wasmModule._free(outputSizePtr);
    wasmModule._free(extractedDataPtr);

    console.log("Extracted size:", extractedSize);
    return extractedData;
  } catch (error) {
    console.error("Error during extracting:", error);
    return null;
  }
};

const extract = async (url: string): Promise<Uint8Array | null> => {
  try {
    const data = await fetchByteArray(url);
    console.log("Data downloaded:", data);
    return await extractData(data);
  } catch (error) {
    console.error("Error during extracting:", error);
    return null;
  }
};

export default {
  extract,
  extractData,
};
