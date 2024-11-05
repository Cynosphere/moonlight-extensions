import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Replace the existing activity/stream wrapper component with one we can add to easier
  {
    find: /user:.,currentUser:.,stream:.,className:.+?user:.,currentUser:.,activity:.,className:/,
    replace: {
      match: /:function\(\){return (.)}/,
      replacement: ':function(){return require("allActivities_activities").default}'
    }
  },

  // Make streams account for "Competing In"
  {
    find: '.STREAM_PREVIEW="StreamPreview"',
    replace: {
      match: /\(null==.\?void 0:.\.type\)!==.\.[a-zA-Z_$][\w$]*\.PLAYING&&/,
      replacement: (orig: string) => orig + orig.replace("PLAYING", "COMPETING")
    }
  },

  // Do not de-duplicate entries in useUserProfileActivity
  {
    find: '("use-user-profile-activity")',
    replace: {
      match: /\(0,.\.uniqWith\)/,
      replacement: "((inp)=>inp)"
    }
  },

  // Icons
  {
    find: ".lostPermission",
    replace: {
      match: /name:null==.\?(\(0,.\.jsx\))\("span"/,
      replacement: (orig, createElement) =>
        `children:${createElement}(require("allActivities_icons").default,{user:arguments[0].user}),${orig}`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("allActivities", "icons") ?? true
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  activities: {
    dependencies: [{ id: "react" }, { ext: "spacepack", id: "spacepack" }]
  },
  icons: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { ext: "common", id: "stores" },
      { id: "discord/Constants" },
      { id: "discord/components/common/index" },
      'applicationStreamingPreviewWrapper:"applicationStreamingPreviewWrapper_'
    ]
  }
};
