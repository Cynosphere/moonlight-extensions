import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // actually implement the sorting logic
  {
    find: '"PrivateChannelSortStore"',
    replace: {
      match: "isFavorite:!1,",
      replacement: `isFavorite:((require("common_stores").UserGuildSettingsStore.getChannelOverrides("null")[arguments[0].id]??{}).flags&2048)!==0,`
    }
  },

  // icon indicator
  {
    find: ".interactiveSystemDM]:",
    replace: {
      match: /:null,((\(0,(\i)\.jsx\))\(\i,{"aria-label":)/,
      replacement: (_, orig, createElement, ReactJSX) =>
        `:null,${createElement}(require("dmFavorites_icon")?.default??${ReactJSX}.Fragment,arguments[0]),${orig}`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  context: {
    entrypoint: true,
    dependencies: [
      { id: "react" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "contextMenu", id: "contextMenu" },
      { ext: "common", id: "stores" },
      "intl:",
      '.dispatch({type:"USER_GUILD_SETTINGS_CHANNEL_UPDATE_BULK",'
    ]
  },
  icon: {
    dependencies: [
      { id: "react" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "common", id: "stores" },
      { id: "discord/components/common/index" }
    ]
  }
};
