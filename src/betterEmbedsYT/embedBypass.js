// https://greasyfork.org/en/scripts/465518-youtube-embed-whatever-wherever/code
// ~~nicer more compact embeds, no youtube logo button~~
// native browser player since the new youtube ui broke the old player completely

function checkStatus() {
  const ytcfg = window.yt?.config_ ?? window.ytcfg?.data_;
  const player_response = JSON.parse(ytcfg.PLAYER_VARS.embedded_player_response);

  // watch together doesn't have this field
  if (player_response.previewPlayabilityStatus) {
    player_response.previewPlayabilityStatus.status = "OK";
    player_response.previewPlayabilityStatus.playableInEmbed = true;
    delete player_response.previewPlayabilityStatus.reason;
    delete player_response.previewPlayabilityStatus.errorScreen;
  }

  ytcfg.PLAYER_VARS.embedded_player_response = JSON.stringify(player_response);

  ytcfg.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER.isEmbed = false;
  ytcfg.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER.disableOrganicUi = false;
  ytcfg.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER.playerStyle = "play";
  ytcfg.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER.useNativeControls = true;
  ytcfg.INNERTUBE_CONTEXT.client.originalUrl = `https://www.youtube.com/watch?v=${ytcfg.VIDEO_ID}`;
}

function waitForConfig() {
  if (window.yt?.config_ ?? window.ytcfg?.data_) {
    checkStatus();
  } else {
    requestAnimationFrame(waitForConfig);
  }
}

if (window.yt?.config_ ?? window.ytcfg?.data_) {
  checkStatus();
} else {
  waitForConfig();
}
