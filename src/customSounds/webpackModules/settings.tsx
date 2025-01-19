import React from "@moonlight-mod/wp/react";
import Moonbase from "@moonlight-mod/wp/moonbase_moonbase";
import type { CustomComponentProps } from "@moonlight-mod/types/coreExtensions/moonbase";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { FormDivider, Text, TextInput } from "@moonlight-mod/wp/discord/components/common/index";

const i18n = spacepack.findByCode("intl:")[0].exports;

const soundNames = spacepack
  .findByCode('"./discodo.mp3":')[0]
  .exports.keys()
  .map((name: string) => name.replace("./", "").replace(".mp3", ""));

const soundStrings: Record<string, string> = {
  call_ringing_beat: "Incoming Call (rare variant)",
  clip_error: "Clip Failed",
  clip_save: "Clip Saved",
  discodo: "Discodo (start-up easter egg)",
  message3: "Same-channel Message",
  stage_waiting: "Stage waiting music",
  vibing_wumpus: "Relax with Wumpus music"
};
moonlight.lunast.register({
  name: "customSounds_NotificationSettings",
  find: ".default.setNotifyMessagesInSelectedChannel,children:",
  process({ id, ast }) {
    const { traverse } = moonlight.lunast.utils;

    traverse(ast, {
      $: { scope: true },
      ArrayExpression({ node }) {
        if (
          node &&
          node.elements.some(
            (obj) =>
              obj &&
              obj.type === "ObjectExpression" &&
              obj.properties.some(
                (prop) =>
                  prop &&
                  prop.type === "Property" &&
                  prop.key &&
                  prop.key.type === "Identifier" &&
                  prop.key.name === "label"
              )
          )
        ) {
          for (const element of node!.elements) {
            if (!element || element.type !== "ObjectExpression") continue;

            const sound = element.properties.find(
              (prop) => prop && prop.type === "Property" && prop.key.type === "Identifier" && prop.key.name === "sound"
            )!;
            if (sound == null) continue;

            const label = element.properties.find(
              (prop) => prop && prop.type === "Property" && prop.key.type === "Identifier" && prop.key.name === "label"
            )!;

            const name =
              sound && sound.type === "Property" && sound.value && sound.value.type === "Literal"
                ? sound.value.value
                : null;
            if (name == null) continue;

            const labelProp =
              label &&
              label.type === "Property" &&
              label.value &&
              label.value.type === "CallExpression" &&
              label.value.arguments[0].type === "MemberExpression" &&
              label.value.arguments[0].property;
            if (!labelProp) continue;

            const langKey =
              labelProp.type === "Identifier" ? labelProp.name : labelProp.type === "Literal" ? labelProp.value : null;
            if (langKey == null) continue;

            soundStrings[name as string] = "intl:" + langKey;
          }
        }
      }
    });

    return true;
  }
});

function SoundSettings({ value = {}, setValue }: CustomComponentProps): React.ReactNode {
  const elements = [];

  for (const name of soundNames) {
    let label = soundStrings[name];
    if (label?.startsWith("intl:")) {
      label = i18n.intl.string(i18n.t[label.replace("intl:", "")]);
    }

    elements.push(
      <>
        <div className="customSounds-sound">
          <div className="customSounds-label">
            {label != null ? <Text variant="text-md/normal">{label}</Text> : null}
            <code className="inline">{name}</code>
          </div>
          <TextInput
            value={value[name] ?? ""}
            onChange={(newValue: string) => {
              if (newValue === "") {
                delete value[name];
              } else {
                value[name] = newValue;
              }

              setValue(value);
            }}
          />
        </div>
        <FormDivider />
      </>
    );
  }

  return elements;
}

Moonbase.registerConfigComponent("customSounds", "sounds", SoundSettings);
