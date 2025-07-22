import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "Missing channel in Channel.renderSidebar",
    replace: [
      // point to linked channel
      {
        match: /render\(\){(?=let{channel:\i,)/,
        replacement: (orig: string) => `${orig}
        this.props._realChannel = this.props.channel;
        this.props.channel = this.props.voiceChannel ? require("voiceTextLink_logic").getChannel(this.props._realChannel) : this.props._realChannel;`
      },
      {
        match: /renderCall\(\){let{channel:(\i)}=this\.props;/,
        replacement: (orig, channel) => `${orig}
        ${channel} = (this.props.voiceChannel && this.props.channelId === this.props.voiceChannel.id) ? this.props.voiceChannel : this.props.channel;`
      },

      // make renderCall render text channels
      {
        match: /case (\i\.\i)\.PRIVATE_THREAD:(?=let \i=this\.props\.height-200;)/,
        replacement: (orig, ChannelTypes) => `${orig}case ${ChannelTypes}.GUILD_TEXT:`
      }
    ]
  },

  // sidebar
  {
    find: '"trackCallTileContextMenuImpression"',
    replace: {
      match: /{channel:(\i),(guild:\i,maxWidth:\i}\),\i&&\(0,\i\.jsx\)\(\i\.\i,{channel:)\i,/,
      replacement: (_, channel, body) =>
        `{channel:require("voiceTextLink_logic").getChannel(${channel}),${body}require("voiceTextLink_logic").getChannel(${channel}),`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  logic: {
    dependencies: [{ ext: "common", id: "stores" }]
  },
  context: {
    dependencies: [
      { id: "react" },
      { ext: "contextMenu", id: "contextMenu" },
      { ext: "common", id: "stores" },
      { id: "discord/components/common/index" },
      { id: "discord/Constants" }
    ],
    entrypoint: true
  }
};
