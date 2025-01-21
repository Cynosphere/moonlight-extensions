export default function unindent(str: string) {
  // remove tabs (bots + file preview)
  str = str.replaceAll("\t", "    ");

  const minIndent =
    str.match(/^ *(?=\S)/gm)?.reduce((previous, current) => Math.min(previous, current.length), Infinity) ?? 0;

  if (!minIndent) return str;
  return str.replace(new RegExp(`^ {${minIndent}}`, "gm"), "");
}
