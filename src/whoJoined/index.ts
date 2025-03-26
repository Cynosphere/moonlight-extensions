import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  whoJoined: {
    entrypoint: true,
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "discord/Dispatcher" },
      { id: "discord/Constants" },
      { ext: "common", id: "stores" }
    ]
  },
  settings: {
    entrypoint: true,
    dependencies: [
      { ext: "moonbase", id: "moonbase" },
      { id: "react" },
      { id: "discord/components/common/index" },
      { id: "discord/styles/shared/Margins.css" }
    ]
  }
};
