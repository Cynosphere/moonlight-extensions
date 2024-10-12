import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";
import { PlatformStyle, PlatformUtils } from "./types";

export const patches: Patch[] = [
  {
    find: /switch\((.{1,2})\){case (.{1,2})\.PlatformTypes\.WINDOWS:/g,
    replace: {
      match: /switch\((.{1,2})\){case (.{1,2})\.PlatformTypes\.WINDOWS:/,
      replacement: (_, platformType, platformUtils) =>
        `${platformType}=require("platformStyles_helper").platformBorders(${platformUtils});switch(${platformType}){case ${platformUtils}.PlatformTypes.WINDOWS:`
    }
  },
  {
    find: '" platform-overlay"',
    replace: {
      match: /(.)="platform-web"\),/,
      replacement: (orig, className) =>
        `${orig}(${className}=require("platformStyles_helper").platformClass()??${className}),`
    }
  },
  {
    find: ".ensureIsInPosition=",
    replace: {
      match: /(.{1,2})=.{1,2}!==(.{1,2})\.PlatformTypes\.WEB&&this\.inPopout\?22:0;/,
      replacement: (_, pipOffset, platformUtil) =>
        `${pipOffset}=require("platformStyles_helper").platformBorders(${platformUtil})!==${platformUtil}.PlatformTypes.WEB&&this.inPopout?22:0;`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  helper: {
    run: function (module, exports, require) {
      const style = moonlight.getConfigOption<PlatformStyle>("platformStyles", "style") ?? "default";

      function platformBorders(platformUtils: PlatformUtils) {
        switch (style) {
          case "win":
            return platformUtils.PlatformTypes.WINDOWS;
          case "osx":
            return platformUtils.PlatformTypes.OSX;
          case "linux":
            return platformUtils.PlatformTypes.LINUX;
          case "web":
            return platformUtils.PlatformTypes.WEB;
          default:
            return platformUtils.getPlatform();
        }
      }
      function platformClass() {
        switch (style) {
          case "win":
            return "platform-win";
          case "osx":
            return "platform-osx";
          case "linux":
            return "platform-linux";
          case "web":
            return "platform-web";
          default:
            // there's an OR in the patch which will apply the system class if unset
            return null;
        }
      }
      module.exports = {
        platformBorders,
        platformClass
      };
    }
  },

  popoutFix: {
    dependencies: [{ id: "discord/Dispatcher" }],
    entrypoint: true
  }
};
