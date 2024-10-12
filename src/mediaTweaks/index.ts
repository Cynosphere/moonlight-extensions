import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Image URLs
  {
    find: "allowLinks:!!",
    replace: {
      match: /,(\(null!=.\?.:.\)\.embeds\)\),)/,
      replacement: (_, orig) => `,moonlight.getConfigOption("mediaTweaks","imageUrls")??true?{}:${orig}`
    }
  },

  // No GIF Autosend
  {
    find: ".TOGGLE_GIF_PICKER,handler:",
    replace: {
      match: /.{1,2}===.\..\.CREATE_FORUM_POST/,
      replacement: (orig: string) => `(moonlight.getConfigOption("mediaTweaks","noGifAutosend")??true?true:${orig})`
    }
  },

  // Video Metadata
  {
    find: "renderMetadata()",
    replace: {
      match:
        /(?<=(.===.\.VIDEO)\?.+?(\(0,.\.jsx\))\("div",{className:(.+?\.overlayContentHidden]:).\|\|.\}\),children:.\(\)}\):null)]/,
      replacement: (_, videoCheck, createElement, className) =>
        `,${videoCheck}&&(moonlight.getConfigOption("mediaTweaks","videoMetadata")??true)?${createElement}("div",{className:${className}this.state.playing&&!this.state.hovering}),children:${createElement}(require("mediaTweaks_videoMetadata").default,this.props)}):null]`
    }
  },

  // Inline Mosaic Playback
  {
    find: 'location:"MessageAccessories"',
    replace: {
      match: /=.\.length>1\?(\(0,.\..{1,2}\))\((.),(.)\):{}/,
      replacement: (_, createCarousel, attachments, analytics) =>
        `=${attachments}.length>1?${createCarousel}((moonlight.getConfigOption("mediaTweaks","inlineMosaicPlayback")??true)?${attachments}.filter(x=>!x.component.props.poster):${attachments},${analytics}):{}`
    }
  },

  // Enlarge Video Button
  // TODO: Move this patch to a library
  {
    find: ".spoilerRemoveMosaicItemButton:",
    replace: [
      // Send the full item over
      {
        match: /,downloadURL:(.)\.downloadUrl,/,
        replacement: (orig, item) => `,item:${item}${orig}`
      },

      // Add button
      {
        match: /(?<=isVisualMediaType:.,channelId:.+?}=(.);.+?(\(0,.\.jsx\)).+?\.forceShowHover]:.}\),children:\[)/,
        replacement: (_, props, createElement) =>
          `${createElement}(require("mediaTweaks_enlargeVideoButton").default,${props}),`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  videoMetadata: {
    dependencies: [{ id: "react" }, { ext: "spacepack", id: "spacepack" }]
  },

  enlargeVideoButton: {
    dependencies: [{ id: "react" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/components/common/index" }]
  }
};

export const styles = [
  `.mediaTweaks-metadata {
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 8px;
  background: linear-gradient(to bottom, hsl(var(--black-500-hsl)/.6), transparent);
  width: 100%;
  pointer-events: none;
}`
];
