import { ExtensionWebpackModule, Patch, PatchReplaceType } from "@moonlight-mod/types";

const FIND_FILE_PREVIEW = 'Accept:"text/plain"';
const FIND_MARKDOWN_COMPONENTS = "text:{react:";

const lineNumbers = () => moonlight.getConfigOption<boolean>("betterCodeblocks", "lineNumbers") ?? true;

export const patches: Patch[] = [
  // line numbers
  {
    find: FIND_FILE_PREVIEW,
    replace: [
      {
        match: /"hljs"\),children:(\i)}/,
        replacement: (_, content) => `"hljs"),children:require("betterCodeblocks_lines").wrapFallback(${content})}`
      },
      {
        match: /"hljs",(\i)\.language\),dangerouslySetInnerHTML:{__html:\i\.value}}/,
        replacement: (_, highlighted) =>
          `"hljs",${highlighted}.language),children:require("betterCodeblocks_lines").wrapCode(${highlighted}.value)}`
      }
    ],
    prerequisite: lineNumbers
  },
  {
    find: FIND_MARKDOWN_COMPONENTS,
    replace: [
      {
        match: /"hljs"\),children:(\(0,\i\.\i\)\(\i,\i\,\i\))}/,
        replacement: (_, content) => `"hljs"),children:require("betterCodeblocks_lines").wrapFallback(${content})}`
      },
      {
        match: /"hljs",(\i)\.language\),dangerouslySetInnerHTML:{__html:\i\.value}}/,
        replacement: (_, highlighted) =>
          `"hljs",${highlighted}.language),children:require("betterCodeblocks_lines").wrapCode(${highlighted}.value)}`
      }
    ],
    prerequisite: lineNumbers
  },

  // label
  {
    find: FIND_MARKDOWN_COMPONENTS,
    replace: {
      match: /children:\[(\i\.\i\?.+?:null)(,\(0,\i\.jsx\)\(\i\.\i,{createPromise:)/,
      replacement: (_, CopyButton, body) =>
        `children:[[require("betterCodeblocks_label").default(arguments[0].lang),${CopyButton}]${body}`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("betterCodeblocks", "label") ?? true
  },

  // preview copy
  {
    find: FIND_FILE_PREVIEW,
    replace: {
      match: /(?<=fileSize:\i}\),)(?=(\(0,(\i).jsx\)))/g,
      replacement: (_, createElement, ReactJSX) =>
        `${createElement}(require("betterCodeblocks_previewCopy")?.default??${ReactJSX}.Fragment,arguments[0]),`
    },

    prerequisite: () => moonlight.getConfigOption<boolean>("betterCodeblocks", "previewCopy") ?? true
  },

  // ansi
  {
    find: 'className:"ansi-control-sequence",',
    replace: {
      type: PatchReplaceType.Module,
      replacement: () =>
        function (module, exports, require) {
          module.exports = require("betterCodeblocks_ansi");
        }
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("betterCodeblocks", "ansi") ?? true
  },

  // uncap preview
  {
    find: FIND_FILE_PREVIEW,
    replace: [
      {
        match: /Range:"bytes=0-".concat\(.+?\),/,
        replacement: (orig) => `/*${orig}*/`
      },
      {
        match: /(\i)=(parseInt\(.+?\))-parseInt\((\i)\)/,
        replacement: (_, bytesLeft, range, length) => `${bytesLeft}=isNaN(${range})?0:${range}-parseInt(${length})`
      }
    ],
    hardFail: true,
    prerequisite: () => moonlight.getConfigOption<boolean>("betterCodeblocks", "uncapPreview") ?? false
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  lines: {
    dependencies: [{ id: "react" }]
  },
  label: {
    dependencies: [{ id: "react" }, { id: "highlight.js" }]
  },
  previewCopy: {
    dependencies: [
      { id: "react" },
      { ext: "spacepack", id: "spacepack" },
      { id: "discord/utils/ClipboardUtils" },
      { id: "discord/components/common/index" }
    ]
  },
  ansi: {}
};

const ANSI_256_COLORS = {
  16: "#000000",
  17: "#00005f",
  18: "#000087",
  19: "#0000af",
  20: "#0000d7",
  21: "#0000ff",
  22: "#005f00",
  23: "#005f5f",
  24: "#005f87",
  25: "#005faf",
  26: "#005fd7",
  27: "#005fff",
  28: "#008700",
  29: "#00875f",
  30: "#008787",
  31: "#0087af",
  32: "#0087d7",
  33: "#0087ff",
  34: "#00af00",
  35: "#00af5f",
  36: "#00af87",
  37: "#00afaf",
  38: "#00afd7",
  39: "#00afff",
  40: "#00d700",
  41: "#00d75f",
  42: "#00d787",
  43: "#00d7af",
  44: "#00d7d7",
  45: "#00d7ff",
  46: "#00ff00",
  47: "#00ff5f",
  48: "#00ff87",
  49: "#00ffaf",
  50: "#00ffd7",
  51: "#00ffff",
  82: "#5fff00",
  83: "#5fff5f",
  84: "#5fff87",
  85: "#5fffaf",
  86: "#5fffd7",
  87: "#5fffff",
  76: "#5fd700",
  77: "#5fd75f",
  78: "#5fd787",
  79: "#5fd7af",
  80: "#5fd7d7",
  81: "#5fd7ff",
  70: "#5faf00",
  71: "#5faf5f",
  72: "#5faf87",
  73: "#5fafaf",
  74: "#5fafd7",
  75: "#5fafff",
  64: "#5f8700",
  65: "#5f875f",
  66: "#5f8787",
  67: "#5f87af",
  68: "#5f87d7",
  69: "#5f87ff",
  58: "#5f5f00",
  59: "#5f5f5f",
  60: "#5f5f87",
  61: "#5f5faf",
  62: "#5f5fd7",
  63: "#5f5fff",
  52: "#5f0000",
  53: "#5f005f",
  54: "#5f0087",
  55: "#5f00af",
  56: "#5f00d7",
  57: "#5f00ff",
  93: "#8700ff",
  92: "#8700d7",
  91: "#8700af",
  90: "#870087",
  89: "#87005f",
  88: "#870000",
  99: "#875fff",
  98: "#875fd7",
  97: "#875faf",
  96: "#875f87",
  95: "#875f5f",
  94: "#875f00",
  105: "#8787ff",
  104: "#8787d7",
  103: "#8787af",
  102: "#878787",
  101: "#87875f",
  100: "#878700",
  111: "#87afff",
  110: "#87afd7",
  109: "#87afaf",
  108: "#87af87",
  107: "#87af5f",
  106: "#87af00",
  117: "#87d7ff",
  116: "#87d7d7",
  115: "#87d7af",
  114: "#87d787",
  113: "#87d75f",
  112: "#87d700",
  123: "#87ffff",
  122: "#87ffd7",
  121: "#87ffaf",
  120: "#87ff87",
  119: "#87ff5f",
  118: "#87ff00",
  159: "#afffff",
  158: "#afffd7",
  157: "#afffaf",
  156: "#afff87",
  155: "#afff5f",
  154: "#afff00",
  153: "#afd7ff",
  152: "#afd7d7",
  151: "#afd7af",
  150: "#afd787",
  149: "#afd75f",
  148: "#afd700",
  147: "#afafff",
  146: "#afafd7",
  145: "#afafaf",
  144: "#afaf87",
  143: "#afaf5f",
  142: "#afaf00",
  141: "#af87ff",
  140: "#af87d7",
  139: "#af87af",
  138: "#af8787",
  137: "#af875f",
  136: "#af8700",
  135: "#af5fff",
  134: "#af5fd7",
  133: "#af5faf",
  132: "#af5f87",
  131: "#af5f5f",
  130: "#af5f00",
  129: "#af00ff",
  128: "#af00d7",
  127: "#af00af",
  126: "#af0087",
  125: "#af005f",
  124: "#af0000",
  160: "#d70000",
  161: "#d7005f",
  162: "#d70087",
  163: "#d700af",
  164: "#d700d7",
  165: "#d700ff",
  166: "#d75f00",
  167: "#d75f5f",
  168: "#d75f87",
  169: "#d75faf",
  170: "#d75fd7",
  171: "#d75fff",
  172: "#d78700",
  173: "#d7875f",
  174: "#d78787",
  175: "#d787af",
  176: "#d787d7",
  177: "#d787ff",
  178: "#dfaf00",
  179: "#dfaf5f",
  180: "#dfaf87",
  181: "#dfafaf",
  182: "#dfafdf",
  183: "#dfafff",
  184: "#dfdf00",
  185: "#dfdf5f",
  186: "#dfdf87",
  187: "#dfdfaf",
  188: "#dfdfdf",
  189: "#dfdfff",
  190: "#dfff00",
  191: "#dfff5f",
  192: "#dfff87",
  193: "#dfffaf",
  194: "#dfffdf",
  195: "#dfffff",
  226: "#ffff00",
  227: "#ffff5f",
  228: "#ffff87",
  229: "#ffffaf",
  230: "#ffffdf",
  231: "#ffffff",
  220: "#ffdf00",
  221: "#ffdf5f",
  222: "#ffdf87",
  223: "#ffdfaf",
  224: "#ffdfdf",
  225: "#ffdfff",
  214: "#ffaf00",
  215: "#ffaf5f",
  216: "#ffaf87",
  217: "#ffafaf",
  218: "#ffafdf",
  219: "#ffafff",
  208: "#ff8700",
  209: "#ff875f",
  210: "#ff8787",
  211: "#ff87af",
  212: "#ff87df",
  213: "#ff87ff",
  202: "#ff5f00",
  203: "#ff5f5f",
  204: "#ff5f87",
  205: "#ff5faf",
  206: "#ff5fdf",
  207: "#ff5fff",
  196: "#ff0000",
  197: "#ff005f",
  198: "#ff0087",
  199: "#ff00af",
  200: "#ff00df",
  201: "#ff00ff",
  232: "#080808",
  233: "#121212",
  234: "#1c1c1c",
  235: "#262626",
  236: "#303030",
  237: "#3a3a3a",
  238: "#444444",
  239: "#4e4e4e",
  240: "#585858",
  241: "#626262",
  242: "#6c6c6c",
  243: "#767676",
  255: "#eeeeee",
  254: "#e4e4e4",
  253: "#dadada",
  252: "#d0d0d0",
  251: "#c6c6c6",
  250: "#bcbcbc",
  249: "#b2b2b2",
  248: "#a8a8a8",
  247: "#9e9e9e",
  246: "#949494",
  245: "#8a8a8a",
  244: "#808080"
};

export const styles: string[] = [
  `/* ansi: 256 colors */
${Object.entries(ANSI_256_COLORS)
  .map(
    ([num, hex]) =>
      `.hljs-ansi-foreground-${num} {
  color: ${hex};
}
.hljs-ansi-background-${num} {
  background-color: ${hex};
}`
  )
  .join("\n")}
`
];
