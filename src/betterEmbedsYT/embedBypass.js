// https://greasyfork.org/en/scripts/465518-youtube-embed-whatever-wherever/code
// nicer more compact embeds, no youtube logo button

function checkStatus() {
  const ytcfg = window.ytcfg;
  const player_response = JSON.parse(ytcfg.data_.PLAYER_VARS.embedded_player_response);

  // watch together doesn't have this field
  if (player_response.previewPlayabilityStatus) {
    player_response.previewPlayabilityStatus.status = "OK";
    player_response.previewPlayabilityStatus.playableInEmbed = true;
    delete player_response.previewPlayabilityStatus.reason;
    delete player_response.previewPlayabilityStatus.errorScreen;
  }

  ytcfg.data_.PLAYER_VARS.embedded_player_response = JSON.stringify(player_response);

  ytcfg.data_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER.isEmbed = false;
  ytcfg.data_.INNERTUBE_CONTEXT.client.originalUrl = `https://www.youtube.com/watch?v=${ytcfg.data_.VIDEO_ID}`;
}

function waitForConfig() {
  if (window.ytcfg) {
    checkStatus();
  } else {
    requestAnimationFrame(waitForConfig);
  }
}

if (window.ytcfg) {
  checkStatus();
} else {
  waitForConfig();
}
