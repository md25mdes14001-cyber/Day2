export function Logo({ className = "", mark = "light" }: { className?: string; mark?: "light" | "dark" }) {
  const textColor = mark === "light" ? "text-sand" : "text-forest";
  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl font-semibold ${textColor} ${className}`}>
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="M24 4C15 10 10 18 10 26c0 8 6 14 14 14s14-6 14-14c0-2-.3-4-1-6-3 4-7 6-11 6 6-4 8-10 8-16-6 2-10 6-12 12-2-6-5-10-8-18Z"
          fill="#6FA85A"
        />
        <path d="M14 38c4-6 14-6 20 0" stroke="#16241C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
      Ascend Sustainability
    </span>
  );
}
