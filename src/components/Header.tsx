"use client";
import Logo from "@/assets/logo.svg";
import { cn } from "@/utils/tailwind";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ComingSoonPopup from "./ComingSoonPopup";

const links = [
  { id: "perps", path: "", name: "Perps" },
  { id: "token-factory", path: "#", name: "Token Factory" },
  {
    id: "staking-gamification",
    path: "#",
    name: "Staking & Gamification",
  },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b border-[#E5E5E5] transition-all duration-300">
      <div className="flex items-center px-[24px] lg:px-[32px] h-[64px] md:h-[80px]">
        <Logo />
        <div className="flex items-center justify-between grow">
          <ul className="hidden md:flex items-center justify-center gap-10 grow">
            {links.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={cn("hover:text-primary", {
                    "text-primary font-semibold": pathname.startsWith(
                      item.path
                    ),
                  })}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://app.hypervent.fi"
                target="_blank"
                rel="noopener noreferrer"
                className={cn("hover:text-primary")}
              >
                Referral Program
              </a>
            </li>
            <li>
              <a
                href="https://whitepaper.hypervent.fi"
                target="_blank"
                rel="noopener noreferrer"
                className={cn("hover:text-primary")}
              >
                Whitepaper
              </a>
            </li>
          </ul>
          <div className="md:hidden ml-auto">
            <button onClick={() => setIsOpen((prev: boolean) => !prev)}>
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
          <div className="hidden md:flex w-[169px]">
            <div className="border-l w-full flex justify-end">
              <button
                onClick={() => setShowComingSoon(true)}
                className="w-fit bg-primary h-[48px] rounded-xl font-semibold font-area text-[#262626] px-[14px] text-sm ml-auto hover:bg-opacity-90 transition-all duration-200"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden pb-4 space-y-2 bg-white shadow-sm fixed z-50 top-0 w-full h-screen flex flex-col">
          <div className="h-[64px] flex items-center justify-end px-[24px]">
            <button onClick={() => setIsOpen(false)}>
              <X size={32} />
            </button>
          </div>
          <div className="flex flex-col flex-1 gap-[20px] ">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "px-[24px]  transition h-[82px] hover:text-primary",
                  {
                    "text-primary font-semibold": pathname.startsWith(
                      item.path
                    ),
                  }
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://app.hypervent.fi"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "px-[24px]  transition h-[82px] hover:text-primary"
              )}
            >
              Referral Program
            </a>

            <a
              href="https://whitepaper.hypervent.fi"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "px-[24px]  transition h-[82px] hover:text-primary"
              )}
            >
              Whitepaper
            </a>
          </div>
        </div>
      )}

      {/* Coming Soon Popup */}
      <ComingSoonPopup
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </nav>
  );
}

export default Header;
