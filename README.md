## Unpack

Fetching and unpacking archives. This package uses compiled `libarchive` into wasm and supports: tar, bzip2, zstd, zlib, zip, ustar, pax, v7, gnutar, cpio, mtree.

> Note: To add the support of another archive format,  `libarchive` should be compiled again with `--with-[name-archive-lib]` into wasm here [Libarchive recipe](https://github.com/emscripten-forge/recipes/blob/main/recipes/recipes_emscripten/libarchive/build.sh#L11) and then run `yarn run build` in this project to make new unpack.js and unpack.wasm files.

## Using

This package has 2 methods:
- extract(url) - downloads an archive throught the url and returns extracted data in Uint8Array.
- exctractData(data) - accepts Uint8Array archive data and returns exracted data.

The example of using:
```sh
import untarjs from "@emscripten-forge/untarjs";

const condaPackageUrl = 'https://conda.anaconda.org/conda-forge/linux-64/_libgcc_mutex-0.1-conda_forge.tar.bz2';
untarjs.extract(condaPackageUrl).then((data)=>{
    console.log(data);
});
```
