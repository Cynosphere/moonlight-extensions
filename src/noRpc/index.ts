import { Patch } from "@moonlight-mod/types";

function noGameDetection() {
  return moonlight.getConfigOption<boolean>("noRpc", "ps5") ?? true;
}

export const patches: Patch[] = [
  // Prevent RPC from loading
  {
    find: 'ensureModule("discord_rpc")',
    replace: {
      match: /"discord_rpc"\).then\(\(\)=>{.+?}\)/,
      replacement: '"discord_rpc")'
    }
  },

  // Disable game detection
  {
    find: '"RunningGameStore"',
    replace: [
      {
        match:
          /.\.[a-zA-Z]+\.dispatch(\({type:"RUNNING_GAMES_CHANGE",games:.,added:.,removed:.}\))/,
        // this isn't just a removal because haha removing breaks quietLoggers
        // and i dont feel like fixing (nor should i even have to fix, if you
        // pretend that im just a standard extension dev in this scenario)
        replacement: (_, data) => `(()=>{})${data}`
      },
      {
        match: /(get(Visible)?RunningGames)\(\){return .+?}/g,
        replacement: (_, func) => `${func}(){return []}`
      },
      {
        match: /(getVisibleGame|getCurrentGameForAnalytics)\(\){return .+?}/g,
        replacement: (_, func) => `${func}(){return null}`
      }
    ],
    prerequisite: noGameDetection
  }
];
