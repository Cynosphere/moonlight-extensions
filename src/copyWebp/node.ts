import decodeWebp, { init as initWebpDecode } from "@jsquash/webp/decode.js";
import webpWasmModule from "@jsquash/webp/codec/dec/webp_dec.wasm";
import encodePng, { init as initPngEncode } from "@jsquash/png/encode.js";
// @ts-expect-error why are you complaining about this one but not the other one
import pngWasmModule from "@jsquash/png/codec/pkg/squoosh_png_bg.wasm";

let init = false;

const natives = {
  async convertWebp(buffer: ArrayBuffer): Promise<ArrayBuffer> {
    if (!init) {
      await initWebpDecode(await webpWasmModule);
      await initPngEncode(await pngWasmModule);
      init = true;
    }

    const data = await decodeWebp(buffer);
    const out = await encodePng(data);

    return out;
  }
};

module.exports = natives;
