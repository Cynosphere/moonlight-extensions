import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  user: {
    dependencies: [
      { id: "react" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "contextMenu", id: "contextMenu" },
      { id: "discord/components/common/index" },
      { id: "discord/actions/UserActionCreators" },
      { id: "discord/actions/UserProfileModalActionCreators" }
    ],
    entrypoint: true
  }
};
