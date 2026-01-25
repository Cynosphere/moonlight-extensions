import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

const alwaysShowMobile = () => moonlight.getConfigOption<boolean>("platformIcons", "alwaysShowMobile") ?? true;

export const patches: Patch[] = [
  // Profile
  // TODO: api-ify
  {
    find: /:\i\.\i,hideBotTag:!0/,
    replace: {
      match: /(,(\(0,\i\.jsx\))\(\i\.\i,{primaryGuild:\i,userId:(\i)\.id,onClose:\i.*?}\),\i)]/,
      replacement: (_, orig, createElement, user) =>
        `${orig},${createElement}(require("platformIcons_icons").default,{user:${user},configKey:"profiles",extraClasses:["platform-icons-profile"]})]`
    }
  },

  // Voice icons
  {
    find: '["avatarContainerClass","userNameClassName","size","selected","disabled","isOverlay","ref"]',
    replace: {
      match: /;(?=\i&&\(\i\?(\i)\.push\((\(0,\i\.jsx\)))/,
      replacement: (_, icons, createElement) =>
        `;${icons}.push(${createElement}(require("platformIcons_voice").default,arguments[0]));`
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
    find: ".STATUS_TYPING;switch",
    replace: [
      {
        match: /(?<=\.STATUS_TYPING;)(switch.+?default:)(if\(\i\)return \i\.\i\.Masks\.STATUS_ONLINE_MOBILE;)/,
        replacement: (_, body, mobileCheck) => `${mobileCheck}${body}`
      },
      {
        // why is this check there twice, are they stupid?
        match: /\i===\i\.\i\.ONLINE&&/g,
        replacement: ""
      },
      {
        match:
          /(?<=dotRadius:0};)(switch\(\i\){case \i\.\i\.ONLINE:)(if\(\i\)return{bgRadius:.+?,dotRadius:.125\*\i};)/,
        replacement: (_, online, mobileCheck) => `${mobileCheck}${online}`
      }
    ],
    prerequisite: alwaysShowMobile
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  icons: {
    entrypoint: true,
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { id: "discord/packages/flux" },
      { id: "discord/components/common/index" },
      { ext: "common", id: "stores" },
      { ext: "componentEditor", id: "dmList" },
      { ext: "componentEditor", id: "memberList" },
      { ext: "componentEditor", id: "messages" },
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
