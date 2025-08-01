"use client";
import ArrowDown from "@/assets/arrow-down.svg";
import ArrowUp from "@/assets/arrow-up.svg";
import {
  currencyPairs,
  formatPercentChange,
  formatPrice,
  formatVolume,
  getBaseSymbol,
} from "@/data/dummyData";
import { apiService } from "@/lib/apiService";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { TokenData } from "../../../types";
import TradingViewChart from "../../components/TradingViewChart";

const options = currencyPairs.map((pair) => ({
  label: pair.label,
  value: pair.value.replace("/", "_"),
}));

const CustomSingleValue = (props: any) => {
  return (
    <components.SingleValue {...props}>
      <span className="font-semibold block font-area text-[#262626] text-base">
        {props.data.label}
      </span>
    </components.SingleValue>
  );
};

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    height: "40px",
    minHeight: "40px",
    fontSize: "14px",
    border: "none",
    boxShadow: "none",
    padding: "0 8px",
    opacity: state.isDisabled ? 0.6 : 1,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: "0",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    fontSize: "24px",
    color: state.isDisabled ? "#999" : provided.color,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: "24px",
    color: "#999",
  }),
};

export default function TradeView() {
  const [exchange] = useQueryState("exchange", {
    defaultValue: options[0].value,
  });
  const [timeline] = useQueryState("timeline", {
    defaultValue: "D",
  });

  // Get current token symbol from selected exchange
  const currentPair = options.find((opt) => opt.value === exchange);
  const currentSymbol = currentPair ? getBaseSymbol(currentPair.label) : "BTC";

  // Convert timeline to TradingView format
  const getChartInterval = (timeline: string) => {
    switch (timeline) {
      case "5m":
        return "5";
      case "1h":
        return "60";
      case "D":
        return "1D";
      default:
        return "1D";
    }
  };

  return (
    <div className="w-full flex flex-col">
      <InfoBar />
      <div className="w-full grow flex justify-center items-center relative min-h-[471px]">
        <TradingViewChart
          symbol={currentSymbol + "USDT"}
          height={520}
          width="100%"
          theme="light"
          interval={getChartInterval(timeline)}
        />
      </div>
    </div>
  );
}

