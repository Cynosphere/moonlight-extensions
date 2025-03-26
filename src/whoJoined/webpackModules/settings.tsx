import React from "@moonlight-mod/wp/react";
import Moonbase from "@moonlight-mod/wp/moonbase_moonbase";
import { FormItem, SingleSelect } from "@moonlight-mod/wp/discord/components/common/index";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import type { CustomComponentProps } from "@moonlight-mod/types/coreExtensions/moonbase";

function VoiceSettings({ value = "", setValue }: CustomComponentProps): React.ReactNode {
  const voices = window.speechSynthesis.getVoices();
  let voice = voices.find((voice) => voice.default)?.name;
  if (value !== "") {
    voice = voices.find((voice) => voice.name === value)?.name;
  }

  return (
    <FormItem className={Margins.marginTop20} title="Text to Speech Voice">
      <SingleSelect
        autofocus={false}
        clearable={false}
        value={voice}
        options={voices.map((voice) => ({ value: voice.name, label: voice.name }))}
        onChange={(value: string) => {
          setValue(value);
        }}
      />
    </FormItem>
  );
}

Moonbase.registerConfigComponent("whoJoined", "ttsVoice", VoiceSettings);
