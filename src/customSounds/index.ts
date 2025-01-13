import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '("sound has no duration"),',
    replace: [
      {
        match: /(let \i=await fetch\()(\i\(\d+\)\("\.\/"\.concat\((\i),"\.mp3"\)\))/,
        replacement: (_, start, url, soundName) =>
          `const url=require("customSounds_replacer").default(${soundName})??${url};${start}url`
      },
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
      "intl:",
      '"./discodo.mp3":'
    ]
  }
};
