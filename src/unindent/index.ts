import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // codeblocks
  {
    find: "/^(¯\\\\_\\(ツ\\)_\\/¯)/.exec",
    replace: {
      match: /return{lang:(.+?),content:(.+?),inQuote:/,
      replacement: (_, lang, content) => `const lang=${lang},content=${content};
return {
  lang,
  content:lang.toLowerCase()==="ansi"?content:require("unindent_unindent").default(content),
  inQuote:`
    }
  },

  // file preview
  {
    find: ".openFullPreviewSection,",
    replace: {
      match: /(?<=let{text:(\i),language:(\i)}=\i),(?=\i=\(\)=>)/,
      replacement: (_, text, language) => `;
if(${language}.toLowerCase()!=="ansi")
  ${text}=require("unindent_unindent").default(${text});
let `
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  unindent: {},
  replacer: {
    dependencies: [
      { ext: "commands", id: "commands" },
      { ext: "unindent", id: "unindent" }
    ],
    entrypoint: true
  }
};
