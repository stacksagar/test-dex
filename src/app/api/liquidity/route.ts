import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

const DEFILLAMA_API_BASE = "https://api.llama.fi";

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
    const liquidityData: { [key: string]: any } = {};

    // Get liquidity data for each symbol
    for (const symbol of symbols) {
      try {
        // Get protocol data for major DeFi protocols
        const protocolsResponse = await axios.get(
          `${DEFILLAMA_API_BASE}/protocols`
        );

        // Filter protocols that might have liquidity for this token
        const tokenName = symbol.toLowerCase();
        const relevantProtocols = protocolsResponse.data.filter(
          (protocol: any) => {
            const protocolName = protocol.name.toLowerCase();
            const protocolSymbol = protocol.symbol?.toLowerCase() || "";

            return (
              protocolName.includes(tokenName) ||
              protocolSymbol === tokenName ||
              // Major DEX protocols that likely have this token
              [
                "uniswap",
                "sushiswap",
                "pancakeswap",
                "curve",
                "balancer",
                "1inch",
              ].includes(protocolName) ||
              // For BTC, look for wrapped BTC protocols
              (tokenName === "btc" &&
                (protocolName.includes("wbtc") ||
                  protocolName.includes("wrapped"))) ||
              // For ETH, look for ethereum-based protocols
              (tokenName === "eth" && protocol.chains?.includes("Ethereum"))
            );
          }
        );

        // Get top DEX protocols for general liquidity reference
        const topDexProtocols = protocolsResponse.data
          .filter((protocol: any) =>
            [
              "uniswap",
              "sushiswap",
              "pancakeswap",
              "curve",
              "balancer",
            ].includes(protocol.name.toLowerCase())
          )
          .slice(0, 5);

        const allRelevantProtocols = [
          ...relevantProtocols.slice(0, 3),
          ...topDexProtocols,
        ]
          .filter(
            (protocol, index, self) =>
              self.findIndex((p) => p.id === protocol.id) === index
          )
          .slice(0, 5);

        liquidityData[symbol] = {
          liquidity_pools: allRelevantProtocols.map((protocol: any) => ({
            protocol: protocol.name,
            tvl: protocol.tvl,
            category: protocol.category,
            chains: protocol.chains,
            change_1d: protocol.change_1d,
            change_7d: protocol.change_7d,
          })),
          total_tvl: allRelevantProtocols.reduce(
            (sum: number, p: any) => sum + (p.tvl || 0),
            0
          ),
        };
      } catch (error) {
        console.error(`Error fetching liquidity for ${symbol}:`, error);
        liquidityData[symbol] = {
          error: "Failed to fetch liquidity data",
          liquidity_pools: [],
          total_tvl: 0,
        };
      }
    }

    return NextResponse.json({
      status: "success",
      data: liquidityData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching liquidity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch liquidity data" },
      { status: 500 }
    );
  }
}
