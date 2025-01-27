import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '("SystemMessage").error("",',
    replace: {
      match: /(?<=usernameHook:\i}\)),\(0,\i.jsx\)\(\i\.\i,{channel:\i,message:\i}\)/,
      replacement: ""
    }
  }
];
