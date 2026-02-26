import adblock from "inline:./adblock.js";
import embedBypass from "inline:./embedBypass.js";
import type { BrowserWindow } from "electron";
import { webFrameMain } from "electron";

moonlightHost.events.on("window-created", (window: BrowserWindow) => {
  window.webContents.on("did-frame-navigate", (_event, url, _code, _status, _main, pid, rid) => {
    const frame = webFrameMain.fromId(pid, rid);
    if (frame != null && url.includes("youtube.com/embed/")) {
      frame.executeJavaScript(adblock);
      frame.executeJavaScript(embedBypass);
    }
  });
});
