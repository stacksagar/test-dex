"use client";
import { cn } from "@/utils/tailwind";
import { useQueryState } from "nuqs";
import React from "react";

function Records() {
  const [tab, setTab] = useQueryState("tab", { defaultValue: menuItems[0].id });
  return (
    <div className="bg-gray-100 p-4 h-full">
      <div className="rounded-xl h-full w-full bg-white border-2 border-[#F2F3F4] flex flex-col">
        <div className="p-4 border-b border-[#F2F3F4]">
          <Tabs onChange={setTab} items={menuItems} activeItem={tab} />
        </div>
        {tab === "positions" && (
          <div className="min-h-[207px] flex flex-col justify-center items-center grow">
            <p className="text-[#72768F] text-sm">No positions data</p>
          </div>
        )}
        {tab === "orders" && (
          <div className="min-h-[207px] flex flex-col justify-center items-center grow">
            <p className="text-[#72768F] text-sm">No orders data</p>
          </div>
        )}
        {tab === "history" && (
          <div className="min-h-[207px] flex flex-col justify-center items-center grow">
            <p className="text-[#72768F] text-sm">No history data</p>
          </div>
        )}
      </div>
    </div>
  );
}

type MenuItem = {
  id: string;
  label: string;
  value: number | null;
};

const menuItems: MenuItem[] = [
  { id: "positions", label: "Positions", value: 0 },
  { id: "orders", label: "Orders", value: 0 },
  { id: "history", label: "History", value: null },
];

const Tabs = ({
  items,
  activeItem,
  onChange,
}: {
  items: MenuItem[];
  activeItem: string;
  onChange: (arg: string) => void;
}) => {
  return (
    <ul className="flex items-center gap-6">
      {items.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => onChange(item.id)}
            className={cn(
              "text-sm font-dm-sans text-[#72768F] flex items-center gap-1",
              {
                "text-primary": activeItem === item.id,
              }
            )}
          >
            <span> {item.label}</span>
            {typeof item.value === "number" ? <span>({item.value})</span> : ""}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Records;
