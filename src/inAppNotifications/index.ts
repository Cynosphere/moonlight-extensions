import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  notification: {
    entrypoint: true,
    dependencies: [
      { id: "react" },
      { id: "discord/components/common/index" },
      { id: "discord/packages/flux" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "common", id: "stores" },
      { id: "discord/Constants" },
      { id: "discord/utils/AvatarUtils" },
      '"NotificationTextUtils"',
      '"Result cannot be null because the message is not null"',
      '"1088216706570268682"'
    ]
  }
};
