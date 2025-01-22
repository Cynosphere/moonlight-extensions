import React from "@moonlight-mod/wp/react";
import { getLanguage } from "@moonlight-mod/wp/highlight.js";

export default function CodeblockLabel(language: string) {
  const lang = getLanguage(language);
  if (!lang) return;

  const aliases = [...(lang.aliases ?? [])];
  if (!aliases.includes(language)) aliases.splice(0, 0, language);

  return (
    <span className="bcb-label">
      {/* @ts-expect-error DefinitelyTyped skill issue */}
      {lang.name.replace(/^ansi$/, "ANSI")} (<code>{aliases.join(", ")}</code>)
    </span>
  );
}
