import { Config } from "@moonlight-mod/types";
import Notices from "@moonlight-mod/wp/notices_notices";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { NoticeColors } from "@moonlight-mod/wp/discord/components/common/index";

const { MoonbaseSettingsStore } = spacepack.require("moonbase_stores");

const logger = moonlight.getLogger("chatTweaks/migrator");

async function migrate() {
  const config: Config = JSON.parse(JSON.stringify(moonlightNode.config));

  async function install(ext: string) {
    const extObj = Object.entries(MoonbaseSettingsStore.extensions).find(([k, v]: [k: string, v: any]) => v.id === ext);

    if (extObj == null) {
      logger.warn("No extension found?", ext);
      return;
    }

    const [id, extension] = extObj;

    // @ts-expect-error idk how to get this type
    if (!extension.source.url) {
      logger.warn("Skipping install due to assuming local", ext, id);
      return;
    }

    try {
      await MoonbaseSettingsStore.installExtension(parseInt(id));
    } catch (e) {
      logger.error("Failed to install extension", ext, id, e);
    }
  }

  function setEnabled(ext: string, enabled: boolean) {
    // assign to a temp var to make tsc happy
    let extCfg = config.extensions[ext];
    if (extCfg == null || typeof extCfg === "boolean") {
      extCfg = enabled;
    } else {
      extCfg.enabled = enabled;
    }
    config.extensions[ext] = extCfg;
  }

  // copied from moonlight
  function setConfigOption<T>(config: Config, ext: string, key: string, value: T) {
    const oldConfig = config.extensions[ext];
    const newConfig =
      typeof oldConfig === "boolean"
        ? {
            enabled: oldConfig,
            config: { [key]: value }
          }
        : {
            ...oldConfig,
            config: { ...(oldConfig?.config ?? {}), [key]: value }
          };

    config.extensions[ext] = newConfig;
  }

  // o7
  setEnabled("chatTweaks", false);

  if (moonlight.getConfigOption<boolean>("chatTweaks", "noReplyPing") ?? true) {
    await install("noReplyPing");
    setEnabled("noReplyPing", true);
    setConfigOption(config, "noReplyPing", "invertList", moonlight.getConfigOption("chatTweaks", "noReplyPingInvert"));
    setConfigOption(
      config,
      "noReplyPing",
      "disabledPingList",
      moonlight.getConfigOption("chatTweaks", "noReplyPingList")
    );
  }

  if (moonlight.getConfigOption<boolean>("chatTweaks", "noReplyChainNag") ?? true) {
    await install("noReplyChainNag");
    setEnabled("noReplyChainNag", true);
  }

  if (
    (moonlight.getConfigOption<boolean>("chatTweaks", "appToBot") ?? true) ||
    (moonlight.getConfigOption<boolean>("chatTweaks", "webhookTag") ?? true)
  ) {
    await install("betterTags");
    setEnabled("betterTags", true);
    setConfigOption(config, "betterTags", "appToBot", moonlight.getConfigOption("chatTweaks", "appToBot"));
    setConfigOption(config, "betterTags", "webhookTag", moonlight.getConfigOption("chatTweaks", "webhookTag"));
  }

  if (moonlight.getConfigOption<boolean>("chatTweaks", "jumpToBlocked") ?? true) {
    await install("jumpToBlocked");
    setEnabled("jumpToBlocked", true);
  }

  if (
    (moonlight.getConfigOption<boolean>("chatTweaks", "hideBlocked") ?? false) ||
    (moonlight.getConfigOption<boolean>("chatTweaks", "hideIgnored") ?? false)
  ) {
    await install("hideBlocked");
    setEnabled("hideBlocked", true);
    setConfigOption(config, "hideBlocked", "blocked", moonlight.getConfigOption("chatTweaks", "hideBlocked"));
    setConfigOption(config, "hideBlocked", "ignored", moonlight.getConfigOption("chatTweaks", "hideIgnored"));
  }

  if (moonlight.getConfigOption<boolean>("chatTweaks", "alwaysShowOwnerCrown") ?? true) {
    await install("ownerCrown");
    setEnabled("ownerCrown", true);
  }

  if (moonlight.getConfigOption<boolean>("chatTweaks", "noMaskedLinkPaste") ?? true) {
    await install("noMaskedLinkPaste");
    setEnabled("noMaskedLinkPaste", true);
  }

  if (
    (moonlight.getConfigOption<boolean>("chatTweaks", "doubleClickEdit") ?? true) ||
    (moonlight.getConfigOption<boolean>("chatTweaks", "doubleClickReply") ?? true)
  ) {
    await install("doubleClickActions");
    setEnabled("doubleClickActions", true);
    setConfigOption(
      config,
      "doubleClickActions",
      "allowEdit",
      moonlight.getConfigOption("chatTweaks", "doubleClickEdit")
    );
    setConfigOption(
      config,
      "doubleClickActions",
      "allowReply",
      moonlight.getConfigOption("chatTweaks", "doubleClickReply")
    );
    setConfigOption(
      config,
      "doubleClickActions",
      "swapSelf",
      moonlight.getConfigOption("chatTweaks", "doubleClickSwapSelf")
    );
  }

  await moonlightNode.writeConfig(config);
}

let inProgress = false;
Notices.addNotice({
  element: "Chat Tweaks has been split into multiple extensions. This extension now only acts as a migrator.",
  showClose: true,
  color: NoticeColors.INFO,
  buttons: [
    {
      name: "Migrate",
      onClick: () => {
        if (!inProgress) {
          inProgress = true;
          (async () => {
            try {
              await migrate();
              Notices.addNotice({
                element: "Chat Tweaks migrated successfully.",
                showClose: true,
                buttons: [
                  {
                    name: "Reload",
                    onClick: () => {
                      window.location.reload();
                      return true;
                    }
                  }
                ]
              });
            } catch (e) {
              logger.error("Error migrating", e);
              Notices.addNotice({
                element: "Chat Tweaks failed to migrate. Check console for more information.",
                showClose: true,
                color: NoticeColors.DANGER
              });
            }
          })();
        }

        return true;
      }
    }
  ]
});
