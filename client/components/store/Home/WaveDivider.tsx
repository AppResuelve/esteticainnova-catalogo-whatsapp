type WaveDividerProps = {
  fillColor?: string;
  position?: "bottom" | "top";
};

export function WaveDivider({
  fillColor = "var(--color-background)",
  position = "bottom",
}: WaveDividerProps) {
  const isBottom = position === "bottom";

  return (
    <div
      className={`absolute ${
        isBottom ? "bottom-0" : "top-0"
      } left-0 w-full leading-[0] overflow-hidden`}
      style={{
        transform: isBottom ? "translateY(1px)" : "translateY(-1px)",
        zIndex: 10,
      }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-[50px] md:h-[150px]"
        style={isBottom ? { transform: "rotate(180deg)" } : {}}
      >
        <path
          d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
          fill={fillColor}
        />
      </svg>
    </div>
  )
}
