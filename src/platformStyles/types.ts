export type PlatformStyle = "win" | "osx" | "linux" | "web" | "default";

type PlatformTypes = {
  WINDOWS: "WINDOWS";
  OSX: "OSX";
  LINUX: "LINUX";
  WEB: "WEB";
};

export type PlatformUtils = {
  PlatformTypes: PlatformTypes;
  isPlatformEmbedded: () => boolean;
  isWindows: () => boolean;
  isMac: () => boolean;
  isLinux: () => boolean;
  isDesktop: () => boolean;
  isWeb: () => boolean;
  isAndroidChrome: () => boolean;
  isAndroidWeb: () => boolean;
  isAndroid: () => boolean;
  isIOS: () => boolean;
  getPlatform: () => PlatformTypes;
  getPlatformName: () => string;
  getOS: () => string;
};
