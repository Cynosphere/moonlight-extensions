import React from "@moonlight-mod/wp/react";
import { MenuItem } from "@moonlight-mod/wp/contextMenu_contextMenu";
import Settings from "@moonlight-mod/wp/settings_settings";

export default function ReorganizeMenu(getSections: () => any[], sections: any[]) {
  const newSections = [];
  const currentCategory = [];
  const allSections = getSections();

  let currentHeader = "Unsorted";
  for (const section of allSections) {
    const key = section.section.replace(/\W/gi, "_");
    const item = sections.find((s) => s.key === key);
    if (Settings.sectionNames.includes(section.section)) {
      newSections.push(item);
      continue;
    }
    if (section.section === "CUSTOM" || section.section === "logout") continue;

    if (section.section === "DIVIDER") {
      if (currentCategory.length > 0)
        newSections.push(
          <MenuItem id={currentHeader.replace(/\W/gi, "_")} label={currentHeader}>
            {currentCategory.splice(0, currentCategory.length)}
          </MenuItem>
        );

      currentHeader = "Unsorted";
    } else if (section.section === "HEADER") {
      currentHeader = section.label;
    } else {
      if (currentHeader === "Unsorted") {
        newSections.push(item);
      } else {
        currentCategory.push(item);
      }
    }
  }

  return newSections;
}