const InfoBar = () => {
  const [exchange, setExchange] = useQueryState("exchange", {
    defaultValue: options[0].value,
  });

  const [tokenData, setTokenData] = useState<{ [key: string]: TokenData }>({});
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current token symbol from selected exchange
  const currentPair = options.find((opt) => opt.value === exchange);
  const currentSymbol = currentPair ? getBaseSymbol(currentPair.label) : "BTC";
  const currentTokenData = tokenData[currentSymbol];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all unique symbols from currency pairs
        const symbols = Array.from(
          new Set(currencyPairs.map((pair) => getBaseSymbol(pair.label)))
        );

        const data = await apiService.fetchCompleteTokenData(symbols);
        setTokenData(data);
      } catch (err) {
        console.error("Error fetching token data:", err);
        setError("Failed to fetch market data");
      } finally {
        setLoading(false);
        setFetched(true);
      }
    };

    fetchData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format the data for display
  const displayPrice = currentTokenData?.price
    ? formatPrice(currentTokenData.price)
    : "$0.00";
  const displayVolume = currentTokenData?.volume_24h
    ? formatVolume(currentTokenData.volume_24h)
    : "$0.00";
  const percentChange = currentTokenData?.percent_change_24h
    ? formatPercentChange(currentTokenData.percent_change_24h)
    : { formatted: "+0.00%", isPositive: true };

  // Calculate some derived values for display
  const availableLiquidity = currentTokenData?.liquidity?.total_tvl
    ? formatVolume(currentTokenData.liquidity.total_tvl)
    : "$0.00";

  // Available liquidity change (use price change as proxy for liquidity change)
  // Logic: If token price goes up, liquidity tends to increase (more demand)
  // Arrow shows: Green ↗️ if positive change, Red ↘️ if negative change
  const liquidityChange = currentTokenData?.percent_change_24h
    ? (currentTokenData.percent_change_24h / 100) * 0.5 // Half the price change as liquidity change
    : 0.032; // Default +3.2%

  const openInterestUp = currentTokenData?.volume_24h
    ? formatVolume(currentTokenData.volume_24h * 0.48)
    : "$22.9m";
  const openInterestDown = currentTokenData?.volume_24h
    ? formatVolume(currentTokenData.volume_24h * 0.52)
    : "$23.9m";

  // Net funding rate (single value with direction)
  // Logic: Positive rate = Longs pay Shorts (bullish sentiment), Negative = Shorts pay Longs (bearish sentiment)
  // Arrow shows: Green ↗️ if positive funding rate, Red ↘️ if negative funding rate
  const netFundingRate =
    currentTokenData?.funding_rate?.average_rate || 0.000014; // Default 0.0014%
  const fundingRateFormatted = `${netFundingRate >= 0 ? "+" : ""}${(
    netFundingRate * 100
  ).toFixed(4)}%`;
  const isFundingPositive = netFundingRate >= 0;

  return (
    <div className="flex flex-col lg:flex-row items-stretch h-auto lg:h-[80px] relative">
      {/* Global loading overlay */}
      {!fetched && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            Loading market data...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-2 right-2 text-xs text-red-500 z-20">
          {error}
        </div>
      )}

      {/* Mobile: Three-column layout */}
      <div className="flex flex-row w-full lg:hidden">
        {/* Left: Select dropdown */}
        <div className="flex flex-col justify-center min-w-[90px]">
          <Select
            value={options.find((item) => item.value === exchange)}
            options={options}
            styles={customStyles}
            onChange={(value) => setExchange(value?.value || "")}
            components={{ SingleValue: CustomSingleValue }}
            isDisabled={!fetched}
            placeholder={!fetched ? "Loading..." : "Select pair"}
            isLoading={!fetched}
          />
        </div>
        {/* Center: Price and 24h Volume */}
        <div className="flex flex-col flex-1 items-center justify-center">
          <span className="block text-sm text-[#262626]">{displayPrice}</span>
          <span
            className={`text-xs ${
              percentChange.isPositive ? "text-[#0FDE8D]" : "text-[#FF506A]"
            }`}
          >
            {percentChange.formatted}
          </span>
          <span className="block text-xs text-[#595959] mt-2">24h Volume</span>
          <span className="text-sm text-[#262626]">{displayVolume}</span>
        </div>
        {/* Right: Available Liquidity and Net Rate */}
        <div className="flex flex-col items-end justify-center min-w-[110px] gap-2 pr-2">
          <div>
            <span className="block text-xs text-[#595959]">
              Available Liquidity
            </span>
            <div className="text-sm text-[#262626]">
              <div
                className={`flex items-center gap-1 ${
                  liquidityChange >= 0 ? "text-[#0FDE8D]" : "text-[#FF506A]"
                }`}
              >
                {liquidityChange >= 0 ? <ArrowUp /> : <ArrowDown />}
                <span>{availableLiquidity}</span>
              </div>
            </div>
          </div>
          <div className="mr-4">
            <span className="block text-xs text-[#595959]">Net Rate / 1h</span>
            <div className="text-sm text-[#262626]">
              <div
                className={`flex items-center gap-1 ${
                  isFundingPositive ? "text-[#0FDE8D]" : "text-[#FF506A]"
                }`}
              >
                {isFundingPositive ? <ArrowUp /> : <ArrowDown />}
                <span>{fundingRateFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop: original layout */}
      <div className="grow gap-6 items-center hidden lg:flex">
        <div className="flex flex-col justify-center min-w-[90px]">
          <Select
            value={options.find((item) => item.value === exchange)}
            options={options}
            styles={customStyles}
            onChange={(value) => setExchange(value?.value || "")}
            components={{ SingleValue: CustomSingleValue }}
            isDisabled={!fetched}
            placeholder={!fetched ? "Loading..." : "Select pair"}
            isLoading={!fetched}
          />
        </div>
        <div>
          <span className="block text-sm text-[#262626]">{displayPrice}</span>
          <span
            className={`text-xs ${
              percentChange.isPositive ? "text-[#0FDE8D]" : "text-[#FF506A]"
            }`}
          >
            {percentChange.formatted}
          </span>
        </div>
        <div>
          <span className="block text-xs text-[#595959] ">
            24h <br /> Volume
          </span>
          <span className="text-sm text-[#262626]">{displayVolume}</span>
        </div>
        <div>
          <div className="block text-xs text-[#595959] ">
            Open Interest (<span className="text-[#0FDE8D]"> 48% </span> /{" "}
            <span className="text-[#FF506A]"> 52% </span>)
          </div>
          <div className="text-sm text-[#262626] flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ArrowUp />
              <span>{openInterestUp}</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowDown />
              <span>{openInterestDown}</span>
            </div>
          </div>
        </div>
        <div className="">
          <span className="block text-xs text-[#595959] ">
            Available Liquidity
          </span>
          <div
            className={`text-sm flex items-center gap-2 ${
              liquidityChange >= 0 ? "text-[#0FDE8D]" : "text-[#FF506A]"
            }`}
          >
            <div className="flex items-center gap-1">
              {liquidityChange >= 0 ? <ArrowUp /> : <ArrowDown />}
              <span>{availableLiquidity}</span>
            </div>
          </div>
        </div>
        <div>
          <span className="block text-xs text-[#595959] ">Net Rate / 1h</span>
          <div
            className={`text-sm flex items-center gap-2 ${
              isFundingPositive ? "text-[#0FDE8D]" : "text-[#FF506A]"
            }`}
          >
            <div className="flex items-center gap-1">
              {isFundingPositive ? <ArrowUp /> : <ArrowDown />}
              <span>{fundingRateFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
