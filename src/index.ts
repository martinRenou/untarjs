import initializeWasm from './helper';
import { IFileData } from './types';
import { IWasmModule } from './unpack';

const fetchByteArray = async (url: string): Promise<Uint8Array> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

const init = async (): Promise<IWasmModule | null> => {
  try {
    const wasmModule = await initializeWasm();
    return wasmModule as IWasmModule;
  } catch (error) {
    console.error('Error initializing WASM module:', error);
    return null;
  }
};

export const extractData = async (data: Uint8Array): Promise<IFileData[]> => {
  const wasmModule = await init();
  if (!wasmModule) {
    console.error('WASM module not initialized.');
    return [];
  }

  const inputPtr = wasmModule._malloc(data.length);
  wasmModule.HEAPU8.set(data, inputPtr);
  const fileCountPtr = wasmModule._malloc(4);

  try {
    const resultPtr = wasmModule._extract_archive(inputPtr, data.length, fileCountPtr);
    const statusPtr = wasmModule.getValue(resultPtr+8, 'i32');
    const errorMessagePtr = wasmModule.getValue(resultPtr + 12, 'i32');
    console.log('status', statusPtr);
    console.log('errorMessagePtr', errorMessagePtr);
    if (statusPtr !== 1) {
      const errorMessage = wasmModule.UTF8ToString(errorMessagePtr);
      console.error('Extraction failed with status:', statusPtr, 'Error:', errorMessage);
      return [];
    }
    const filesPtr = wasmModule.getValue(resultPtr, 'i32'); 
    const fileCount = wasmModule.getValue(resultPtr + 4, 'i32');

    const files: IFileData[] = [];

    for (let i = 0; i < fileCount; i++) {
      const fileDataPtr = filesPtr + i * 12;
      const filenamePtr = wasmModule.getValue(fileDataPtr, 'i32');
      const dataSize = wasmModule.getValue(fileDataPtr + 8, 'i32');
      const dataPtr = wasmModule.getValue(fileDataPtr + 4, 'i32');
      const filename = wasmModule.UTF8ToString(filenamePtr);
      const fileData = new Uint8Array(wasmModule.HEAPU8.buffer, dataPtr, dataSize);

      files.push({
        filename: filename,
        data: fileData
      });
    }

    wasmModule._free(inputPtr);
    wasmModule._free(fileCountPtr);
    wasmModule._free(statusPtr);
    wasmModule._free(errorMessagePtr);
    wasmModule._free(resultPtr);

    return files;
  } catch (error) {
    console.error('Error during extraction:', error);
    return [];
  }
};


export const extract = async (url: string): Promise<IFileData[]> => {
  try {
    const data = await fetchByteArray(url);
    console.log('Data downloaded:', data);
    return await extractData(data);
  } catch (error) {
    console.error('Error during extracting:', error);
    return [];
  }
};

export * from './types';

export default {
  extract,
  extractData
};
