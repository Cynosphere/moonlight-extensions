import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Replace the existing activity/stream wrapper component with one we can add to easier
  {
    find: '"UserProfileFeaturedActivity"',
    replace: {
      match: /:function\(\){return (\i)}/,
      replacement: ':function(){return require("allActivities_activities").default}'
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
    find: '("use-user-profile-activity")',
    replace: {
      match: /\(0,\i\.uniqWith\)/,
      replacement: "((inp)=>inp)"
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  activities: {
    dependencies: [{ id: "react" }, { ext: "spacepack", id: "spacepack" }]
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
      'applicationStreamingPreviewWrapper:"applicationStreamingPreviewWrapper_'
    ]
  }
};
