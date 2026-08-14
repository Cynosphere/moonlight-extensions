import type { CSSProperties } from "react";

export type GradientProps = {
  colorStrings?: {
    primaryColor?: string;
    secondaryColor?: string;
    tertiartyColor?: string;
  };
  useReducedMotion?: boolean;
  roleStyle: string;
  includeConvenienceGlow?: boolean;
  animateGradient?: boolean;
};
export type Gradient = {
  gradientClassname: string;
  gradientStyle: CSSProperties;
};

export type DisplayNameFontProps = {
  displayNameStyles: Record<string, any>; // FIXME
};
