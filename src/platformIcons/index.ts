import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

const alwaysShowMobile = () => moonlight.getConfigOption<boolean>("platformIcons", "alwaysShowMobile") ?? true;

export const patches: Patch[] = [
  // Messages
  // TODO: probably api-ify this
  {
    find: '},"new-member")),',
    replace: {
      match: /(?<=(\(0,\i\.jsx\)).+?)\.BADGES]=(.);/,
      replacement: (_, createElement, badges) =>
        `.BADGES]=[${createElement}(require("platformIcons_icons").default,{user:arguments[0].message.author,configKey:"messages",extraClasses:["platform-icons-message"],size:"sm"}),...${badges}];`
    }
  },

  // Member list
  // TODO: api-ify
  {
    find: ".lostPermission",
    replace: {
      match: /(\(0,\i\.jsxs\))\(\i\.Fragment,{children:\[\i\(\),/,
      replacement: (orig: string, createElement) =>
        `${orig}${createElement}(require("platformIcons_icons").default,{user:arguments[0].user,configKey:"memberList",extraClasses:["platform-icons-member-list"]}),`
    }
  },

  // DM list
  // TODO: api-ify
  {
    find: ".interactiveSystemDM]:",
    replace: {
      match: /decorators:(\i\.isSystemDM\(\)\?(\(0,\i\.jsx\))\(.+?verified:!0}\):null)/,
      replacement: (_, orig, createElement) =>
        `decorators:[${orig},${createElement}(require("platformIcons_icons").default,{user:arguments[0].user,configKey:"directMessages",extraClasses:["platform-icons-private-message"]})]`
    }
  },

  // Profile
  // TODO: api-ify
  {
    find: ".userTagDiscriminator,hideBotTag:!0",
    replace: {
      match: /,(\(0,\i\.jsx\))\(\i\.\i,{userId:(\i)\.id,.+?(\i)\.clanTag}\),/,
      replacement: (orig: string, createElement, user, ProfileClasses) =>
        `${orig}${createElement}(require("platformIcons_icons").default,{user:${user},configKey:"profiles",extraClasses:["platform-icons-profile", ${ProfileClasses}.clanTagContainer, ${ProfileClasses}.clanTag]}),`
    }
  },

  // Voice icons
  {
    find: ".listCollapse",
    replace: {
      match: /(?<=(\(0,\i\.jsxs\))\("div",{className:\i\.iconGroup,onMouseEnter:.+?\(!1\)),children:\[/,
      replacement: (_, createElement) =>
        `,children:[${createElement}(require("platformIcons_voice").default,arguments[0]),`
    }
  },

  // Always show mobile
  {
    find: '"PresenceStore"',
    replace: {
      match: /(?<=return null!=\i&&\i\[\i\.\i\.MOBILE\])===\i\.\i\.ONLINE/,
      replacement: "!=null"
    },
    prerequisite: alwaysShowMobile
  },
  {
    find: '"getMaskId(): Unsupported type, size: "',
    replace: [
      {
        match: /&&\i===\i\.\i\.ONLINE/,
        replacement: ""
      },
      {
        match: /\|\|\i===\i\.\i\.ONLINE&&/,
        replacement: "&&"
      },
      {
        match: /if\(\i===\i\.\i\.ONLINE&&/,
        replacement: "if("
      }
    ],
    prerequisite: alwaysShowMobile
  },
  {
    find: ')("useStatusFillColor")',
    replace: [
      {
        match: /(?<=\.STATUS_TYPING;)(switch.+?default:)(if\(\i\)return \i\.\i\.Masks\.STATUS_ONLINE_MOBILE;)/,
        replacement: (_, body, mobileCheck) => `${mobileCheck}${body}`
      },
      {
        // why is this check there twice, are they stupid?
        match: /\i===\i\.\i\.ONLINE&&/g,
        replacement: ""
      }
    ],
    prerequisite: alwaysShowMobile
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
