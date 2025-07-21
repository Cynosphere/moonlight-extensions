import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: 'location:"UserProfilePopoutBody"',
    replace: {
      match: /:(\(0,\i\.jsx\))\(\i\.\i,{user:\i,bio:null==\i\?void 0:\i\.bio,hidePersonalInformation:\i,onClose:\i}\),/,
      replacement: (orig, createElement) =>
        `${orig}${createElement}(require("popoutDates_component").default,{userId:arguments[0].user.id,guildId:arguments[0].guild?.id}),`
    }
  },

  {
    find: ".memberSince,",
    replace: [
      // always show discord icon
      {
        match: /return (null==\i\|\|null==\i)\?.+?}\):(.+?)(\(0,\i\.jsx\)\("div",{className:\i\.divider}\)),/,
        replacement: (_, check, body, divider) => `return${body}${check}?null:${divider},${check}?null:`
      },

      // change tooltips to be more clear
      {
        match: ".t.uvGmCw",
        replacement: ".t.sPph4O"
      },
      {
        match: /(?<=text:(\i)\.intl.+?)text:(\i\.name),/,
        replacement: (_, i18n, guildName) => `text:${i18n}.intl.format(${i18n}.t.FXREhY,{guildName:${guildName}}),`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  component: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { ext: "common", id: "ErrorBoundary" },
      ".memberSince,",
      'location:"UserProfilePopoutBody"'
    ]
  }
};
