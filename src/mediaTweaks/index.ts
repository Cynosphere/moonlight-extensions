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
      match: /[A-Za-z_$][\w$]*===[A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]*\.CREATE_FORUM_POST/,
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
      match: /=(\(0,.\..{1,2}\))\((.),({shouldRedactExplicitContent:.,shouldHideMediaOptions:.}),("Media Mosaic")\),/,
      replacement: (_, createCarousel, attachments, props, analytics) =>
        `=${createCarousel}((moonlight.getConfigOption("mediaTweaks","inlineMosaicPlayback")??true)?${attachments}.filter(x=>x.type!="VIDEO"):${attachments},${props},${analytics}),`
    }
  },

  // Enlarge Video Button
  // This is technically a Discord feature now but it doesn't support videos (yet?)
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
        match:
          /(?<=isVisualMediaType:.,channelId:.+?}=(.);.+?"MosaicItemHoverButtons"\);)(?=.&&null!=.&&(.)\.push\((\(0,.\.jsx\)))/,
        replacement: (_, props, buttons, createElement) =>
          `${buttons}.push(${createElement}(require("mediaTweaks_enlargeVideoButton").default,${props},"mediaTweaks_enlargeVideoButton"));`
      }
    ]
  },
  {
    find: ".VIDEO_EMBED_PLAYBACK_STARTED,",
    replace: {
      match: ".proxyURL,placeholder:",
      replacement:
        '.proxyURL,renderAdjacentContent:require("mediaTweaks_enlargeVideoButton").createButtonGroup(arguments[0]),placeholder:'
    }
  },

  // No WebP and No Thumbnail Size
  {
    find: /\(.{1,2}\+="\?"\+.{1,2}\.stringify\(.{1,2}\)\)/,
    replace: {
      match: /if\((.)\.sourceWidth<.\.targetWidth\){/,
      replacement: (orig, props) => `require("mediaTweaks_imagePropsProcessor").default(${props});${orig}`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  videoMetadata: {
    dependencies: [{ id: "react" }, { ext: "spacepack", id: "spacepack" }]
  },

  enlargeVideoButton: {
    dependencies: [{ id: "react" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/components/common/index" }]
  },

  imagePropsProcessor: {
    dependencies: []
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
}

[class^="inlineMediaEmbed_"] {
  max-width: max-content !important;
}`
];
