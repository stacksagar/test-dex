"use client";

import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  theme?: "light" | "dark";
  height?: number;
  width?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  interval = "1D",
  theme = "light",
  height = 500,
  width = "100%",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        const widget = new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: theme === "light" ? "#ffffff" : "#1f2937",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerRef.current.id,
          width: width,
          height: height,
          studies: ["Volume@tv-basicstudies", "MACD@tv-basicstudies"],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
          gridColor: theme === "light" ? "#e5e7eb" : "#374151",
        });

        // Store the widget reference for cleanup if needed
        (containerRef.current as any).tradingViewWidget = widget;
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [symbol, interval, theme, height, width]);

  return (
    <div className="w-full overflow-hidden bg-white">
      <div
        ref={containerRef}
        id={`tradingview_${symbol}_${Date.now()}`}
        style={{ height: `${height}px`, width: width }}
      />
    </div>
  );
};

export default TradingViewChart;
