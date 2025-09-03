import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Make streams account for "Competing In"
  {
    find: '.STREAM_PREVIEW="StreamPreview"',
    replace: {
      match: /\(null==\i\?void 0:\i\.type\)!==\i\.\i\.PLAYING&&/,
      replacement: (orig: string) => orig + orig.replace("PLAYING", "COMPETING")
    }
  },

  // Do not de-duplicate entries in useUserProfileActivity
  {
    find: 'location:"useUserProfileActivity"',
    replace: {
      match: /\(0,\i\.uniqWith\)/,
      replacement: "((inp)=>inp)"
    }
  },

  // Do NOT only allow ONE playing activity to be sent out, what are they THINKING
  {
    find: '"displayName","SelfPresenceStore"',
    replace: {
      match: /\i\.type===\i\.\i\.PLAYING\?\i\.push\(\i\):/,
      replacement: ""
    }
  },
  {
    find: '"displayName","PresenceStore"',
    replace: {
      match: /\i\.type===\i\.\i\.PLAYING\?\i\.push\(\i\):/,
      replacement: ""
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  icons: {
    entrypoint: true,
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { ext: "common", id: "stores" },
      { id: "discord/Constants" },
      { id: "discord/components/common/index" },
      { ext: "componentEditor", id: "memberList" },
      'applicationStreamingPreviewWrapper:"applicationStreamingPreviewWrapper_',
      { id: "discord/modules/user_profile/web/UserProfileActivityCardWrapper" }
    ]
  }
};
