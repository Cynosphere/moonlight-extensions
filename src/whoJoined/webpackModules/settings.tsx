import type { CustomComponentProps } from "@moonlight-mod/types/coreExtensions/moonbase";
import Field from "@moonlight-mod/wp/discord/design/components/Form/web/Field";
import Moonbase from "@moonlight-mod/wp/moonbase_moonbase";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

let SingleSelect: typeof import("@moonlight-mod/wp/discord/components/common/Select")["SingleSelect"];

function VoiceSettings({ value = "", setValue, disabled }: CustomComponentProps): React.ReactNode {
  if (!SingleSelect) {
    SingleSelect = spacepack.require("discord/components/common/Select").SingleSelect;
  }

  const voices = window.speechSynthesis.getVoices();
  let voice = voices.find((voice) => voice.default)?.name;
  if (value !== "") {
    voice = voices.find((voice) => voice.name === value)?.name;
  }

  return (
    <Field label="Text to Speech Voice" disabled={disabled}>
      <SingleSelect
        autofocus={false}
        clearable={false}
        value={voice}
        options={voices.map((voice) => ({ value: voice.name, label: voice.name }))}
        onChange={(value: string) => {
          if (disabled) return;
          setValue(value);
        }}
      />
    </Field>
  );
}

Moonbase.registerConfigComponent("whoJoined", "ttsVoice", VoiceSettings);
