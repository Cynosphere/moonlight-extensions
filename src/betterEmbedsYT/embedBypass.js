// partially adapted from https://greasyfork.org/en/scripts/465518-youtube-embed-whatever-wherever/code
// original script doesnt work anymore

function checkStatus() {
  const ytcfg = window.ytcfg;
  const player_response = JSON.parse(ytcfg.data_.PLAYER_VARS.embedded_player_response);

  if (!player_response?.previewPlayabilityStatus?.status) return;
  if (
    player_response.previewPlayabilityStatus.desktopLegacyAgeGateReason ||
    player_response.previewPlayabilityStatus.status === "OK"
  )
    return;
  location.reload();
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
