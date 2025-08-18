import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";

interface StatusTabsProps<T extends string> {
  activeTab: T;
  setActiveTab: (tab: T) => void;
  tabs: readonly T[];
  children: React.ReactNode;
}

export const StatusTabs = <T extends string>({
  activeTab,
  setActiveTab,
  tabs,
  children,
}: StatusTabsProps<T>) => (
  <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as T)}>
    <div className="bg-muted mb-6 w-full rounded-lg">
      <TabsList className="flex h-auto w-full flex-wrap gap-2 rounded-lg">
        {tabs.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className="flex-none px-4 py-2 text-center font-semibold whitespace-nowrap md:text-lg"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>

    <TabsContent value={activeTab}>
      <div className="pt-2">{children}</div>
    </TabsContent>
  </Tabs>
);
