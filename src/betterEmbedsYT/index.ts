import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ".VIDEO_EMBED_PLAYBACK_STARTED,",
    replace: {
      match: /(case \i\.\i\.VIDEO:)(case \i\.\i\.GIFV:)break;(?=default:(\i)=)/,
      replacement: (_, VIDEO, GIFV, description) =>
        `${GIFV}break;${VIDEO}if(this.props.embed.provider?.name==="YouTube"){${description}=require("betterEmbedsYT_description").default(this.props);}break;`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("betterEmbedsYT", "description") ?? true
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  description: {
    dependencies: [{ id: "react" }, { id: "discord/components/common/index" }, { ext: "spacepack", id: "spacepack" }]
  }
};
