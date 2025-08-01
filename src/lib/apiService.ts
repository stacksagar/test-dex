import { TokenData } from "../../types";

const API_BASE = "/api";

export const apiService = {
  async fetchQuotes(symbols: string[]): Promise<any> {
    const response = await fetch(
      `${API_BASE}/quotes?symbols=${symbols.join(",")}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }
    return response.json();
  },

  async fetchLiquidity(symbols: string[]): Promise<any> {
    const response = await fetch(
      `${API_BASE}/liquidity?symbols=${symbols.join(",")}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch liquidity data");
    }
    return response.json();
  },

  async fetchFundingRates(symbols: string[]): Promise<any> {
    const response = await fetch(
      `${API_BASE}/funding-rates?symbols=${symbols.join(",")}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch funding rates");
    }
    return response.json();
  },

  async fetchMetadata(symbols: string[]) {
    const response = await fetch(
      `${API_BASE}/metadata?symbols=${symbols.join(",")}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch metadata");
    }
    return response.json();
  },

  // Transform CMC API response to our TokenData format
  transformCMCData(cmcResponse: any): { [key: string]: TokenData } {
    const transformedData: { [key: string]: TokenData } = {};

    if (cmcResponse.data) {
      Object.keys(cmcResponse.data).forEach((symbol) => {
        const token = cmcResponse.data[symbol];
        if (token) {
          const quote = token.quote?.USD;

          if (quote) {
            transformedData[symbol] = {
              id: token.id?.toString() || "0",
              name: token.name || symbol,
              symbol: token.symbol || symbol,
              price: quote.price || 0,
              market_cap: quote.market_cap || 0,
              volume_24h: quote.volume_24h || 0,
              percent_change_24h: quote.percent_change_24h || 0,
              circulating_supply: token.circulating_supply || 0,
              total_supply: token.total_supply || 0,
              cmc_rank: token.cmc_rank || 0,
              last_updated: quote.last_updated || new Date().toISOString(),
            };
          }
        }
      });
    }

    return transformedData;
  },

  // Combine all data sources
  async fetchCompleteTokenData(
    symbols: string[]
  ): Promise<{ [key: string]: TokenData }> {
    try {
      // Fetch all data in parallel
      const [quotesResponse, liquidityResponse, fundingResponse] =
        await Promise.allSettled([
          this.fetchQuotes(symbols),
          this.fetchLiquidity(symbols),
          this.fetchFundingRates(symbols),
        ]);

      // Transform quotes data first
      let tokenData: { [key: string]: TokenData } = {};
      if (quotesResponse.status === "fulfilled") {
        tokenData = this.transformCMCData(quotesResponse.value);
      }

      // Add liquidity data
      if (
        liquidityResponse.status === "fulfilled" &&
        liquidityResponse.value.data
      ) {
        Object.keys(liquidityResponse.value.data).forEach((symbol) => {
          if (tokenData[symbol]) {
            const liquidityInfo = liquidityResponse.value.data[symbol];
            tokenData[symbol].liquidity = {
              total_tvl: liquidityInfo.total_tvl || 0,
              liquidity_pools: liquidityInfo.liquidity_pools || [],
            };
          }
        });
      }

      // Add funding rate data
      if (
        fundingResponse.status === "fulfilled" &&
        fundingResponse.value.data
      ) {
        Object.keys(fundingResponse.value.data).forEach((symbol) => {
          if (tokenData[symbol]) {
            const fundingInfo = fundingResponse.value.data[symbol];
            tokenData[symbol].funding_rate = {
              average_rate: fundingInfo.average_funding_rate || 0,
              annualized_rate: fundingInfo.annualized_rate || 0,
              exchanges: fundingInfo.exchanges || [],
            };
          }
        });
      }

      return tokenData;
    } catch (error) {
      console.error("Error fetching complete token data:", error);
      throw error;
    }
  },
};
