import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// Multiple free funding rate APIs
const FUNDING_APIS = {
  binance: "https://fapi.binance.com/fapi/v1",
  bybit: "https://api.bybit.com/v5",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get("symbols");

    if (!symbolsParam) {
      return NextResponse.json(
        { error: "Symbols parameter is required" },
        { status: 400 }
      );
    }

    const symbols = symbolsParam.split(",");
    const fundingData: { [key: string]: any } = {};

    for (const symbol of symbols) {
      const fundingRates: any[] = [];

      // Try Binance first
      try {
        const binanceSymbol = `${symbol}USDT`;
        const binanceResponse = await axios.get(
          `${FUNDING_APIS.binance}/fundingRate`,
          {
            params: {
              symbol: binanceSymbol,
              limit: 1,
            },
            timeout: 5000,
          }
        );

        if (binanceResponse.data && binanceResponse.data.length > 0) {
          const rate = binanceResponse.data[0];
          fundingRates.push({
            exchange: "Binance",
            symbol: binanceSymbol,
            funding_rate: parseFloat(rate.fundingRate),
            funding_time: new Date(rate.fundingTime).toISOString(),
            mark_price: rate.markPrice ? parseFloat(rate.markPrice) : null,
          });
        }
      } catch (error) {
        console.error(`Binance funding rate error for ${symbol}:`, error);
      }

      // Try Bybit
      try {
        const bybitSymbol = `${symbol}USDT`;
        const bybitResponse = await axios.get(
          `${FUNDING_APIS.bybit}/market/funding/history`,
          {
            params: {
              category: "linear",
              symbol: bybitSymbol,
              limit: 1,
            },
            timeout: 5000,
          }
        );

        if (
          bybitResponse.data?.result?.list &&
          bybitResponse.data.result.list.length > 0
        ) {
          const rate = bybitResponse.data.result.list[0];
          fundingRates.push({
            exchange: "Bybit",
            symbol: bybitSymbol,
            funding_rate: parseFloat(rate.fundingRate),
            funding_time: new Date(
              parseInt(rate.fundingRateTimestamp)
            ).toISOString(),
            mark_price: null,
          });
        }
      } catch (error) {
        console.error(`Bybit funding rate error for ${symbol}:`, error);
      }

      // Calculate average funding rate
      const validRates = fundingRates.filter(
        (r) => r.funding_rate !== null && !isNaN(r.funding_rate)
      );
      const averageFundingRate =
        validRates.length > 0
          ? validRates.reduce((sum, r) => sum + r.funding_rate, 0) /
            validRates.length
          : null;

      fundingData[symbol] = {
        exchanges: fundingRates,
        average_funding_rate: averageFundingRate,
        annualized_rate: averageFundingRate
          ? averageFundingRate * 365 * 3 * 100
          : null, // 3 times per day * 365 days * 100 for percentage
        last_updated: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      status: "success",
      data: fundingData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching funding rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch funding rates" },
      { status: 500 }
    );
  }
}
