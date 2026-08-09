import { SparkleStar } from "./SparkleStar";
import { SparkleStarOutline } from "./SparkleStarOutline";

type SectionTitleProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  className?: string;
  sparkle?: "left" | "right" | "both" | "none";
};

export function SectionTitle({
  badge,
  title,
  subtitle,
  className = "",
  sparkle = "none",
}: SectionTitleProps) {
  return (
    <div className={`relative text-center py-16 md:py-12 ${className}`}>
      {sparkle === "left" || sparkle === "both" ? (
        <>
          <SparkleStar
            size={22}
            className="absolute top-6 left-[15%] md:left-[25%]"
          />
          <SparkleStarOutline
            size={16}
            className="absolute top-3 left-[12%] md:left-[22%]"
          />
        </>
      ) : null}
      {sparkle === "right" || sparkle === "both" ? (
        <>
          <SparkleStar
            size={18}
            className="absolute top-8 right-[15%] md:right-[25%]"
          />
          <SparkleStarOutline
            size={14}
            className="absolute top-5 right-[12%] md:right-[22%]"
          />
        </>
      ) : null}
      {badge && (
        <span className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-text-primary)] mb-4">
          {badge}
        </span>
      )}
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
