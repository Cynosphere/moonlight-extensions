import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  notification: {
    entrypoint: true,
    dependencies: [
      { id: "react" },
      { id: "discord/design/components/Clickable/web/Clickable" },
      { id: "discord/design/components/Text/Text" },
      { id: "discord/design/components/Toast/web/Toast" },
      { id: "discord/design/components/Toast/web/ToastAPI" },
      { id: "discord/design/components/Toast/web/ToastConstants" },
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
