import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  migrate: {
    entrypoint: true,
    dependencies: [
      { ext: "notices", id: "notices" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "moonbase", id: "stores" },
      { id: "discord/components/common/index" }
    ]
  }
};
