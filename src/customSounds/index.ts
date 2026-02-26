import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '("sound has no duration"),',
    replace: [
      {
        match: /new Audio;\i\.src=/,
        replacement: `$&require("customSounds_replacer").default(this.name)??`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  replacer: {},
  settings: {
    entrypoint: true,
    dependencies: [
      { id: "react" },
      { ext: "spacepack", id: "spacepack" },
      { id: "discord/components/common/index" },
      { id: "discord/intl" },
      '"./discodo.mp3":'
    ]
  }
};
