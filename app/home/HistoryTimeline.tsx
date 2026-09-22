"use client";

import { GraduationCap, TrendingUp, BriefcaseBusiness } from "lucide-react";

import GrowOnHover from "@/hoc/GrowOnHover";

interface ITimelineItem {
  year: number;
  title: string;
  subTitle: string;
  type: "education" | "experience";
}

interface IHistoryTimelineProps {
  title: string;
  timeline: ITimelineItem[];
}

export default function HistoryTimeline({ title, timeline }: IHistoryTimelineProps) {
  const sorted = [...timeline].sort((a, b) => a.year - b.year);

  const eduMap: Record<string, ITimelineItem[]> = {};
  sorted.forEach((item) => {
    if (item.type === "education") {
      if (!eduMap[item.title]) eduMap[item.title] = [];
      eduMap[item.title].push(item);
    }
  });

  const usedEduTitles = new Set<string>();
  const finalTimeline: Array<
    | { type: "experience"; item: ITimelineItem }
    | { type: "education-group"; title: string; items: ITimelineItem[] }
  > = [];

  sorted.forEach((item) => {
    if (item.type === "experience") {
      finalTimeline.push({ type: "experience", item });
    } else {
      if (!usedEduTitles.has(item.title)) {
        usedEduTitles.add(item.title);
        finalTimeline.push({
          type: "education-group",
          title: item.title,
          items: eduMap[item.title].sort((a, b) => a.year - b.year),
        });
      }
    }
  });

  return (
    <div className="flex flex-col items-center w-full max-w-160 mx-auto">
      <h2 className="rounded-md bg-neutral-100 px-2 py-0.5 font-bold uppercase tracking-wide text-[20px] text-red-500 md:text-[35px] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:text-[20px] mb-10 md:mb-14">
        {title}
      </h2>

      <div className="max-w-md xl:max-w-lg">
        {finalTimeline.map((entry, index) => {
          const isLast = index === finalTimeline.length - 1;

          if (entry.type === "experience") {
            const item = entry.item;

            const prev = sorted[index - 1];
            const isPromotion = prev && prev.type === "experience" && prev.title === item.title;

            return (
              <div key={`${item.title}-${item.year}`} className="flex gap-3 sm:gap-4">
                <div className="w-12 sm:w-14 shrink-0 pt-1 text-right">
                  <p
                    className={`text-base font-bold ${
                      isPromotion ? "text-red-300" : "text-white/90"
                    }`}
                  >
                    {item.year}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border shadow-lg z-10
                      ${
                        isPromotion
                          ? "bg-red-700 text-white border-red-400 shadow-red-500/40"
                          : "bg-red-600 text-white border-red-400"
                      }`}
                  >
                    {isPromotion ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <BriefcaseBusiness className="h-4 w-4" />
                    )}
                  </div>
                  {!isLast && <div className="mt-1 w-0.5 flex-1 bg-gray-300 dark:bg-gray-600" />}
                </div>

                <div className={`min-w-0 max-w-72 sm:max-w-80 ${isLast ? "pb-0" : "pb-10"}`}>
                  <GrowOnHover>
                    <div>
                      <h3
                        className={`text-lg font-semibold flex items-center gap-2 ${
                          isPromotion ? "text-red-300" : "text-white/90"
                        }`}
                      >
                        {item.title}
                        {isPromotion && (
                          <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-950 text-xs font-bold">
                            PROMOTION
                          </span>
                        )}
                      </h3>

                      <p className="text-sm text-gray-400">{item.subTitle}</p>
                    </div>
                  </GrowOnHover>
                </div>
              </div>
            );
          }

          const { title: institution, items } = entry;

          return (
            <div key={institution} className="flex gap-3 sm:gap-4">
              <div className="w-12 sm:w-14 shrink-0 pt-1 text-right">
                <p className="text-base font-bold text-neutral-300">{items[0].year}</p>
              </div>

              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-500 bg-neutral-800 text-neutral-100 shadow-lg z-10">
                  <GraduationCap className="h-4 w-4" />
                </div>
                {!isLast && <div className="mt-1 w-0.5 flex-1 bg-gray-300 dark:bg-gray-600" />}
              </div>

              <div className={`min-w-0 max-w-72 sm:max-w-80 ${isLast ? "pb-0" : "pb-10"}`}>
                <GrowOnHover>
                  <div>
                    <h3 className="text-lg font-semibold text-white/90">{institution}</h3>

                    <ul className="mt-1 space-y-1 text-sm text-gray-400">
                      {items.map((i) => (
                        <li key={`${i.subTitle}-${i.year}`} className="flex items-start gap-2">
                          <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-red-400"></span>
                          <span>
                            <span className="font-medium text-white/90">{i.year}</span> —{" "}
                            {i.subTitle}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GrowOnHover>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
