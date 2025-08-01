import { Suspense } from "react";
import Records from "./components/Records";
import Staking from "./components/Staking";
import TradeView from "./components/TradeView";

function Perps() {
  return (
    <>
      <div className="hidden h-full lg:grid grid-cols-[317px_1fr]">
        <div className="h-full border-r border-[#E5E5E5]">
          <Staking />
        </div>
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <TradeView />
          </div>
          <div className="flex-1">
            <Records />
          </div>
        </div>
      </div>
      <div className="lg:hidden h-full overflow-x-hidden">
        <div className="flex-1">
          <TradeView />
        </div>
        <div className="">
          <Staking />
        </div>
        <div className="flex-1">
          <Records />
        </div>
      </div>
    </>
  );
}

const Page = () => {
  return (
    <Suspense>
      <Perps />
    </Suspense>
  );
};

export default Page;
