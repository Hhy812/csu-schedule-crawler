import { useState, useEffect } from 'react';
import type { Building } from './types/classroom';
import { Sidebar } from './components/Sidebar';
import { FloorView } from './components/FloorView';
import { SearchBar } from './components/SearchBar';
import { StatsPanel } from './components/StatsPanel';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [buildings, setBuildings] = useState<Record<string, Building>>({});
  const [selectedBuilding, setSelectedBuilding] = useState<string>('A');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<string>('周一');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('1-2节');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/classroom_data.json')
      .then(res => res.json())
      .then(data => {
        setBuildings(data.buildings);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load classroom data:', err);
        setLoading(false);
      });
  }, []);

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
      <Toaster />

      {/* Sidebar */}
      <Sidebar
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        selectedFloor={selectedFloor}
        selectedWeek={selectedWeek}
        selectedDay={selectedDay}
        selectedTimeSlot={selectedTimeSlot}
        onBuildingChange={setSelectedBuilding}
        onFloorChange={setSelectedFloor}
        onWeekChange={setSelectedWeek}
        onDayChange={setSelectedDay}
        onTimeSlotChange={setSelectedTimeSlot}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">中南大学空闲教室查询系统</h1>
              <p className="text-sm text-slate-500 mt-1">
                {selectedBuilding}座 {selectedFloor}楼 | 第{selectedWeek}周 {selectedDay} {selectedTimeSlot}
              </p>
            </div>
            <SearchBar
              selectedWeek={selectedWeek}
              selectedDay={selectedDay}
              selectedTimeSlot={selectedTimeSlot}
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
              timeSlot={selectedTimeSlot}
              classrooms={buildings[selectedBuilding]?.[selectedFloor] || []}
            />
          </div>
        </main>

        {/* Stats Panel */}
        <StatsPanel
          week={selectedWeek}
          day={selectedDay}
          timeSlot={selectedTimeSlot}
          classrooms={buildings[selectedBuilding]?.[selectedFloor] || []}
        />
      </div>
    </div>
  );
}

export default App;
