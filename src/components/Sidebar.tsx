import { Building2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DAYS, TIME_SLOTS, WEEKS } from '@/types/classroom';

interface SidebarProps {
  buildings: Record<string, { [floor: number]: string[] }>;
  selectedBuilding: string;
  selectedFloor: number;
  selectedWeek: number;
  selectedDay: string;
  selectedTimeSlot: string;
  onBuildingChange: (building: string) => void;
  onFloorChange: (floor: number) => void;
  onWeekChange: (week: number) => void;
  onDayChange: (day: string) => void;
  onTimeSlotChange: (timeSlot: string) => void;
}

export function Sidebar({
  buildings,
  selectedBuilding,
  selectedFloor,
  selectedWeek,
  selectedDay,
  selectedTimeSlot,
  onBuildingChange,
  onFloorChange,
  onWeekChange,
  onDayChange,
  onTimeSlotChange,
}: SidebarProps) {
  const buildingList = ['A', 'B', 'C', 'D'];
  const floors = buildings[selectedBuilding]
    ? Object.keys(buildings[selectedBuilding]).map(Number).sort((a, b) => a - b)
    : [];

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-lg">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">教室查询</h2>
            <p className="text-xs text-emerald-100">中南大学</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Building Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              选择教学楼
            </label>
            <div className="grid grid-cols-4 gap-2">
              {buildingList.map((building) => (
                <Button
                  key={building}
                  variant={selectedBuilding === building ? 'default' : 'outline'}
                  className={`h-12 text-lg font-bold ${selectedBuilding === building
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                    }`}
                  onClick={() => {
                    onBuildingChange(building);
                    // Reset to first available floor
                    const availableFloors = buildings[building]
                      ? Object.keys(buildings[building]).map(Number).sort((a, b) => a - b)
                      : [];
                    if (availableFloors.length > 0) {
                      onFloorChange(availableFloors[0]);
                    }
                  }}
                >
                  {building}座
                </Button>
              ))}
            </div>
          </div>

          {/* Floor Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              选择楼层
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((floor) => {
                const isAvailable = floors.includes(floor);
                return (
                  <Button
                    key={floor}
                    variant={selectedFloor === floor ? 'default' : 'outline'}
                    disabled={!isAvailable}
                    className={`h-10 ${selectedFloor === floor
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : isAvailable
                          ? 'border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    onClick={() => onFloorChange(floor)}
                  >
                    {floor}F
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Week Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              选择周数
            </label>
            <Select
              value={selectedWeek.toString()}
              onValueChange={(value) => onWeekChange(Number(value))}
            >
              <SelectTrigger className="w-full border-slate-200 focus:ring-emerald-500">
                <SelectValue placeholder="选择周数" />
              </SelectTrigger>
              <SelectContent>
                {WEEKS.map((week) => (
                  <SelectItem key={week} value={week.toString()}>
                    第{week}周
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              选择星期
            </label>
            <div className="grid grid-cols-5 gap-1">
              {DAYS.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? 'default' : 'outline'}
                  size="sm"
                  className={`text-xs ${selectedDay === day
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                    }`}
                  onClick={() => onDayChange(day)}
                >
                  {day.slice(0, 2)}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              选择节次
            </label>
            <div className="space-y-2">
              {TIME_SLOTS.map((timeSlot) => (
                <Button
                  key={timeSlot}
                  variant={selectedTimeSlot === timeSlot ? 'default' : 'outline'}
                  className={`w-full justify-start ${selectedTimeSlot === timeSlot
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                    }`}
                  onClick={() => onTimeSlotChange(timeSlot)}
                >
                  {timeSlot}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span>空闲</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-rose-500"></div>
            <span>占用</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-slate-300"></div>
            <span>无数据</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
