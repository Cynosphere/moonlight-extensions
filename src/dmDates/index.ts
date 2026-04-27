import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  dmDates: {
    entrypoint: true,
    dependencies: [
      { id: "react" },
      { id: "discord/design/components/Text/Text" },
      { id: "discord/packages/flux" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "common", id: "stores" },
      { ext: "componentEditor", id: "dmList" },
      moonlight.enabledExtensions.has("dmFavorites") && { ext: "dmFavorites", id: "icon" }
    ].filter((d) => !!d)
  }
};
