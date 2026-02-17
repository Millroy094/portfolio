"use client";

import { Code } from "@mui/icons-material";

import GrowOnHover from "@/hoc/GrowOnHover";

interface ITimelineItem {
  year: number;
  title: string;
  subTitle: string;
}

interface IHistoryTimelineProps {
  title: string;
  timeline: ITimelineItem[];
}

export default function HistoryTimeline({ title, timeline }: IHistoryTimelineProps) {
  const sorted = [...timeline].sort((a, b) => a.year - b.year);

  return (
    <div className="flex flex-col items-center w-full lg:w-1/2 max-w-160 mx-auto">
      <h2
        className="font-bold uppercase tracking-wide
                     text-[20px] sm:text-[20px] md:text-[35px] lg:text-[35px] mb-6"
      >
        {title}
      </h2>

      <div className="relative pl-16">
        {sorted.map((item, index) => (
          <div key={`${item.title}-${item.year}`} className="relative pb-10">
            {index !== sorted.length - 1 && (
              <div
                className="absolute left-1 top-8 w-0.5 h-[calc(100%-8px)]
                              bg-gray-300 dark:bg-gray-600 z-0"
              ></div>
            )}

            <GrowOnHover>
              <div className="relative z-20">
                <div className="absolute -left-36 top-1 w-32 text-right">
                  <p className="font-bold text-gray-800 dark:text-gray-300">{item.year}</p>
                </div>

                <div
                  className="absolute -left-2.5 top-1 z-30 w-7 h-7 rounded-full
                             bg-red-600 flex items-center justify-center text-white shadow-md"
                >
                  <Code fontSize="small" />
                </div>

                <div className="ml-10">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.subTitle}</p>
                </div>
              </div>
            </GrowOnHover>
          </div>
        ))}
      </div>
    </div>
  );
}
