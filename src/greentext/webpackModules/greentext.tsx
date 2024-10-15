import React from "@moonlight-mod/wp/react";
import * as Markdown from "@moonlight-mod/wp/markdown_markdown";

Markdown.addRule(
  "greentext",
  (rules) => ({
    order: rules.text.order,
    // @ts-expect-error i cant care enough to get this type working
    match: function (text, state) {
      if (state.inGreentext || state.inQuote) return null;

      return /^$|\n$/.test(state.prevCapture != null ? state.prevCapture[0] : "") && /^(>.+?)(?:\n|$)/.exec(text);
    },
    parse: function (capture, parse, state) {
      state.inGreentext = true;
      const node = {
        content: parse(capture[0], state)
      };
      delete state.inGreentext;
      return node;
    },
    react: function (node, recurseOutput, state) {
      return <span className="greentext">{recurseOutput(node.content, state)}</span>;
    }
  }),
  () => ({
    type: "inlineStyle",
    before: "",
    after: ""
  }),
  "greentext"
);
Markdown.blacklistFromRuleset("INLINE_REPLY_RULES", "greentext");

Markdown.addRule(
  "greentext-ban",
  (rules) => ({
    order: rules.strong.order - 1,
    match: function (text, state) {
      if (state.inGreentextBan) return null;
      return /^\*\*\(USER WAS BANNED FOR THIS POST\)\*\*/.exec(text);
    },
    parse: function (capture, parse, state) {
      state.inGreentextBan = true;
      const node = {
        content: parse(capture[0], state)
      };
      delete state.inGreentextBan;
      return node;
    },
    react: function (node, recurseOutput, state) {
      return <span className="greentext-ban">{recurseOutput(node.content, state)}</span>;
    }
  }),
  () => ({
    type: "inlineStyle",
    before: "",
    after: ""
  }),
  "greentext-ban"
);
