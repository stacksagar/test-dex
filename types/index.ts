export interface LiquidityPool {
  protocol: string;
  tvl: number;
  category: string;
  chains: string[];
  change_1d?: number;
  change_7d?: number;
}

export interface FundingRate {
  exchange: string;
  symbol: string;
  funding_rate: number;
  funding_time: string;
  next_funding_time?: string;
  mark_price?: number | null;
}

export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  percent_change_24h: number;
  available_supply?: number;
  total_supply?: number;
  circulating_supply?: number;
  cmc_rank?: number;
  last_updated: string;
  // New fields
  liquidity?: {
    total_tvl: number;
    liquidity_pools: LiquidityPool[];
  };
  funding_rate?: {
    average_rate: number;
    annualized_rate: number;
    exchanges: FundingRate[];
  };
}

export interface CMCResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: {
    [key: string]: TokenData[];
  };
}

export interface TradingViewSymbol {
  symbol: string;
  name: string;
  exchange: string;
  pair: string;
}
