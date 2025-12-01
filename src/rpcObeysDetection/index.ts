import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  entrypoint: {
    entrypoint: true,
    dependencies: [{ ext: "spacepack", id: "spacepack" }, { ext: "common", id: "stores" }, { id: "discord/Dispatcher" }]
  }
};
