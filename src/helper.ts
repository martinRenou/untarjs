import unpack, { IWasmModule } from './unpack';
import unpackWasm from './unpack.wasm';

const initializeWasm = async (wasmPath: string | undefined): Promise<IWasmModule> => {
  try {
    const wasmModule: IWasmModule = await unpack({
      locateFile(path: string) {
        if (path.endsWith('.wasm')) {
          return wasmPath ? wasmPath : unpackWasm;
        }
        return path;
      }
    });

    return wasmModule;
  } catch (err) {
    throw new Error(`Error initializing the WASM module: ${err}`);
  }
};
export default initializeWasm;
