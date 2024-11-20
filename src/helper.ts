import unpack, { IWasmModule } from './unpack';
import unpackWasm from './unpack.wasm';

const initializeWasm = async (): Promise<IWasmModule> => {
  const wasmModule: IWasmModule = await unpack({
    locateFile(path: string) {
      if (path.endsWith('.wasm')) {
        return unpackWasm;
      }
      return path;
    }
  });

  return wasmModule;
};

export default initializeWasm;
