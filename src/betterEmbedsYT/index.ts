import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ".VIDEO_EMBED_PLAYBACK_STARTED,",
    replace: {
      match: /return (\i)\.type===(\i\.\i)\.RICH&&.+?,description:(\i),/,
      replacement: (orig, embed, EmbedTypes, description) =>
        `if(${embed}.type===${EmbedTypes}.VIDEO&&${embed}.provider?.name==="YouTube"){${description}=require("betterEmbedsYT_description").default(this.props);}${orig}`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("betterEmbedsYT", "description") ?? true
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  description: {
    dependencies: [
      { id: "react" },
      { id: "discord/design/components/Clickable/web/Clickable" },
      { ext: "spacepack", id: "spacepack" }
    ]
  }
};
