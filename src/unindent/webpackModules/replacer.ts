import Commands from "@moonlight-mod/wp/commands_commands";
import unindent from "./unindent";

const REGEX_CODEBLOCK = /```(?:([a-z0-9_+\-.]+?)\n)?\n*([^\n][^]*?)(\n*)```/i;
const REGEX_CODEBLOCK_GLOBAL = new RegExp(REGEX_CODEBLOCK.source, "gi");

Commands.registerLegacyCommand("unindent", {
  match: REGEX_CODEBLOCK,
  action: (content) => {
    content = content.replace(REGEX_CODEBLOCK_GLOBAL, (block) => {
      const match = block.match(REGEX_CODEBLOCK)!;
      const lang = match[1] ?? "";
      if (lang.toLowerCase() === "ansi") return block;

      const newline = match[3] ?? "";

      let blockContent = match[2];
      blockContent = unindent(blockContent);

      return `\`\`\`${lang}\n${blockContent}${newline}\`\`\``;
    });

    return { content };
  }
});
