import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  suppressor: {
    entrypoint: true,
    dependencies: [{ id: "discord/Dispatcher" }]
  }
};
