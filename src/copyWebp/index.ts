import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // add to copy list
  {
    find: '="https://media.discordapp.net",',
    replace: {
      match: '"png"]',
      replacement: '"png","webp"]'
    }
  },

  // intercept copying to convert if needed
  {
    find: '"Copy image method called outside native app"',
    replace: {
      match: /(\i)=await \i\(\i\);/,
      replacement: (orig, buffer) => `${orig}
if(/RIFF...?.?WEBP/.test(new TextDecoder("utf-8").decode(${buffer}.slice(0,12)))){
  ${buffer} = await moonlight.getNatives("copyWebp").convertWebp(${buffer});
}
`
    }
  }
];
