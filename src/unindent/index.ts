import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // codeblocks
  {
    find: "/^(\\xaf\\\\_\\(\\u30c4\\)_\\/\\xaf)/.exec",
    replace: {
      match: /=>\({lang:(.+?),content:(.+?),inQuote:/,
      replacement: (_, lang, content) => `=>({
  lang:${lang},
  content:(${lang}).toLowerCase()==="ansi"?(${content}):require("unindent_unindent").default(${content}),
  inQuote:`
    }
  },

  // file preview
  {
    find: 'Accept:"text/plain"',
    replace: {
      match: /let{text:(\i),language:(\i),wordWrap:\i}=\i;/,
      replacement: (orig, text, language) => `${orig}
if(${language}.toLowerCase()!=="ansi")
  ${text}=require("unindent_unindent").default(${text});`
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
