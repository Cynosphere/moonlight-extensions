import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";
import { PlatformStyle, PlatformUtils } from "./types";

export const patches: Patch[] = [
  {
    find: ".window.USE_OSX_NATIVE_TRAFFIC_LIGHTS",
    replace: {
      match: /switch\((\i)\){case (\i)\.PlatformTypes\.WINDOWS:/,
      replacement: (_, platformType, platformUtils) =>
        `${platformType}=require("platformStyles_helper").platformBorders(${platformUtils});switch(${platformType}){case ${platformUtils}.PlatformTypes.WINDOWS:`
    }
  },
  {
    find: '" platform-overlay"',
    replace: {
      match: /(\i)="platform-web"\),/,
      replacement: (orig, className) =>
        `${orig}(${className}=require("platformStyles_helper").platformClass()??${className}),`
    }
  },
  {
    find: ".ensureIsInPosition=",
    replace: {
      match: /(\i)=\i!==(\i)\.PlatformTypes\.WEB&&this\.inPopout\?22:0;/,
      replacement: (_, pipOffset, platformUtil) =>
        `${pipOffset}=require("platformStyles_helper").platformBorders(${platformUtil})!==${platformUtil}.PlatformTypes.WEB&&this.inPopout?22:0;`
    }
  },

  // visual refresh
  {
    find: ".winButtonsWithDivider]:",
    replace: {
      match: /\(0,(\i)\.getPlatform\)\(\)/g,
      replacement: (_, platformUtil) => `require("platformStyles_helper").platformBorders(${platformUtil})`
    }
  },

  // transparency fix for switching themes
  {
    find: "discord/utils/NativeUtils",
    replace: {
      match: /"SETTINGS_UPDATE_BACKGROUND_COLOR",\i\)/,
      replacement: `"SETTINGS_UPDATE_BACKGROUND_COLOR","#00000000")`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("platformStyles", "transparency") ?? false
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
