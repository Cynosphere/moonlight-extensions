import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Clickable } from "@moonlight-mod/wp/discord/components/common/index";

const EmbedClasses = spacepack.findByCode("embedDescription:")[0].exports;

type RenderDescription = (embed: any, description: string, headings: boolean) => React.ReactNode;

const logger = moonlight.getLogger("Better YouTube Embeds - Description");
const descriptionCache = new Map<string, string>();

const API_KEY = "AIzaSyCpphGplamUhCCEIcum1VyDXBt0i1nOqac"; // one of Google's own
const FAKE_EMBED = { type: "rich" };

function YTDescription({
  description,
  renderDescription,
  videoId
}: {
  description: string;
  renderDescription: RenderDescription;
  videoId: string;
}) {
  const [expanded, setExpanded] = React.useState(
    moonlight.getConfigOption<boolean>("betterEmbedsYT", "expandDescription")
  );
  const [fullDescription, setFullDescription] = React.useState(
    descriptionCache.has(videoId) ? descriptionCache.get(videoId) : description
  );

  React.useEffect(() => {
    if (!descriptionCache.has(videoId))
      if (
        (moonlight.getConfigOption<boolean>("betterEmbedsYT", "fullDescription") ?? true) &&
        description.endsWith("...") &&
        description.length >= 300
      ) {
        (async () => {
          try {
            const data = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
            ).then((res) => res.json());
            const newDesc = data?.items?.[0]?.snippet?.description ?? description;
            descriptionCache.set(videoId, newDesc);
            setFullDescription(newDesc);
          } catch (err) {
            logger.error(`Failed to get full description for "${videoId}":`, err);
            descriptionCache.set(videoId, description);
          }
        })();
      } else {
        descriptionCache.set(videoId, description);
      }
  });

  const lines = fullDescription!.split("\n");

  const rendered = renderDescription(FAKE_EMBED, fullDescription!, false);
  const firstLine = renderDescription(FAKE_EMBED, lines[0], false);

  return lines.length === 1 && description.length <= 40 ? (
    <div className={EmbedClasses.embedDescription + " " + EmbedClasses.embedMargin}>{rendered}</div>
  ) : (
    <div className={EmbedClasses.embedDescription + " " + EmbedClasses.embedMargin}>
      {expanded ? rendered : <div className="betterEmbedsYT-description-firstLine">{firstLine}</div>}
      <Clickable className="betterEmbedsYT-description-button" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show less" : "Show more"}
      </Clickable>
    </div>
  );
}

export default function DescriptionWrapper({
  embed,
  renderDescription
}: {
  embed: { rawDescription?: string; video: { url: string } };
  renderDescription: RenderDescription;
}) {
  const videoId = embed.video.url.match(/\/embed\/([a-z0-9_\-]+)/i)?.[1];
  return embed.rawDescription == null ? null : (
    <YTDescription description={embed.rawDescription} renderDescription={renderDescription} videoId={videoId!} />
  );
}
