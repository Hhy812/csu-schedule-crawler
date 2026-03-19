import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Building2, Users } from 'lucide-react';

interface StatsPanelProps {
  week: number;
  day: string;
  timeSlots: string[];
  classrooms: string[];
}

interface Stats {
  total: number;
  free: number;
  occupied: number;
  freeRate: number;
}

export function StatsPanel({
  week,
  day,
  timeSlots,
  classrooms,
}: StatsPanelProps) {
  const [stats, setStats] = useState<Stats>({ total: 0, free: 0, occupied: 0, freeRate: 0 });

  useEffect(() => {
    if (classrooms.length === 0) return;

    fetch('/classroom_data.json')
      .then(res => res.json())
      .then(data => {
        let freeCount = 0;
        classrooms.forEach((classroom) => {
          const classroomData = data.classrooms[classroom];
          const isFree = timeSlots.every(slot =>
            classroomData?.schedule?.[week]?.[day]?.[slot] === 'free'
          );
          if (isFree) {
            freeCount++;
          }
        });

        setStats({
          total: classrooms.length,
          free: freeCount,
          occupied: classrooms.length - freeCount,
          freeRate: Math.round((freeCount / classrooms.length) * 100),
        });
      });
  }, [classrooms, week, day, timeSlots]);

  if (classrooms.length === 0) return null;

  return (
    <div className="bg-white border-t border-slate-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Classrooms */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">教室总数</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          {/* Free Classrooms */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-600">空闲教室</p>
                <p className="text-2xl font-bold text-emerald-700">{stats.free}</p>
              </div>
            </CardContent>
          </Card>

          {/* Occupied Classrooms */}
          <Card className="bg-rose-50 border-rose-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-rose-600">占用教室</p>
                <p className="text-2xl font-bold text-rose-700">{stats.occupied}</p>
              </div>
            </CardContent>
          </Card>

          {/* Free Rate */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-amber-600">空闲率</p>
                  <p className="text-2xl font-bold text-amber-700">{stats.freeRate}%</p>
                </div>
              </div>
              <Progress
                value={stats.freeRate}
                className="h-2 bg-amber-200"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
