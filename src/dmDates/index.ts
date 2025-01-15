import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  dmDates: {
    entrypoint: true,
    dependencies: [
      { id: "react" },
      { id: "discord/components/common/index" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "componentEditor", id: "dmList" },
      moonlight.enabledExtensions.has("dmFavorites") && { ext: "dmFavorites", id: "icon" }
    ].filter((d) => !!d)
  }
};
