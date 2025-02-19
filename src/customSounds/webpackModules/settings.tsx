import React from "@moonlight-mod/wp/react";
import Moonbase from "@moonlight-mod/wp/moonbase_moonbase";
import type { CustomComponentProps } from "@moonlight-mod/types/coreExtensions/moonbase";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { FormDivider, Text, TextInput } from "@moonlight-mod/wp/discord/components/common/index";

const i18n = spacepack.require("discord/intl");
const intl = spacepack.findObjectFromKey(i18n, "_forceLookupMatcher");

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
    const { traverse, is } = moonlight.lunast.utils;

    traverse(ast, {
      $: { scope: true },
      ArrayExpression({ node }) {
        if (
          node &&
          node.elements.some(
            (obj) =>
              is.objectExpression(obj) &&
              obj.properties.some(
                (prop) => prop && is.property(prop) && is.identifier(prop.key) && prop.key.name === "label"
              )
          )
        ) {
          for (const element of node!.elements) {
            if (!is.objectExpression(element)) continue;

            const sound = element.properties.find(
              (prop) => is.property(prop) && is.identifier(prop.key) && prop.key.name === "sound"
            )!;
            if (sound == null) continue;

            const label = element.properties.find(
              (prop) => is.property(prop) && is.identifier(prop.key) && prop.key.name === "label"
            )!;

            const name = is.property(sound) && is.literal(sound.value) ? sound.value.value : null;
            if (name == null) continue;

            const labelProp =
              is.property(label) &&
              is.callExpression(label.value) &&
              is.memberExpression(label.value.arguments[0]) &&
              label.value.arguments[0].property;
            if (!labelProp) continue;

            const langKey = is.identifier(labelProp) ? labelProp.name : is.literal(labelProp) ? labelProp.value : null;
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
      label = intl.string(i18n.t[label.replace("intl:", "")]);
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
