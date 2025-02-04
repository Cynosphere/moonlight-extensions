import type { BrowserWindow } from "electron";
import { webFrameMain } from "electron";
import embedBypass from "inline:./embedBypass.js";
import adblock from "inline:./adblock.js";

moonlightHost.events.on("window-created", (window: BrowserWindow) => {
  window.webContents.on("did-frame-navigate", (event, url, code, status, main, pid, rid) => {
    const frame = webFrameMain.fromId(pid, rid);
    if (frame != null && url.includes("youtube.com/embed/")) {
      frame.executeJavaScript(adblock);
      frame.executeJavaScript(embedBypass);
    }
  });
});
