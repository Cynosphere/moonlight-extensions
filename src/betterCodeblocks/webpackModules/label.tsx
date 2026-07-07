import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

let getLanguage: typeof import("@moonlight-mod/wp/highlight.js").getLanguage;

function lazyLoad() {
  if (getLanguage == null && spacepack.require.m["highlight.js"] != null) {
    getLanguage = spacepack.require("highlight.js").getLanguage;
  }
}

export default function CodeblockLabel(language: string) {
  lazyLoad();

  const lang = getLanguage?.(language);
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
