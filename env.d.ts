/// <reference types="@moonlight-mod/types" />

// esbuild-plugin-inline-import
declare module "inline:*" {
  const content: string;
  export default content;
}
