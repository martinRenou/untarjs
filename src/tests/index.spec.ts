const path = require('path');

import { initUntarJS } from '../index';


describe('extract', () => {
  it('should download and extract data successfully', async () => {
    const wasmPath = new URL(path.resolve(__dirname, '../src/unpack.wasm'), import.meta.url);

    const untarjs = await initUntarJS(wasmPath.href);

    const condaPackageUrl = 'https://conda.anaconda.org/conda-forge/linux-64/_libgcc_mutex-0.1-conda_forge.tar.bz2';
    const result = await untarjs.extract(condaPackageUrl);

    console.log(result);
  });
});
