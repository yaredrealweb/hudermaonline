import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppointmentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AppointmentTabs({
  activeTab,
  onTabChange,
}: AppointmentTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 grid grid-cols-4">
        <TabsTrigger
          value="PENDING"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Pending
        </TabsTrigger>
        <TabsTrigger
          value="CONFIRMED"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Upcoming
        </TabsTrigger>
        <TabsTrigger
          value="COMPLETED"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Completed
        </TabsTrigger>
        <TabsTrigger
          value="CANCELED"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Cancelled
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
