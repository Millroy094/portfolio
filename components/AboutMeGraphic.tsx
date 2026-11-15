type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function AboutMeGraphic({ className, style }: Props) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <div className="relative py-5">
        <div className="absolute inset-6 rounded-full bg-red-600/15 blur-3xl" />

        <div className="relative overflow-hidden rounded-xl border border-neutral-700/70 bg-neutral-950/90 shadow-2xl shadow-red-950/30">
          <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/80 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            <span className="ml-auto font-mono text-[11px] text-neutral-400">about.tsx</span>
          </div>

          <div className="flex gap-4 px-5 py-7 font-mono text-xs leading-7 sm:text-sm">
            <div className="select-none text-right text-neutral-600">
              <div>01</div>
              <div>02</div>
              <div>03</div>
              <div>04</div>
              <div>05</div>
              <div>06</div>
            </div>
            <div className="min-w-0 whitespace-nowrap text-neutral-200">
              <div>
                <span className="text-red-400">const</span> about = {"{"}
              </div>
              <div className="pl-4">
                focus: <span className="text-red-300">&quot;building&quot;</span>,
              </div>
              <div className="pl-4">
                mindset: <span className="text-red-300">&quot;curious&quot;</span>,
              </div>
              <div className="pl-4">
                growth: <span className="text-red-400">true</span>,
              </div>
              <div>{"};"}</div>
              <div className="text-red-500">_</div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-neutral-800 px-5 py-3 font-mono text-[10px] tracking-wide text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            ALWAYS LEARNING
            <span className="ml-auto text-neutral-500">01 / 01</span>
          </div>
        </div>
      </div>
    </div>
  );
}
