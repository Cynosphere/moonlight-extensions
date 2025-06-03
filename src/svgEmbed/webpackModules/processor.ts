import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import { MessageFlags } from "@moonlight-mod/wp/discord/Constants";

const MAX_EMBEDS_PER_MESSAGE = 5;
const MIN_SVG_WIDTH = 400;
const MIN_SVG_HEIGHT = 350;
const MAX_SVG_FILESIZE = 10 * 1024 * 1024;

const URL_REGEX =
  /(?<!<)https?:\/\/(?:(?:canary|ptb)?\.?discord\.com|(?:cdn)\.?discordapp\.(?:com))\/[-a-zA-Z0-9:%_+.~/=]+\.svg[-a-zA-Z0-9:%_+.&?#=]*(?!>)/g;

// Cache to avoid excessive requests in component updates
const FileSizeCache: Map<string, boolean> = new Map();
async function checkFileSize(url: string) {
  if (FileSizeCache.has(url)) {
    return FileSizeCache.get(url);
  }

  let belowMaxSize = false;
  try {
    // We cannot check Content-Length due to Access-Control-Expose-Headers.
    // Instead, we request 1 byte past the size limit, and see if it succeeds.
    const res = await fetch(url, {
      method: "HEAD",
      headers: {
        Range: `bytes=${MAX_SVG_FILESIZE}-${MAX_SVG_FILESIZE + 1}`
      }
    });

    if (res.status === 416 /* Range Not Satisfiable */) {
      belowMaxSize = true;
    }
  } catch {
    // noop
  }

  FileSizeCache.set(url, belowMaxSize);
  return belowMaxSize;
}

async function getSVGDimensions(svgUrl: string) {
  let width = 0,
    height = 0;
  let svgData: string;

  try {
    const res = await fetch(svgUrl);
    svgData = await res.text();
  } catch {
    return { width, height };
  }

  const svgElement = new DOMParser().parseFromString(svgData, "image/svg+xml")
    .documentElement as unknown as SVGSVGElement;

  // Return 0,0 on error, so that the renderer falls back to displaying the raw content
  const errorNode = svgElement.querySelector("parsererror");
  if (errorNode) {
    return { width, height };
  }

  if (
    svgElement.width?.baseVal &&
    svgElement.height?.baseVal &&
    svgElement.width.baseVal.unitType === 1 &&
    svgElement.height.baseVal.unitType === 1
  ) {
    width = svgElement.width.baseVal.value;
    height = svgElement.height.baseVal.value;
  } else if (svgElement.viewBox?.baseVal) {
    width = svgElement.viewBox.baseVal.width;
    height = svgElement.viewBox.baseVal.height;
  }

  // If the dimensions are below the minimum values,
  // scale them up by the smallest integer which makes at least 1 of them exceed it
  if (width < MIN_SVG_WIDTH && height < MIN_SVG_HEIGHT) {
    const multiplier = Math.ceil(Math.min(MIN_SVG_WIDTH / width, MIN_SVG_HEIGHT / height));
    width *= multiplier;
    height *= multiplier;
  }

  return { width, height };
}

export async function processAttachments(message: any) {
  let shouldUpdateMessage = false;

  const toProcess = message.attachments.filter(
    (attachment: any) =>
      attachment.content_type?.startsWith("image/svg+xml") && attachment.width == null && attachment.height == null
  );
  for (const attachment of toProcess) {
    if (attachment.size > MAX_SVG_FILESIZE) continue;

    const { width, height } = await getSVGDimensions(attachment.url);
    attachment.width = width;
    attachment.height = height;

    // Change the media.discordapp.net url to use cdn.discordapp.com
    // since the media one will return http 415 for svgs
    attachment.proxy_url = attachment.url;

    shouldUpdateMessage = true;
  }

  if (shouldUpdateMessage) {
    Dispatcher.dispatch({ type: "MESSAGE_UPDATE", message });
  }
}

const currentlyProcessing = new Set<string>();
export async function processEmbeds(message: any) {
  if (message.state !== "SENT") return;
  if (message.hasFlag(MessageFlags.SUPPRESS_EMBEDS)) return;

  if (currentlyProcessing.has(message.id)) return;
  currentlyProcessing.add(message.id);

  let shouldUpdateMessage = false;

  const svgUrls = new Set(message.content.match(URL_REGEX));
  const existingUrls = new Set(
    message.embeds.filter((embed: any) => embed.type === "image").map((embed: any) => embed.image?.url)
  );

  let imageEmbedsCount = existingUrls.size;
  for (const _url of svgUrls.values()) {
    const url = _url as string;
    if (imageEmbedsCount >= MAX_EMBEDS_PER_MESSAGE) break;
    if (existingUrls.has(url)) continue;

    const belowMaxSize = await checkFileSize(url);
    if (!belowMaxSize) continue;

    const { width, height } = await getSVGDimensions(url);
    message.embeds.push({
      id: "svgembed",
      url,
      type: "image",
      image: { url, proxyURL: url, width, height },
      fields: []
    });

    imageEmbedsCount++;
    shouldUpdateMessage = true;
  }

  if (shouldUpdateMessage) {
    Dispatcher.dispatch({ type: "MESSAGE_UPDATE", message });
  }

  currentlyProcessing.delete(message.id);
}
