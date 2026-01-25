const ANSI_STYLES: Record<string, string> = {
  1: "bold",
  2: "dim",
  4: "underline",
  5: "blink",
  8: "hidden",
  9: "strike"
};

const ANSI_FOREGROUND: Record<string, string> = {
  30: "black",
  31: "red",
  32: "green",
  33: "yellow",
  34: "blue",
  35: "magenta",
  36: "cyan",
  37: "white",
  90: "black-bright",
  91: "red-bright",
  92: "green-bright",
  93: "yellow-bright",
  94: "blue-bright",
  95: "magenta-bright",
  96: "cyan-bright",
  97: "white-bright"
};

const ANSI_BACKGROUND: Record<string, string> = {
  40: "black",
  41: "red",
  42: "green",
  43: "yellow",
  44: "blue",
  45: "magenta",
  46: "cyan",
  47: "white",
  100: "black-bright",
  101: "red-bright",
  102: "green-bright",
  103: "yellow-bright",
  104: "blue-bright",
  105: "magenta-bright",
  106: "cyan-bright",
  107: "white-bright"
};

const ANSI_INDEXES: Record<string, string> = {
  0: "black",
  1: "red",
  2: "green",
  3: "yellow",
  4: "blue",
  5: "magenta",
  6: "cyan",
  7: "white",
  8: "black-bright",
  9: "red-bright",
  10: "green-bright",
  11: "yellow-bright",
  12: "blue-bright",
  13: "magenta-bright",
  14: "cyan-bright",
  15: "white-bright"
};

const REGEX_ANSI_CONTROL = /\x1B\[(\d+(?:[:;]\d+)*)m/;
const REGEX_ANSI_CONTROL_LOOKAHEAD = new RegExp(`(?=${REGEX_ANSI_CONTROL.source})`);
const REGEX_ANSI_CONTROL_SPLIT = /\x1B\[\d+(?:[:;]\d+)*m/;
const REGEX_ANSI_CONTROL_SPLIT_LOOKAHEAD = new RegExp(`(?=${REGEX_ANSI_CONTROL_SPLIT.source})`);
const REGEX_ANSI_CONTROL_SPLIT_GROUP = new RegExp(`(${REGEX_ANSI_CONTROL_SPLIT.source})`);

let lastCategory: string | undefined;
function openNode(emitter: any, nodes: Record<string, any>, key: string, scope: any) {
  emitter.openNode(scope);
  nodes[key] = emitter.top;
  lastCategory = key;
}

function closeNode(emitter: any, nodes: Record<string, any>, key: string) {
  const node = nodes[key];
  if (node == null) return;

  emitter.stack.splice(emitter.stack.indexOf(node), 1);
  nodes[key] = null;
}

function ansiLanguage() {
  return {
    contains: [
      {
        begin: REGEX_ANSI_CONTROL_LOOKAHEAD,
        contains: [
          {
            className: "ansi-control-sequence",
            begin: REGEX_ANSI_CONTROL,
            starts: {
              end: REGEX_ANSI_CONTROL_LOOKAHEAD,
              endsParent: true
            }
          }
        ]
      }
    ],
    __emitTokens: (code: string, emitter: any) => {
      const parts = code.split(REGEX_ANSI_CONTROL_SPLIT_LOOKAHEAD).flatMap((part) => {
        const split = part.split(REGEX_ANSI_CONTROL_SPLIT_GROUP);
        const top = split.shift()!;
        if (top !== "") split.splice(0, 0, top);
        return split;
      });

      const openNodes: Record<string, any> = {
        foreground: null,
        background: null,
        bold: null,
        dim: null,
        underline: null,
        blink: null,
        hidden: null,
        strike: null
      };
      for (const part of parts) {
        const match = part.match(REGEX_ANSI_CONTROL);
        if (match) {
          const [orig, codes] = match;
          const codeParts = codes.split(";");

          for (let i = 0; i < codeParts.length; i++) {
            const code = codeParts[i];
            const prevCode = codeParts[i - 1];
            const prevPrevCode = codeParts[i - 2];
            const nextCode = codeParts[i + 1];
            const nextNextCode = codeParts[i + 2];

            const namedForeground = ANSI_FOREGROUND[code];
            const namedBackground = ANSI_BACKGROUND[code];
            const style = ANSI_STYLES[code];

            if (
              (code === "5" && (prevCode === "38" || prevCode === "48")) ||
              (prevCode === "5" && (prevPrevCode === "38" || prevPrevCode === "48"))
            ) {
              continue;
            } else if (code === "0") {
              for (const category of Object.keys(openNodes)) {
                closeNode(emitter, openNodes, category);
              }
            } else if (code === "38" || code === "48") {
              if (nextCode === "5") {
                const category = code === "48" ? "background" : "foreground";
                let scope = `ansi-${category}-`;

                const namedIndex = ANSI_INDEXES[nextNextCode];
                if (namedIndex) {
                  scope += namedIndex;
                } else {
                  scope += nextNextCode;
                }

                let fgScope;
                if (category === "background" && openNodes.foreground != null && lastCategory === "foreground") {
                  fgScope = openNodes.foreground.scope;
                  closeNode(emitter, openNodes, "foreground");
                }
                closeNode(emitter, openNodes, category);

                if (fgScope) openNode(emitter, openNodes, "foreground", fgScope);

                openNode(emitter, openNodes, category, scope);
              }
            } else if (namedForeground) {
              closeNode(emitter, openNodes, "foreground");

              openNode(emitter, openNodes, "foreground", "ansi-foreground-" + namedForeground);
            } else if (code === "39" && openNodes.foreground != null) {
              closeNode(emitter, openNodes, "foreground");
            } else if (namedBackground) {
              closeNode(emitter, openNodes, "background");

              openNode(emitter, openNodes, "background", "ansi-background-" + namedBackground);
            } else if (code == "49" && openNodes.background != null) {
              let fgScope;
              if (openNodes.foreground != null && lastCategory === "foreground") {
                fgScope = openNodes.foreground.scope;
                closeNode(emitter, openNodes, "foreground");
              }

              closeNode(emitter, openNodes, "background");

              if (fgScope) openNode(emitter, openNodes, "foreground", fgScope);
            } else if (style) {
              openNode(emitter, openNodes, style, "ansi-style-" + style);
            } else if (code.length == 2 && code.startsWith("2")) {
              const closeStyle = ANSI_STYLES[code.substring(1)];
              closeNode(emitter, openNodes, closeStyle);
            }
          }

          emitter.startScope("ansi-control-sequence");
          emitter.addText(orig);
          emitter.endScope();
        } else {
          emitter.addText(part);
        }
      }

      emitter.finalize();
    }
  };
}

export default ansiLanguage;
export const A = ansiLanguage;
