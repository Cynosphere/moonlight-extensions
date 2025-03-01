/// <reference types="@moonlight-mod/types" />

// esbuild-plugin-inline-import
declare module "inline:*" {
  const content: string;
  export default content;
}

declare module "*.wasm" {
  const mod: Promise<WebAssembly.Module>;
  export default mod;
}
