import { useEffect, useRef } from "react";

import { useState } from "react";
import { cn } from "@/utils/tailwind";
const steps = [0.1, 1, 2, 5, 10, 15, 25, 50, 75];

function mapBtoA(b: number) {
  if (b <= 0) return steps[0];
  if (b >= 100) return steps[steps.length - 1];

  const intervalSize = 100 / (steps.length - 1); // = 12.5
  const i = Math.floor(b / intervalSize);
  const t = (b - i * intervalSize) / intervalSize;

  return steps[i] + (steps[i + 1] - steps[i]) * t;
}

const FuturesStrategySlider = () => {
  const [zoom, setZoom] = useState(90);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [tooltipLeft, setTooltipLeft] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const percent = zoom / 100;
    const sliderWidth = slider.offsetWidth;
    const thumbSize = 9.27;
    const offset = percent * (sliderWidth - thumbSize) + thumbSize / 2;

    setTooltipLeft(offset);
  }, [zoom]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="relative w-full">
        <div className="w-full h-[3px] bg-black rounded-full">
          <div
            className={cn("h-full bg-primary rounded-full")}
            style={{ width: zoom + "%" }}
          />
        </div>
        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={100}
          step={1}
          value={zoom}
          onChange={handleChange}
          className="w-full appearance-none bg-transparent h-[3px] absolute -top-[1px] z-30 slider"
        />
        <div className="flex justify-between absolute -top-[1.5px] w-full">
          {steps.map((step) => (
            <span
              key={step}
              className="relative w-[1px] flex flex-col items-center"
            >
              <div
                className={cn("h-[6px] w-[1.5px] bg-black mx-auto", {
                  "bg-primary": step <= mapBtoA(zoom),
                })}
              />
              <div className="text-center mt-1 text-[#A0A3C4] text-xs">
                {step}x
              </div>
            </span>
          ))}
        </div>

        <div
          className={cn(
            "absolute -top-[10px] px-2 bg-slate-900 text-white text-xs rounded shadow w-[40px] h-[20px] flex justify-center items-center"
          )}
          style={{
            left: `${tooltipLeft + 15}px`,
          }}
        >
          {mapBtoA(zoom).toFixed(1)}x
        </div>
      </div>
    </div>
  );
};

export default FuturesStrategySlider;
