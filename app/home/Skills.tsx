"use client";

import { useEffect, useMemo, useState } from "react";

import { skillsRegistry, SkillId, Skill } from "@/components/controls/SkillSelect/SkillRegistery";
import { SkillsGlobe } from "@/components/SkillsGlobe";
import { useWebsiteData } from "@/context/WebsiteData";

type GroupKey = NonNullable<Skill["group"]>;

const GROUP_ORDER: GroupKey[] = [
  "FE",
  "BE",
  "DB",
  "Testing",
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
    case "Testing":
      return "Testing";
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
  const [activeGroup, setActiveGroup] = useState<GroupKey | null>(null);

  useEffect(() => {
    if (groups.length === 0) {
      setActiveGroup(null);
      return;
    }

    if (!activeGroup || !groups.some((g) => g.group === activeGroup)) {
      setActiveGroup(groups[0].group);
    }
  }, [activeGroup, groups]);

  if (!data?.visibility?.skills || skillIds.length === 0) return null;

  const selectedGroup = groups.find((g) => g.group === activeGroup) ?? groups[0];

  return (
    <section className="relative z-10 mb-20 md:mb-28 px-0">
      {/* Header */}
      <div className="w-full text-center mb-10 md:mb-14">
        <h2
          className="inline-block font-bold uppercase tracking-wide
                       text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] mr-1 text-white/90"
        >
          Technology &amp;
        </h2>
        <h2
          className="ml-1 inline-block rounded-md bg-neutral-100 px-2 py-0.5 font-bold uppercase tracking-wide
                       text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px]
                       text-red-500"
        >
          Skills
        </h2>
      </div>

      <div className="w-screen ml-[calc(-50vw+50%)]">
        <div
          className="mx-auto aspect-square relative bg-transparent"
          style={{
            width: "min(100svw, 78svh)",
          }}
        >
          <SkillsGlobe skillIds={skillIds} radius={2.8} height="100%" />
        </div>
      </div>

      <div className="mt-10 w-full px-4">
        <div className="mx-auto max-w-325">
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {groups.map(({ group }) => {
              const isActive = selectedGroup.group === group;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => setActiveGroup(group)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-red-500 bg-red-500/20 text-white"
                      : "border-neutral-700/60 bg-neutral-900/30 text-neutral-300 hover:border-neutral-500"
                  }`}
                >
                  {labelForGroup(group)}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 mb-3 text-center">
              {labelForGroup(selectedGroup.group)}
            </h3>

            <ul className="flex flex-wrap justify-center gap-3 max-w-72 sm:max-w-80">
              {selectedGroup.items.map((skill) => (
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
        </div>
      </div>
    </section>
  );
}
