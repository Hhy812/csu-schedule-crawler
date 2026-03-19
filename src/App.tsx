import { useState, useEffect } from 'react';
import type { Building } from './types/classroom';
import { Sidebar } from './components/Sidebar';
import { FloorView } from './components/FloorView';
import { SearchBar } from './components/SearchBar';
import { StatsPanel } from './components/StatsPanel';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

function App() {
  const [buildings, setBuildings] = useState<Record<string, Building>>({});
  const [selectedBuilding, setSelectedBuilding] = useState<string>('A');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<string>('周一');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['1-2节']);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // 组件挂载时执行一次（因为依赖数组是空的 []）

    fetch('/classroom_data.json')
      // 请求服务器上的 classroom_data.json 文件

      .then(res => res.json())
      // 把响应内容解析成 JSON 对象

      .then(data => {
        setBuildings(data.buildings);  // 把楼栋数据存入状态
        setLoading(false);             // 数据加载完了，关闭 loading
      })

      .catch(err => {
        console.error('Failed to load classroom data:', err);  // 打印报错
        setLoading(false);  // 就算失败了，也要关闭 loading，不能一直转圈
      });

  }, []);  // 空数组 = 只在组件第一次渲染时执行，不重复请求

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">加载教室数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* 显示右下角消息通知 */}
      <Toaster />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          buildings={buildings}
          selectedBuilding={selectedBuilding}
          selectedFloor={selectedFloor}
          selectedWeek={selectedWeek}
          selectedDay={selectedDay}
          selectedTimeSlots={selectedTimeSlots}
          onBuildingChange={setSelectedBuilding}
          onFloorChange={setSelectedFloor}
          onWeekChange={setSelectedWeek}
          onDayChange={setSelectedDay}
          onTimeSlotsChange={setSelectedTimeSlots}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 max-h-screen overflow-hidden">
          <Sidebar
            buildings={buildings}
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            selectedWeek={selectedWeek}
            selectedDay={selectedDay}
            selectedTimeSlots={selectedTimeSlots}
            onBuildingChange={(building) => {
              setSelectedBuilding(building);
              setSidebarOpen(false);
            }}
            onFloorChange={(floor) => {
              setSelectedFloor(floor);
              setSidebarOpen(false);
            }}
            onWeekChange={setSelectedWeek}
            onDayChange={setSelectedDay}
            onTimeSlotsChange={setSelectedTimeSlots}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              <div>
                <h1 className="text-2xl font-bold text-slate-800">中南大学空闲教室查询系统</h1>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedBuilding}座 {selectedFloor}楼 | 第{selectedWeek}周 {selectedDay} {selectedTimeSlots.join('/')}
                </p>
              </div>
            </div>
            <SearchBar
              selectedWeek={selectedWeek}
              selectedDay={selectedDay}
              selectedTimeSlots={selectedTimeSlots}
            />
          </div>
        </header>

        {/* Floor Plan View */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <FloorView
              building={selectedBuilding}
              floor={selectedFloor}
              week={selectedWeek}
              day={selectedDay}
              timeSlots={selectedTimeSlots}
              classrooms={buildings[selectedBuilding]?.[selectedFloor] || []}
            />
          </div>
        </main>

        {/* Stats Panel */}
        <StatsPanel
          week={selectedWeek}
          day={selectedDay}
          timeSlots={selectedTimeSlots}
          classrooms={buildings[selectedBuilding]?.[selectedFloor] || []}
        />
      </div>
    </div>
  );
}

export default App;
