"use client";

import { useMemo } from "react";

import { skillsRegistry, SkillId, Skill } from "@/components/controls/SkillSelect/SkillRegistery";
import { SkillsGlobe } from "@/components/SkillsGlobe";
import { useWebsiteData } from "@/context/WebsiteData";

type GroupKey = NonNullable<Skill["group"]>;

const GROUP_ORDER: GroupKey[] = [
  "FE",
  "BE",
  "DB",
  "DevOps",
  "Identity",
  "Payments",
  "Messaging",
  "Other",
];

/** Friendly labels */
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

function groupSkills(skillIds: SkillId[]) {
  const map = new Map<GroupKey, Skill[]>();
  for (const g of GROUP_ORDER) map.set(g, []);
  for (const id of skillIds) {
    const skill = skillsRegistry[id];
    if (!skill) continue;
    const g = (skill.group ?? "Other") as GroupKey;
    map.get(g)!.push(skill);
  }
  return GROUP_ORDER.map((g) => ({ group: g, items: map.get(g)! })).filter(
    (e) => e.items.length > 0,
  );
}

export default function Skills() {
  const { data } = useWebsiteData();
  const skillIds = useMemo(
    () => (data?.skills ?? []).filter((s): s is SkillId => s in skillsRegistry),
    [data?.skills],
  );
  const groups = useMemo(() => groupSkills(skillIds), [skillIds]);

  if (!data?.visibility?.skills || skillIds.length === 0) return null;

  return (
    <section className="relative z-10 mb-16 px-0">
      {/* Header */}
      <div className="w-full text-center">
        <h2
          className="inline-block font-bold uppercase tracking-wide
                       text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] mr-1 mb-3"
        >
          Technology &amp;
        </h2>
        <h2
          className="inline-block font-bold uppercase tracking-wide
                       text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px]
                       text-red-700 mb-3"
        >
          Skills
        </h2>
      </div>

      <div className="mt-6 w-screen ml-[calc(-50vw+50%)]">
        <div
          className="mx-auto aspect-square relative bg-transparent"
          style={{
            width: "min(100svw, 78svh)",
          }}
        >
          <SkillsGlobe skillIds={skillIds} radius={2.8} height="100%" />
        </div>
      </div>

      <div className="mt-10 w-full px-4 ">
        <div
          className="
      mx-auto
      max-w-325
      grid
      gap-10
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    "
        >
          {groups.map(({ group, items }) => (
            <div key={group}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 mb-3">
                {labelForGroup(group)}
              </h3>

              <ul className="flex flex-wrap gap-3">
                {items.map((skill) => (
                  <li
                    key={skill.id}
                    className="
                flex items-center px-3 py-2 rounded-md
                bg-neutral-900/40 border border-neutral-700/40
                hover:bg-neutral-900/70 transition
              "
                  >
                    {skill.render()}
                    <span className="ml-2 text-sm text-neutral-200">{skill.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
