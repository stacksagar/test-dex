import React from "react";
import Twitter from "@/assets/Twitter.svg";
import Telegram from "@/assets/Telegram.svg";
import Facebook from "@/assets/Facebook.svg";
import Discord from "@/assets/Discord.svg";
import Copy from "@/assets/file-copy-line.svg";

function Referral() {
  return (
    <div className="w-full bg-[#F8F9FA] py-[15px] lg:py-[21px]">
      <div className="p-4 lg:p-0 max-w-[1241px] mx-auto w-full">
        <div className=" mb-[21px] lg:mb-6">
          <h1 className="text-[#808080] font-extrabold text-xl lg:text-[2rem]">
            Hi James
          </h1>
          <p className="text-xs lg:text-xl font-extrabold font-area text-[#666666] lg:text-[#262626]">
            Referral Overview
          </p>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-[20px]">
          <div className="grid grid-cols-2 lg:grid-cols-3">
            <div className="px-4 py-2 lg:px-10 lg:py-7 space-y-2 col-span-full lg:col-span-1 border-b border-[#E5E5E5] lg:border-none">
              <h2 className="text-[#808080] text-xs lg:text-xl font-area">
                My Rewards
              </h2>
              <p className="font-extrabold text-4xl">
                500 <span className="text-2xl text-[#808080]">$HVN</span>
              </p>
            </div>
            <div className="px-4 py-2 lg:px-10 lg:py-7 space-y-2 border-x border-[#E5E5E5]">
              <h2 className="text-[#808080] text-xs lg:text-xl font-area">
                Referrals
              </h2>
              <p className="font-extrabold text-4xl">25</p>
            </div>
            <div className="px-4 py-2 lg:px-10 lg:py-7 space-y-2">
              <h2 className="text-[#808080] text-xs lg:text-xl font-area">
                Leaderboard
              </h2>
              <p className="font-extrabold text-4xl">22nd</p>
            </div>
          </div>
          <div className="px-4 py-2 lg:px-10 lg:py-7 space-y-4 lg:space-y-[24px] border-t border-[#E5E5E5]">
            <div className="lg:flex items-center justify-between">
              <h2 className="mb-4 lg:mb-0">
                Earn 10 HVN points when you refer.
              </h2>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
                <SocialIcons />
                <ReferralLink />
              </div>
            </div>
            <div className="border border-[#E5E5E5] flex flex-col lg:flex-row gap-2 justify-between lg:items-center h-[120px] lg:h-[72px] rounded-lg p-4 lg:px-[24px]">
              <p className="font-dm-sans">
                Gain 100 points when you follow @Hyperventfi on X and Verify.
              </p>
              <div className="flex items-center justify-between lg:gap-[77px]">
                <Twitter />
                <button className="text-primary">Verify</button>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <ul className="flex items-center gap-4">
            {tabs.map((item) => (
              <li key={item.id}>
                <button className="h-[48px] text-sm text-[#333333] border-b-2 border-primary">{item.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
const tabs = [
  { id: "leaderboard", label: "Leaderboard" },
  { id: "referrals", label: "Referrals" },
];
const socials = [
  {
    name: "facebook",
    url: "",
    icon: <Facebook />,
  },
  {
    name: "Twitter",
    url: "",
    icon: <Twitter />,
  },
  {
    name: "Telegram",
    url: "",
    icon: <Telegram />,
  },
  {
    name: "Discord",
    url: "",
    icon: <Discord />,
  },
];

function SocialIcons() {
  return (
    <ul className="flex items-center gap-2 lg:gap-3">
      {socials.map((item) => (
        <li key={item.name}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-[32px] w-[32px] lg:h-[48px] lg:w-[48px] bg-[#F2F2F2] rounded"
          >
            {item.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
function ReferralLink() {
  return (
    <div className="flex h-[48px] w-[390px]">
      <div className="border border-[#E5E5E5] py-1 flex items-center text-sm grow rounded-s">
        <span className="px-3">https://</span>
        <input
          defaultValue="hypervent.fi/waitlist?ref=abcd1234."
          type="text"
          disabled
          className="border-l border-[#E5E5E5] grow px-3"
        />
      </div>
      <button className="w-[48px] h-full bg-primary flex items-center justify-center rounded-e-lg">
        <span className="sr-only">Copy</span>
        <Copy />
      </button>
    </div>
  );
}

export default Referral;
