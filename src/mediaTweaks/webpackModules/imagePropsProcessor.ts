const filetypeWhitelist = [".gif", ".mov", ".mp4", ".webm", ".webp"];

type ImageProps = {
  src: string;
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
  format?: string;
  quality?: string;
  animated?: boolean;
  srcIsAnimated?: boolean;
};

export default function processProps(props: ImageProps) {
  if (moonlight.getConfigOption<boolean>("mediaTweaks", "noWebp") ?? true) {
    let whitelisted = false;
    for (const type of filetypeWhitelist) {
      if (props.src.indexOf(type) > -1) {
        whitelisted = true;
        break;
      }
    }

    if (props.format === "webp" && !whitelisted && !props.animated && !props.srcIsAnimated) {
      props.format = undefined;
    }
  }

  if (moonlight.getConfigOption<boolean>("mediaTweaks", "noThumbnailSize") ?? false) {
    props.targetWidth = props.sourceWidth * window.devicePixelRatio;
    props.targetHeight = props.sourceHeight * window.devicePixelRatio;
  }
}
