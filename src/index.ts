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

export interface IUnpackJSAPI {
  extractData: (data: Uint8Array) => Promise<IFileData[]>;
  extract: (url: string) => Promise<IFileData[]>;
}

export const initUntarJS = async (wasmPath: string | undefined): Promise<IUnpackJSAPI> => {
  let wasmModule: IWasmModule | undefined = undefined;
  try {
    wasmModule = await initializeWasm(wasmPath);
  } catch (error) {
    throw new Error(`Error initializing WASM module: ${error}`);
  }

  const extractData = async (data: Uint8Array): Promise<IFileData[]> => {
    const inputPtr = wasmModule._malloc(data.length);
    wasmModule.HEAPU8.set(data, inputPtr);
    const fileCountPtr = wasmModule._malloc(4);
    const outputSizePtr = wasmModule._malloc(4);

    try {
      const extractedFilesPtr = wasmModule._extract_archive(
        inputPtr,
        data.length,
        outputSizePtr,
        fileCountPtr
      );

      const fileCount = wasmModule.getValue(fileCountPtr, 'i32');
      const files: IFileData[] = [];

      for (let i = 0; i < fileCount; i++) {
        const fileDataPtr = extractedFilesPtr + i * (3 * 4);
        const filenamePtr = wasmModule.getValue(fileDataPtr, 'i32');
        const dataSize = wasmModule.getValue(fileDataPtr + 8, 'i32');
        const dataPtr = wasmModule.getValue(fileDataPtr + 4, 'i32');
        const filename = wasmModule.UTF8ToString(filenamePtr);
        const fileData = new Uint8Array(
          wasmModule.HEAPU8.buffer,
          dataPtr,
          dataSize
        );

        files.push({
          filename: filename,
          data: fileData
        });
      }

      wasmModule._free(fileCountPtr);
      wasmModule._free(outputSizePtr);
      wasmModule._free(inputPtr);
      wasmModule._free(extractedFilesPtr);

      return files;
    } catch (error) {
      console.error('Error during extracting:', error);
      return [];
    }
  };

  return {
    extractData,
    extract: async (url: string): Promise<IFileData[]> => {
      try {
        const data = await fetchByteArray(url);
        console.log('Data downloaded:', data);
        return await extractData(data);
      } catch (error) {
        console.error('Error during extracting:', error);
        return [];
      }
    }
  };
};

export * from './types';
