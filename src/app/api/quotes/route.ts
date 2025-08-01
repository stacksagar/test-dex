import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

const CMC_API_BASE = "https://pro-api.coinmarketcap.com/v1";
const CMC_API_KEY = "151d9d43-1bae-4f27-92fc-26f74a87607b";

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
    const response = await axios.get(
      `${CMC_API_BASE}/cryptocurrency/quotes/latest`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": CMC_API_KEY,
          Accept: "application/json",
          "Accept-Encoding": "deflate, gzip",
        },
        params: {
          symbol: symbols.join(","),
          convert: "USD",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch token quotes" },
      { status: 500 }
    );
  }
}
