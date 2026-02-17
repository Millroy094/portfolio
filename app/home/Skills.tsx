"use client";

import * as React from "react";
import { SkillsGlobe } from "@/components/SkillsGlobe";
import { skillsRegistry, SkillId, Skill } from "@/components/controls/SkillSelect/SkillRegistery";
import { useWebsiteData } from "@/context/WebsiteData";
import { useMemo } from "react";

/** Group type pulled from your registry */
type GroupKey = NonNullable<Skill["group"]>;

/** Order groups as you like them to appear */
const GROUP_ORDER: GroupKey[] = [
  "FE", // Frontend
  "BE", // Backend
  "DB", // Databases
  "DevOps",
  "Identity",
  "Payments",
  "Messaging",
  "Other",
];

/** Build friendly labels for each group */
function labelForGroup(g: GroupKey) {
  switch (g) {
    case "FE":
      return "Frontend";
    case "BE":
      return "Backend";
    case "DB":
      return "Databases";
    case "DevOps":
      return "DevOps";
    case "Identity":
      return "Identity";
    case "Payments":
      return "Payments";
    case "Messaging":
      return "Messaging";
    default:
      return "Other";
  }
}

/** Group a list of skill IDs by their registry group, keeping GROUP_ORDER */
function groupSkills(skillIds: SkillId[]) {
  const map = new Map<GroupKey, Skill[]>();
  for (const g of GROUP_ORDER) map.set(g, []);
  for (const id of skillIds) {
    const skill = skillsRegistry[id];
    if (!skill) continue;
    const g = (skill.group ?? "Other") as GroupKey;
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(skill);
  }
  // Return only non-empty groups, in order
  return GROUP_ORDER.map((g) => ({ group: g, items: map.get(g)! })).filter(
    (entry) => entry.items.length > 0,
  );
}

export default function Skills() {
  const { data } = useWebsiteData();

  // Only keep valid IDs present in your registry
  const skillIds = useMemo(
    () => (data?.skills ?? []).filter((s): s is SkillId => s in skillsRegistry),
    [data?.skills],
  );

  const groups = useMemo(() => groupSkills(skillIds), [skillIds]);

  if (!data?.visibility?.skills || skillIds.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 mb-16">
      <div className="w-full text-center flex justify-center gap-2">
        <h2 className="inline-block font-bold uppercase tracking-wide text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] mr-1 mb-3">
          Technology &amp;
        </h2>
        <h2 className="inline-block font-bold uppercase tracking-wide text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] text-red-700 mb-3">
          Skills
        </h2>
      </div>
      <div className="block md:hidden mt-2">
        <div className="w-[100vw] ml-[calc(-50vw+50%)]">
          <div
            className="mx-auto aspect-[1/1] relative bg-transparent"
            style={{ width: "min(100vw, 88vh)" }}
          >
            <SkillsGlobe skillIds={skillIds} radius={2.6} height="100%" />
          </div>
        </div>
      </div>

      <div
        className="
          hidden md:grid md:grid-cols-12 md:gap-8
          md:max-w-[1100px] lg:max-w-[1300px] xl:max-w-[1500px]
          md:mx-auto md:mt-6
        "
      >
        <aside className="md:col-span-5 lg:col-span-5 xl:col-span-5">
          <div className="space-y-6 pr-2 pl-4">
            {groups.map(({ group, items }) => (
              <div key={group}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                  {labelForGroup(group)}
                </h3>
                <ul className="flex flex-wrap gap-3">
                  {items.map((skill) => (
                    <li
                      key={skill.id}
                      className="
                        flex items-center justify-center rounded-md
                        border border-neutral-700/50
                        px-3 py-2 bg-neutral-900/30 hover:bg-neutral-900/60
                        transition
                      "
                      title={skill.label}
                      aria-label={skill.label}
                    >
                      {skill.render()}
                      <span className="ml-2 text-sm text-neutral-200 hidden xl:inline">
                        {skill.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <div className="md:col-span-7 lg:col-span-7 xl:col-span-7">
          <div
            className="
              w-full aspect-[1/1] relative bg-transparent
              max-w-[560px] lg:max-w-[640px] xl:max-w-[720px] ml-auto
            "
          >
            <SkillsGlobe skillIds={skillIds} radius={2.9} height="100%" />
          </div>
        </div>
      </div>
    </section>
  );
}
