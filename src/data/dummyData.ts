export const currencyPairs = [ 
  { value: "BTC/USDT", label: "BTC/USDT" },
  { value: "ETH/USDT", label: "ETH/USDT" },
  { value: "SOL/USDT", label: "SOL/USDT" },
  { value: "BNB/USDT", label: "BNB/USDT" },
  { value: "XRP/USDT", label: "XRP/USDT" },
  { value: "DOGE/USDT", label: "DOGE/USDT" },
  { value: "ADA/USDT", label: "ADA/USDT" },
  { value: "AVAX/USDT", label: "AVAX/USDT" },
  { value: "POL/USDT", label: "POL/USDT" },
];

// Function to extract base symbol from trading pair
export const getBaseSymbol = (pair: string): string => {
  return pair.split("/")[0];
};

// Function to format number with appropriate decimals and units
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(2)}K`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toFixed(6)}`;
  }
};

// Function to format volume
export const formatVolume = (volume: number): string => {
  if (volume >= 1000000000) {
    return `$${(volume / 1000000000).toFixed(1)}B`;
  } else if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}m`;
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}K`;
  } else {
    return `$${volume.toFixed(0)}`;
  }
};

// Function to format percentage change
export const formatPercentChange = (
  change: number
): {
  formatted: string;
  isPositive: boolean;
} => {
  const isPositive = change >= 0;
  const formatted = `${isPositive ? "+" : ""}${change.toFixed(2)}%`;
  return { formatted, isPositive };
};
