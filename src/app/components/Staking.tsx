"use client";
import ArrowDown from "@/assets/arrow-down.svg";
import ArrowUp from "@/assets/arrow-up.svg";
import Info from "@/assets/info.svg";
import ComingSoonPopup from "@/components/ComingSoonPopup";
import { currencyPairs, getBaseSymbol } from "@/data/dummyData";
import { apiService } from "@/lib/apiService";
import { cn } from "@/utils/tailwind";
import { ArrowLeftRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import Select from "react-select";
import { TokenData } from "../../../types";
import FuturesStrategySlider from "./FuturesStrategySlider";

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
    fontWeight: "800",
    color: state.isDisabled ? "#999" : provided.color,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: "24px",
    fontWeight: "800",
    color: "#999",
  }),
};

const types = [
  {
    value: "long",
    label: "Long",
    icon: <ArrowUp />,
  },
  {
    value: "short",
    label: "Short",
    icon: <ArrowDown />,
  },
];

function Staking() {
  // Use shared URL state for synchronization with TradeView
  const [exchange, setExchange] = useQueryState("exchange", {
    defaultValue: currencyPairs[0].value.replace("/", "_"),
  });

  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState("long");
  const [percentages, setPercentages] = useState("");
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [tokenData, setTokenData] = useState<{ [key: string]: TokenData }>({});
  const [loading, setLoading] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Convert exchange back to pair format for display
  const currentPair =
    currencyPairs.find((pair) => pair.value.replace("/", "_") === exchange) ||
    currencyPairs[0];

  const currency = currentPair.value.split("/")[currencyIndex];
  const baseSymbol = getBaseSymbol(currentPair.label);
  const currentTokenData = tokenData[baseSymbol];

  // Calculate estimated receive amount based on current token price
  const calculateEstimatedReceive = () => {
    if (!amount || !currentTokenData?.price) return "245.32 KTA";

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "0 KTA";

    // If trading from base currency to quote currency
    if (currencyIndex === 0) {
      const quoteAmount = numAmount * currentTokenData.price;
      return `${quoteAmount.toFixed(2)} KTA`;
    } else {
      // If trading from quote currency to base currency
      const baseAmount = numAmount / currentTokenData.price;
      return `${baseAmount.toFixed(6)} ${baseSymbol}`;
    }
  };

  // Calculate order value in USD
  const calculateOrderValue = () => {
    if (!amount || !currentTokenData?.price) return "$500.00";

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "$0.00";

    let usdValue: number;
    if (currencyIndex === 0) {
      // Amount is in base currency, convert to USD
      usdValue = numAmount * currentTokenData.price;
    } else {
      // Amount is already in quote currency (assuming USDT/USD)
      usdValue = numAmount;
    }

    return `$${usdValue.toFixed(2)}`;
  };

  // Calculate fee (0.5% of order value)
  const calculateFee = () => {
    const orderValue = calculateOrderValue();
    const numValue = parseFloat(orderValue.replace("$", ""));
    if (isNaN(numValue)) return "$2.50";

    const fee = numValue * 0.005; // 0.5% fee
    return `$${fee.toFixed(2)}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const symbols = Array.from(
          new Set(currencyPairs.map((pair) => getBaseSymbol(pair.label)))
        );

        const data = await apiService.fetchCompleteTokenData(symbols);
        setTokenData(data);
      } catch (err) {
        console.error("Error fetching token data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tableData = [
    { label: "Est. Receive", value: calculateEstimatedReceive() },
    { label: "Type", value: "Market" },
    { label: "Order Value", value: calculateOrderValue() },
    { label: "Fee", value: calculateFee() },
  ];
  return (
    <div className="p-6 space-y-6 h-full relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            Loading...
          </div>
        </div>
      )}

      <div className="grid grid-cols-2">
        {types.map((item) => (
          <button
            key={item.label}
            onClick={() => setType(item.value)}
            className={cn(
              "bg-white  h-10 text-[#A0A3C4] flex items-center justify-center gap-2 border-b border-transparent",
              {
                "text-[#009933] bg-[#C4E7D0] border-[#0FDE8D]":
                  type === item.value && type == "long",
              },
              {
                "text-red-600 bg-red-50 border-red-300":
                  type === item.value && type == "short",
              }
            )}
          >
            {item.icon} <span>{item.label}</span>
          </button>
        ))}
        {/* <button className="bg-[#C4E7D0] text-[#007C29] h-10 flex items-center justify-center gap-2 border-b border-[#0FDE8D]">
          <ArrowUp className="text-[#009933]" /> <span>Long</span>
        </button>
         */}
      </div>
      <div className="bg-[#F2F2F2] h-[1px]" />
      <div className="">
        <Select
          value={currentPair}
          onChange={(value) => {
            if (value) {
              setExchange(value.value.replace("/", "_"));
            }
          }}
          options={currencyPairs}
          styles={customStyles}
          isDisabled={loading}
          placeholder={loading ? "Loading..." : "Select pair"}
          isLoading={loading}
        />
        {loading && (
          <div className="text-xs text-gray-500 mt-1">
            Loading market data...
          </div>
        )}
      </div>
      <div className="">
        <label htmlFor="amount">Amount</label>
        <div className="flex items-center">
          <div className="grow">
            <input
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                // setPercentages("");
              }}
              type="number"
              className="w-full h-[48px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-end px-2 text-xl"
            />
          </div>
          <div className="flex items-center gap-[6px] p-2">
            <span className="font-extrabold text-2xl text-[#262626]">
              {currency}
            </span>
            <button
              onClick={() => {
                setCurrencyIndex((prev) => (prev === 0 ? 1 : 0));
                setAmount("");
              }}
              className="text-xs"
            >
              <ArrowLeftRight size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="grid  grid-cols-3 text-xs border border-[#B3B3B3] ">
        {["25%", "50%", "Max"].map((item, i) => (
          <button
            key={item}
            onClick={() => setPercentages(item)}
            className={cn("h-[32px]", {
              "border-x border-[#B3B3B3]": i == 1,
              "bg-[#B3B3B3] text-white": item === percentages,
            })}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="pb-5">
        <FuturesStrategySlider />
      </div>
      <div className="">
        <button
          onClick={() => setShowComingSoon(true)}
          className="w-full bg-primary h-[48px] rounded-xl font-semibold font-area text-[#262626] hover:bg-opacity-90 transition-all duration-200"
        >
          Connect Wallet
        </button>
      </div>

      <div className="">
        <table className="min-w-full table-auto text-sm text-left font-dm-sans">
          <tbody>
            {tableData.map((row) => (
              <tr key={row.label} className=" last:border-none">
                <th className="py-1.5 pr-4 font-medium text-[#595959]">
                  {row.label}
                </th>
                <td className="py-1.5 text-[#262626] text-end">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2">
        <Info />
        <p className="text-xs font-author max-w-[182.25px]">
          All orders are pre-trade and post-trade private.
        </p>
      </div>

      {/* Coming Soon Popup */}
      <ComingSoonPopup
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
}

export default Staking;
