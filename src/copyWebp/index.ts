import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "discord/utils/NativeUtils",
    replace: [
      // add to copy list
      {
        match: '"png"]',
        replacement: '"png","webp"]'
      },
      // intercept copying to convert if needed
      {
        match: /(?<=;)\i\.clipboard\.copyImage\(\i\.from\((\i)\),\i\)/,
        replacement: (orig, buffer) => `
if(/RIFF...?.?WEBP/.test(new TextDecoder("utf-8").decode(${buffer}.slice(0,12)))){
  ${buffer} = await moonlight.getNatives("copyWebp").convertWebp(${buffer});
}
${orig}
`
      }
    ]
  }
];
