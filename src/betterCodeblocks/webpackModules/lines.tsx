import React from "@moonlight-mod/wp/react";

export function wrapFallback(content: string) {
  const lines = content.split("\n");

  return (
    <div className="bcb-lines">
      {lines.map((line, index) => (
        <>
          <span key={`bcb-line-${index}_number`} className="bcb-number">
            {index + 1}
          </span>
          <span key={`bcb-line-${index}_line`} className="bcb-code">
            {line}
          </span>
        </>
      ))}
    </div>
  );
}

export function wrapCode(code: string) {
  const lines = code
    .replace(/<span class="(hljs-[a-z]+)">([^<]*)<\/span>/g, (_, className, code) =>
      code
        .split("\n")
        .map((line: string) => `<span class="${className}">${line}</span>`)
        .join("\n")
    )
    .split("\n");

  return (
    <div className="bcb-lines">
      {lines.map((line, index) => (
        <>
          <span key={`bcb-line-${index}_number`} className="bcb-number">
            {index + 1}
          </span>
          <span key={`bcb-line-${index}_code`} className="bcb-code" dangerouslySetInnerHTML={{ __html: line }} />
        </>
      ))}
    </div>
  );
}
