import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Replace the existing activity/stream wrapper component with one we can add to easier
  {
    find: '"UserProfileFeaturedActivity"',
    replace: {
      match: /:\(\)=>(\i)}/,
      replacement: (_, orig) => `:()=>(props)=>require("allActivities_activities").default(props,${orig})}`
    }
  },

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
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  activities: {
    dependencies: [
      { id: "react" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "common", id: "stores" },
      '"UserProfileFeaturedActivity"',
      'location:"UserProfileActivityCardWrapper"'
    ]
  },
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
      'location:"UserProfileActivityCardWrapper"'
    ]
  }
};
