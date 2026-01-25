import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "(png|jpe?g|",
    replace: {
      match: "png|jpe?g|",
      replacement: "$&svg|"
    }
  },
  {
    find: '.provider&&"Discord"===',
    replace: [
      {
        match: /renderAttachments\((\i)\){/,
        replacement: (orig, props) => `${orig}require("svgEmbed_processor").processAttachments(${props});`
      },
      {
        match: /renderEmbeds\((\i)\){/,
        replacement: (orig, props) =>
          `${orig}if(moonlight.getConfigOption("svgEmbed","embedLinks")??true)require("svgEmbed_processor").processEmbeds(${props});`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  processor: {
    dependencies: [{ id: "discord/Dispatcher" }, { id: "discord/Constants" }]
  }
};
