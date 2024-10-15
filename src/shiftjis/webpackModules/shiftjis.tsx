import React from "@moonlight-mod/wp/react";
import * as Markdown from "@moonlight-mod/wp/markdown_markdown";

Markdown.addRule(
  "shiftjis",
  (rules) => ({
    order: rules.codeBlock.order - 1,
    match: function (text, state) {
      if (state.inShiftjis || state.inQuote) return null;
      return /^```sjis(?:\n)?((?:\\[\s\S]|[^\\])+?)```(?!`)/.exec(text);
    },
    parse: function (capture, parse, state) {
      state.inShiftjis = true;
      const node = {
        content: parse(
          capture[1]
            .replace(/\\/g, "\\\\")
            .replace(/`/g, "\\`")
            .replace(/_/g, "\\_")
            .replace(/\*/g, "\\*")
            .replace(/~/g, "\\~")
            .replace(/\|/g, "\\|"),
          state
        )
      };
      delete state.inShiftjis;
      return node;
    },
    react: function (node, recurseOutput, state) {
      return <span className="shiftjis">{recurseOutput(node.content, state)}</span>;
    }
  }),
  () => ({
    type: "inlineObject"
  })
);
Markdown.blacklistFromRuleset("INLINE_REPLY_RULES", "shiftjis");
