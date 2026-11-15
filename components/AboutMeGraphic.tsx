type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function AboutMeGraphic({ className, style }: Props) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <div className="aspect-340/355 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
        <svg className="h-full w-full" viewBox="0 0 340 355">
          <defs>
            <linearGradient id="about-monogram-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#f5f5f5" />
              <stop offset="100%" stopColor="#8f8f94" />
            </linearGradient>
            <radialGradient id="about-monogram-glow">
              <stop stopColor="#b91c1c" stopOpacity=".25" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="170" cy="173" r="136" fill="url(#about-monogram-glow)" />
          <circle cx="170" cy="175" r="116" fill="none" stroke="#3f3f46" />
          <circle cx="170" cy="175" r="104" fill="none" stroke="#27272a" />
          <path
            d="M77 253 V110 L121 173 165 110 V253"
            fill="none"
            stroke="url(#about-monogram-metal)"
            strokeWidth="15"
          />
          <path
            d="M192 253 V110 H269 M192 174 H255"
            fill="none"
            stroke="#ef4444"
            strokeWidth="15"
          />
          <path d="M79 278 H261" stroke="#52525b" />
          <circle cx="170" cy="59" r="3" fill="#ef4444" />
          <circle cx="170" cy="291" r="3" fill="#ef4444" />
        </svg>
      </div>
    </div>
  );
}
