import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { PlatformStyle } from "./types";

type Vibrancy =
  | "none"
  | "under-page"
  | "content"
  | "window"
  | "selection"
  | "titlebar"
  | "header"
  | "sidebar"
  | "tooltip"
  | "menu"
  | "popover"
  | "fullscreen-ui"
  | "hud"
  | "sheet"
  | "under-window";

type BackgroundMaterial = "auto" | "none" | "mica" | "acrylic" | "tabbed";

moonlightHost.events.on("window-created", (window: BrowserWindow) => {
  const noMinimumSize = moonlightHost.getConfigOption<boolean>("platformStyles", "noMinimumSize") ?? false;

  if (noMinimumSize) {
    window.setMinimumSize = () => {};
  }
});

moonlightHost.events.on("window-options", (options: BrowserWindowConstructorOptions) => {
  const style = moonlightHost.getConfigOption<PlatformStyle>("platformStyles", "style") ?? "default";
  const transparency = moonlightHost.getConfigOption<boolean>("platformStyles", "transparency") ?? false;
  const macosVibrancy = moonlightHost.getConfigOption<Vibrancy>("platformStyles", "macosVibrancy") ?? "none";
  const windowsMaterial =
    moonlightHost.getConfigOption<BackgroundMaterial>("platformStyles", "windowsMaterial") ?? "auto";
  const unround = moonlightHost.getConfigOption<boolean>("platformStyles", "unround") ?? false;

  if (transparency) {
    options.transparent = true;
    options.backgroundColor = "#00000000";
  }

  if (unround) {
    options.roundedCorners = false;
  }

  if (process.platform === "darwin" && macosVibrancy !== "none") {
    options.backgroundColor = "#00000000";
    options.vibrancy = macosVibrancy;
  } else if (process.platform === "win32") {
    /* @ts-expect-error need to update electron types */
    options.backgroundMaterial = windowsMaterial;
  }

  const useFrame = style === "linux";
  const isPopout = options.center && options.width === 300 && options.height === 350;

  if (!isPopout && options.title != null) {
    if (style !== "default") {
      options.frame = useFrame;
    }
  }
});
