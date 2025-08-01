import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

const CMC_API_BASE = "https://pro-api.coinmarketcap.com/v1";
const CMC_API_KEY = "526b7195-9842-4b17-85c6-836d3242d846";

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

    // Make direct API call to CoinMarketCap
    const response = await axios.get(`${CMC_API_BASE}/cryptocurrency/info`, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
        Accept: "application/json",
        "Accept-Encoding": "deflate, gzip",
      },
      params: {
        symbol: symbols.join(","),
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch token metadata" },
      { status: 500 }
    );
  }
}
