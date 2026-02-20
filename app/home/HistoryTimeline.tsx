"use client";

import { School, Work, TrendingUp } from "@mui/icons-material";

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
    <div className="flex flex-col items-center w-full lg:w-1/2 max-w-160 mx-auto">
      <h2 className="font-bold uppercase tracking-wide text-[20px] md:text-[35px] mb-6 text-white/90">
        {title}
      </h2>

      <div className="relative pl-16">
        {finalTimeline.map((entry, index) => {
          const isLast = index === finalTimeline.length - 1;

          if (entry.type === "experience") {
            const item = entry.item;

            const prev = sorted[index - 1];
            const isPromotion = prev && prev.type === "experience" && prev.title === item.title;

            return (
              <div key={`${item.title}-${item.year}`} className="relative pb-10">
                {!isLast && (
                  <div className="absolute left-0.75 top-8 w-0.5 bottom-0 bg-gray-300 dark:bg-gray-600" />
                )}

                <div className="absolute -left-40 top-2 w-32 text-right">
                  <p className={`font-bold ${isPromotion ? "text-yellow-300" : "text-white/90"}`}>
                    {item.year}
                  </p>
                </div>

                <div
                  className={`absolute -left-2.5 top-1 w-7 h-7 rounded-full flex items-center justify-center shadow-lg border z-10
                    ${
                      isPromotion
                        ? "bg-yellow-500 text-black border-yellow-300 shadow-yellow-500/50 animate-pulse"
                        : "bg-red-600 text-white border-red-400"
                    }`}
                >
                  {isPromotion ? <TrendingUp fontSize="small" /> : <Work fontSize="small" />}
                </div>

                <GrowOnHover>
                  <div className="ml-10">
                    <h3
                      className={`text-lg font-semibold flex items-center gap-2 ${
                        isPromotion ? "text-yellow-300" : "text-white/90"
                      }`}
                    >
                      {item.title}
                      {isPromotion && (
                        <span className="px-2 py-0.5 rounded bg-yellow-400 text-black text-xs font-bold">
                          PROMOTION
                        </span>
                      )}
                    </h3>

                    <p className="text-sm text-gray-400">{item.subTitle}</p>
                  </div>
                </GrowOnHover>
              </div>
            );
          }

          const { title: institution, items } = entry;

          return (
            <div key={institution} className="relative pb-10">
              {!isLast && (
                <div className="absolute left-0.75 top-8 w-0.5 bottom-0 bg-gray-300 dark:bg-gray-600" />
              )}

              <div className="absolute -left-2.5 top-1 w-7 h-7 rounded-full flex items-center justify-center bg-blue-600 border border-blue-400 text-white shadow-lg z-10">
                <School fontSize="small" />
              </div>

              <div className="absolute -left-40 top-2 w-32 text-right">
                <p className="font-bold text-blue-300">{items[0].year}</p>
              </div>

              <GrowOnHover>
                <div className="ml-10">
                  <h3 className="text-lg font-semibold text-blue-200">{institution}</h3>

                  <ul className="mt-1 space-y-1 text-sm text-gray-400">
                    {items.map((i) => (
                      <li key={`${i.subTitle}-${i.year}`} className="flex gap-2">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                        <span>
                          <span className="font-medium text-white/90">{i.year}</span> — {i.subTitle}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GrowOnHover>
            </div>
          );
        })}
      </div>
    </div>
  );
}
