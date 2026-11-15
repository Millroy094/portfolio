type Props = {
  fullName?: string;
  className?: string;
  style?: React.CSSProperties;
};

function getInitials(fullName = "") {
  const names = fullName.trim().split(/\s+/).filter(Boolean);
  const first = names[0]?.charAt(0).toUpperCase() ?? "";
  const last = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : "";
  return { first, last };
}

export default function AboutMeGraphic({ fullName, className, style }: Props) {
  const { first, last } = getInitials(fullName);
  return (
    <div className={className} style={style} aria-hidden="true">
      <div className="aspect-340/355 w-full">
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
          <text
            x="170"
            y="253"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="190"
            fontWeight="700"
            letterSpacing="-6"
          >
            <tspan fill="url(#about-monogram-metal)">{first}</tspan>
            <tspan fill="#ef4444">{last}</tspan>
          </text>
          <rect x="159" y="267" width="22" height="4" rx="1" fill="#ffffff" />
          <g className="about-monogram-orbit">
            <circle cx="170" cy="59" r="3" fill="#ef4444" />
            <circle cx="170" cy="291" r="3" fill="#ef4444" />
          </g>
          <g className="about-monogram-orbit about-monogram-orbit-inner">
            <circle cx="170" cy="71" r="2" fill="#a1a1aa" />
            <circle cx="170" cy="279" r="2" fill="#a1a1aa" />
          </g>
        </svg>
      </div>
    </div>
  );
}
