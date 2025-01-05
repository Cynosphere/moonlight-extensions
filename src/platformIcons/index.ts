import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Messages
  // TODO: probably api-ify this
  {
    find: '},"new-member")),',
    replace: {
      match: /(?<=(\(0,.\.jsx\)).+?)\.BADGES]=(.);/,
      replacement: (_, createElement, badges) =>
        `.BADGES]=[${createElement}(require("platformIcons_icons").default,{user:arguments[0].message.author,extraClasses:["platform-icons-message"],size:"sm"}),...${badges}];`
    }
  },

  // Member list
  // TODO: api-ify
  {
    find: ".lostPermission",
    replace: {
      match: /(\(0,.\.jsxs\))\(.\.Fragment,{children:\[.{1,2}\(\),/,
      replacement: (orig: string, createElement) =>
        `${orig}${createElement}(require("platformIcons_icons").default,{user:arguments[0].user,extraClasses:["platform-icons-member-list"]}),`
    }
  },

  // DM list
  // TODO: api-ify
  {
    find: ".interactiveSystemDM]:",
    replace: {
      match: /decorators:(.\.isSystemDM\(\)\?(\(0,.\.jsx\))\(.+?verified:!0}\):null)/,
      replacement: (_, orig, createElement) =>
        `decorators:[${orig},${createElement}(require("platformIcons_icons").default,{user:arguments[0].user,extraClasses:["platform-icons-private-message"]})]`
    }
  },

  // Profile
  // TODO: api-ify
  {
    find: ".userTagDiscriminator,hideBotTag:!0",
    replace: {
      match: /,(\(0,.\.jsx\))\(.\.ZP,{userId:(.)\.id,.+?(.)\.clanTag}\),/,
      replacement: (orig: string, createElement, user, ProfileClasses) =>
        `${orig}${createElement}(require("platformIcons_icons").default,{user:${user},extraClasses:["platform-icons-profile", ${ProfileClasses}.clanTagContainer, ${ProfileClasses}.clanTag]}),`
    }
  },

  // Voice icons
  {
    find: ".listCollapse",
    replace: {
      match: /(?<=(\(0,.\.jsxs\))\("div",{className:.\.iconGroup,onMouseEnter:.+?\(!1\)),children:\[/,
      replacement: (_, createElement) =>
        `,children:[${createElement}(require("platformIcons_voice").default,arguments[0]),`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  icons: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { id: "discord/packages/flux" },
      { id: "discord/components/common/index" },
      { ext: "common", id: "stores" },
      "humanizeStatus:"
    ]
  },
  voice: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { id: "discord/packages/flux" },
      { id: "discord/components/common/index" },
      { ext: "common", id: "stores" },
      '.PLAYSTATION=3]="PLAYSTATION"'
    ]
  }
};
