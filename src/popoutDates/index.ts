import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: 'location:"UserProfilePopoutBody"',
    replace: {
      match: /:(\(0,\i\.jsx\))\(\i\.\i,{user:\i,bio:null==\i\?void 0:\i\.bio,hidePersonalInformation:\i,onClose:\i}\),/,
      replacement: (orig, createElement) =>
        `${orig}${createElement}(require("popoutDates_component").default,{userId:arguments[0].user.id,guildId:arguments[0].guild?.id}),`
    }
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
