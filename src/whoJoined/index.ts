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
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { id: "discord/design/components/Form/web/Field" },
      { id: "discord/components/common/Select" },
      { id: "discord/styles/shared/Margins.css" }
    ]
  }
};
