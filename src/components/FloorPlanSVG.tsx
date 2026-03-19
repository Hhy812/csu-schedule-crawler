import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { NorthBuildingPlan } from './NorthBuildingPlan';
import { SouthBuildingPlan } from './SouthBuildingPlan';
interface FloorPlanSVGProps {
  building: string;
  floor: number;
  statuses: Record<string, 'free' | 'occupied' | 'unknown'>;
}

// 绝对坐标定义 - 直接从图纸读取或CAD导出
interface RoomRect {
  id: string;      // 教室编号
  x: number;       // 左上角X
  y: number;       // 左上角Y  
  w: number;       // 宽度
  h: number;       // 高度
  rotate?: number; // 可选：旋转角度（如走廊斜向房间）
}


// A座1楼真实坐标（基于你的照片估算，单位：像素）
const A_FLOOR_ABSOLUTE: Record<number, RoomRect[]> = {
  1: [
    { id: 'A103', x: 50, y: 60, w: 60, h: 45 },
    { id: 'A102', x: 50, y: 110, w: 60, h: 45 },
    { id: 'A101', x: 30, y: 160, w: 80, h: 45 },
    { id: 'A104', x: 130, y: 170, w: 90, h: 50 },
    { id: 'A106', x: 230, y: 170, w: 70, h: 50 },

    { id: 'A108', x: 520, y: 170, w: 70, h: 50 },
    { id: 'A124', x: 130, y: 60, w: 70, h: 50 },
    { id: 'A123', x: 200, y: 60, w: 70, h: 50 },
    { id: 'A122', x: 300, y: 60, w: 70, h: 50 },

    { id: 'A119', x: 510, y: 60, w: 100, h: 50 },


    { id: 'A117', x: 650, y: 60, w: 70, h: 50 },
    { id: 'A115', x: 720, y: 60, w: 70, h: 50 },
    { id: 'A114', x: 790, y: 60, w: 70, h: 50 },
    { id: 'A113', x: 860, y: 60, w: 70, h: 50 },
    { id: 'A110', x: 720, y: 180, w: 100, h: 45 },
    { id: 'A112', x: 865, y: 130, w: 75, h: 45 },
    { id: 'A111', x: 865, y: 185, w: 75, h: 45 },
  ],
  2: [
    { id: 'A203', x: 50, y: 60, w: 60, h: 45 },
    { id: 'A202', x: 50, y: 110, w: 60, h: 45 },
    { id: 'A201', x: 30, y: 160, w: 80, h: 45 },
    { id: 'A204', x: 130, y: 170, w: 90, h: 50 },
    { id: 'A206', x: 230, y: 170, w: 70, h: 50 },
    { id: 'A207', x: 310, y: 170, w: 70, h: 50 },
    { id: 'A208', x: 520, y: 170, w: 70, h: 50 },
    { id: 'A224', x: 130, y: 60, w: 70, h: 50 },
    { id: 'A223', x: 200, y: 60, w: 70, h: 50 },
    { id: 'A222', x: 300, y: 60, w: 70, h: 50 },
    { id: 'A221', x: 370, y: 60, w: 70, h: 50 },
    { id: 'A220', x: 440, y: 60, w: 70, h: 50 },
    { id: 'A219', x: 510, y: 60, w: 70, h: 50 },
    { id: 'A218', x: 580, y: 60, w: 70, h: 50 },

    { id: 'A217', x: 650, y: 60, w: 70, h: 50 },
    { id: 'A215', x: 720, y: 60, w: 70, h: 50 },
    { id: 'A214', x: 790, y: 60, w: 70, h: 50 },
    { id: 'A213', x: 860, y: 60, w: 70, h: 50 },
    { id: 'A210', x: 720, y: 180, w: 100, h: 45 },
    { id: 'A212', x: 865, y: 130, w: 75, h: 45 },
    { id: 'A211', x: 865, y: 185, w: 75, h: 45 },
  ],
  3: [
    { id: 'A303', x: 50, y: 60, w: 60, h: 45 },
    { id: 'A302', x: 50, y: 110, w: 60, h: 45 },
    { id: 'A301', x: 30, y: 160, w: 80, h: 45 },
    { id: 'A304', x: 130, y: 170, w: 90, h: 50 },
    { id: 'A306', x: 230, y: 170, w: 70, h: 50 },
    { id: 'A307', x: 310, y: 170, w: 70, h: 50 },
    { id: 'A308', x: 520, y: 170, w: 70, h: 50 },
    { id: 'A324', x: 130, y: 60, w: 70, h: 50 },
    { id: 'A323', x: 200, y: 60, w: 70, h: 50 },
    { id: 'A322', x: 300, y: 60, w: 70, h: 50 },
    { id: 'A321', x: 370, y: 60, w: 70, h: 50 },
    { id: 'A320', x: 440, y: 60, w: 70, h: 50 },
    { id: 'A319', x: 510, y: 60, w: 70, h: 50 },
    { id: 'A318', x: 580, y: 60, w: 70, h: 50 },

    { id: 'A317', x: 650, y: 60, w: 70, h: 50 },
    { id: 'A315', x: 720, y: 60, w: 70, h: 50 },
    { id: 'A314', x: 790, y: 60, w: 70, h: 50 },
    { id: 'A313', x: 860, y: 60, w: 70, h: 50 },
    { id: 'A310', x: 720, y: 180, w: 100, h: 45 },
    { id: 'A312', x: 865, y: 130, w: 75, h: 45 },
    { id: 'A311', x: 865, y: 185, w: 75, h: 45 },
  ],
  4: [
    { id: 'A403', x: 50, y: 60, w: 60, h: 45 },
    { id: 'A402', x: 50, y: 110, w: 60, h: 45 },
    { id: 'A401', x: 30, y: 160, w: 80, h: 45 },
    { id: 'A404', x: 130, y: 170, w: 90, h: 50 },
    { id: 'A406', x: 230, y: 170, w: 70, h: 50 },
    { id: 'A407', x: 310, y: 170, w: 70, h: 50 },
    { id: 'A408', x: 520, y: 170, w: 70, h: 50 },
    { id: 'A423', x: 130, y: 60, w: 70, h: 50 },
    { id: 'A422', x: 210, y: 60, w: 70, h: 50 },
    // 4楼南侧中间有展示区，教室较少
    { id: 'A417', x: 550, y: 60, w: 70, h: 50 },
    { id: 'A415', x: 680, y: 60, w: 70, h: 50 },
    { id: 'A414', x: 760, y: 60, w: 70, h: 50 },
    { id: 'A413', x: 840, y: 60, w: 70, h: 50 },
    { id: 'A410', x: 670, y: 180, w: 100, h: 45 },
    { id: 'A412', x: 865, y: 130, w: 75, h: 45 },
    { id: 'A411', x: 865, y: 185, w: 75, h: 45 },
  ]
};

// =============================================================================
// B座数据 - 多庭院布局（北楼B区）
// 基于图片估算坐标，可根据实际CAD调整
// =============================================================================
const B_FLOOR_ABSOLUTE: Record<number, RoomRect[]> = {
  1: [

    { id: 'B118', x: 220, y: 50, w: 105, h: 40 },
    { id: 'B117', x: 330, y: 50, w: 105, h: 40 },  // 可改为实际编号如 B101 如果位置对应

    { id: 'B101', x: 180, y: 185, w: 65, h: 40 },
    { id: 'B102', x: 270, y: 185, w: 65, h: 40 },
    { id: 'B103', x: 350, y: 185, w: 65, h: 40 },

    { id: 'B114', x: 510, y: 50, w: 80, h: 40 },
    { id: 'B113', x: 595, y: 50, w: 80, h: 40 },
    { id: 'B112', x: 670, y: 50, w: 80, h: 40 },
    { id: 'B111', x: 785, y: 50, w: 80, h: 40 },
    { id: 'B110', x: 870, y: 50, w: 80, h: 40 },


    { id: 'B105', x: 590, y: 185, w: 60, h: 40 },
    { id: 'B106', x: 650, y: 185, w: 60, h: 40 },
    { id: 'B107', x: 710, y: 185, w: 60, h: 40 },
    { id: 'B108', x: 810, y: 185, w: 65, h: 40 },
  ],

  2: [
    { id: 'B219', x: 100, y: 50, w: 105, h: 40 },
    { id: 'B218', x: 220, y: 50, w: 105, h: 40 },
    { id: 'B217', x: 330, y: 50, w: 105, h: 40 },  // 可改为实际编号如 B101 如果位置对应

    { id: 'B202', x: 180, y: 185, w: 65, h: 40 },
    { id: 'B203', x: 270, y: 185, w: 65, h: 40 },


    { id: 'B214', x: 510, y: 50, w: 80, h: 40 },
    { id: 'B213', x: 595, y: 50, w: 80, h: 40 },
    { id: 'B212', x: 670, y: 50, w: 80, h: 40 },
    { id: 'B211', x: 785, y: 50, w: 80, h: 40 },
    { id: 'B210', x: 870, y: 50, w: 80, h: 40 },


    { id: 'B205', x: 590, y: 185, w: 60, h: 40 },
    { id: 'B206', x: 650, y: 185, w: 60, h: 40 },
    { id: 'B207', x: 710, y: 185, w: 60, h: 40 },
    { id: 'B208', x: 810, y: 185, w: 65, h: 40 },
  ],
  3: [
    { id: 'B320', x: 100, y: 50, w: 105, h: 40 }, { id: 'B319', x: 220, y: 50, w: 105, h: 40 }, { id: 'B318', x: 330, y: 50, w: 105, h: 40 },

    { id: 'B301', x: 180, y: 185, w: 65, h: 40 }, { id: 'B302', x: 270, y: 185, w: 65, h: 40 }, { id: 'B303', x: 350, y: 185, w: 65, h: 40 },

    { id: 'B315', x: 510, y: 50, w: 80, h: 40 }, { id: 'B314', x: 595, y: 50, w: 80, h: 40 },
    { id: 'B313', x: 670, y: 50, w: 80, h: 40 }, { id: 'B312', x: 785, y: 50, w: 80, h: 40 }, { id: 'B311', x: 870, y: 50, w: 80, h: 40 },

    { id: 'B304', x: 460, y: 185, w: 60, h: 60 },
    { id: 'B305', x: 530, y: 185, w: 60, h: 40 },
    { id: 'B306', x: 590, y: 185, w: 60, h: 40 }, { id: 'B307', x: 650, y: 185, w: 60, h: 40 }, { id: 'B308', x: 710, y: 185, w: 60, h: 40 },
    { id: 'B309', x: 810, y: 185, w: 65, h: 40 },
  ],
  4: [
    // 北侧横排（西→东）
    { id: 'B420', x: 100, y: 50, w: 105, h: 40 },
    { id: 'B419', x: 220, y: 50, w: 105, h: 40 },
    { id: 'B418', x: 330, y: 50, w: 105, h: 40 },

    // 西南侧
    { id: 'B401', x: 180, y: 185, w: 65, h: 40 },
    { id: 'B402', x: 270, y: 185, w: 65, h: 40 },
    { id: 'B403', x: 350, y: 185, w: 65, h: 40 },

    // 中北侧
    { id: 'B415', x: 510, y: 50, w: 80, h: 40 },
    { id: 'B414', x: 595, y: 50, w: 80, h: 40 },
    { id: 'B413', x: 670, y: 50, w: 80, h: 40 },
    { id: 'B412', x: 785, y: 50, w: 80, h: 40 },
    { id: 'B411', x: 870, y: 50, w: 80, h: 40 },

    // 中南侧+东南
    { id: 'B404', x: 460, y: 185, w: 60, h: 60 },
    { id: 'B405', x: 530, y: 185, w: 60, h: 40 },
    { id: 'B406', x: 590, y: 185, w: 60, h: 40 },
    { id: 'B407', x: 650, y: 185, w: 60, h: 40 },
    { id: 'B408', x: 710, y: 185, w: 60, h: 40 },
    { id: 'B409', x: 810, y: 185, w: 65, h: 40 },
  ],
  5: [
    { id: 'B519', x: 100, y: 50, w: 105, h: 40 },
    { id: 'B518', x: 220, y: 50, w: 105, h: 40 },
    { id: 'B517', x: 330, y: 50, w: 105, h: 40 },

    { id: 'B501', x: 180, y: 185, w: 65, h: 40 },
    { id: 'B502', x: 270, y: 185, w: 65, h: 40 },
    { id: 'B503', x: 350, y: 185, w: 65, h: 40 },

    { id: 'B514', x: 510, y: 50, w: 80, h: 40 },
    { id: 'B513', x: 595, y: 50, w: 80, h: 40 },
    { id: 'B512', x: 670, y: 50, w: 80, h: 40 },
    { id: 'B511', x: 785, y: 50, w: 80, h: 40 },
    { id: 'B510', x: 870, y: 50, w: 80, h: 40 },

    //
    { id: 'B504', x: 530, y: 185, w: 60, h: 40 },
    { id: 'B505', x: 590, y: 185, w: 60, h: 40 },
    { id: 'B506', x: 650, y: 185, w: 60, h: 40 },
    { id: 'B507', x: 710, y: 185, w: 60, h: 40 },
    { id: 'B508', x: 810, y: 185, w: 65, h: 40 },
  ],
};
// C座数据 - 对称布局，中间圆形中庭（楼梯间）
const C_FLOOR_ABSOLUTE: Record<number, RoomRect[]> = {
  1: [
    // 西侧（左）：102-105（101/106为功能房不绘制）
    { id: 'C102', x: 120, y: 100, w: 80, h: 55 },
    { id: 'C103', x: 205, y: 100, w: 80, h: 55 },
    { id: 'C104', x: 290, y: 100, w: 80, h: 55 },
    { id: 'C105', x: 375, y: 100, w: 80, h: 55 },

    // 东侧（右）：108-112（107配电间/110小房间/113教休室不绘制）
    { id: 'C108', x: 620, y: 100, w: 80, h: 55 },
    { id: 'C109', x: 705, y: 100, w: 80, h: 55 },
    { id: 'C111', x: 790, y: 100, w: 80, h: 55 }, // 跳过110
    { id: 'C112', x: 875, y: 100, w: 80, h: 55 },
  ],
  2: [
    // 西侧：202-205（201/211教休室不绘制）
    { id: 'C202', x: 120, y: 100, w: 80, h: 55 },
    { id: 'C203', x: 205, y: 100, w: 80, h: 55 },
    { id: 'C204', x: 290, y: 100, w: 80, h: 55 },
    { id: 'C205', x: 375, y: 100, w: 80, h: 55 },

    // 东侧：206-210（208小房间不绘制）
    { id: 'C206', x: 620, y: 100, w: 80, h: 55 },
    { id: 'C207', x: 705, y: 100, w: 80, h: 55 },
    { id: 'C209', x: 790, y: 100, w: 80, h: 55 }, // 跳过208
    { id: 'C210', x: 875, y: 100, w: 80, h: 55 },
  ],
  3: [
    // 西侧：302-304（301教休室/305控制室/306保密室不绘制）
    { id: 'C302', x: 140, y: 100, w: 85, h: 55 },
    { id: 'C303', x: 230, y: 100, w: 85, h: 55 },
    { id: 'C304', x: 320, y: 100, w: 85, h: 55 },

    // 东侧：307-311（309小房间不绘制，右侧312是功能房）
    { id: 'C307', x: 620, y: 100, w: 80, h: 55 },
    { id: 'C308', x: 705, y: 100, w: 80, h: 55 },
    { id: 'C310', x: 790, y: 100, w: 80, h: 55 }, // 跳过309
    { id: 'C311', x: 875, y: 100, w: 80, h: 55 },
  ],
  4: [
    // 西侧：401-404（带阳台，尺寸稍大）
    { id: 'C401', x: 120, y: 95, w: 85, h: 60 },
    { id: 'C402', x: 210, y: 95, w: 85, h: 60 },
    { id: 'C403', x: 300, y: 95, w: 85, h: 60 },
    { id: 'C404', x: 390, y: 95, w: 85, h: 60 },

    // 东侧：407-411（409小房间/阳台不绘制）
    { id: 'C407', x: 620, y: 95, w: 85, h: 60 },
    { id: 'C408', x: 710, y: 95, w: 85, h: 60 },
    { id: 'C410', x: 800, y: 95, w: 85, h: 60 }, // 跳过409
    { id: 'C411', x: 890, y: 95, w: 85, h: 60 },
  ],
  5: [
    // 西侧：501-504（505教休室不绘制）
    { id: 'C501', x: 120, y: 100, w: 80, h: 55 },
    { id: 'C502', x: 205, y: 100, w: 80, h: 55 },
    { id: 'C503', x: 290, y: 100, w: 80, h: 55 },
    { id: 'C504', x: 375, y: 100, w: 80, h: 55 },

    // 东侧：507-511（509小房间/506教休室不绘制）
    { id: 'C507', x: 620, y: 100, w: 80, h: 55 },
    { id: 'C508', x: 705, y: 100, w: 80, h: 55 },
    { id: 'C510', x: 790, y: 100, w: 80, h: 55 }, // 跳过509
    { id: 'C511', x: 875, y: 100, w: 80, h: 55 },
  ]
};


export function FloorPlanSVG({ building, floor, statuses }: FloorPlanSVGProps) {
  // 新增北楼/南楼分支
  if (building === '科教北') {
    return <NorthBuildingPlan floor={floor} statuses={statuses} />;
  }
  if (building === '科教南') {
    return <SouthBuildingPlan floor={floor} statuses={statuses} />;
  }


  // 选择数据源
  const rooms = building === 'A' ? A_FLOOR_ABSOLUTE[floor] :
    building === 'B' ? B_FLOOR_ABSOLUTE[floor] :
      building === 'C' ? C_FLOOR_ABSOLUTE[floor] :
        null;

  if (!rooms) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
        暂无 {building}座 {floor}楼 数据
      </div>
    );
  }

  const handleClick = (room: string) => {
    const s = statuses[room];
    if (s === 'free') toast.success(`${room} 空闲`);
    else if (s === 'occupied') toast.error(`${room} 占用`);
    else toast.info(`${room} 状态未知`);
  };

  // 根据建筑类型调整viewBox
  const viewBox = building === 'B' ? "0 0 960 280" : "0 0 960 280";

  return (
    <svg
      viewBox={viewBox}
      className="w-full h-full bg-slate-50 rounded-lg border border-slate-200"
    >
      <text x="480" y="25" textAnchor="middle" className="fill-slate-800 text-lg font-bold">
        {building}座 {floor}楼 平面图
      </text>

      {/* 方向标记 */}
      <text x="30" y="120" className="fill-slate-400 text-xs font-bold">西</text>
      <text x="930" y="120" className="fill-slate-400 text-xs font-bold">东</text>
      <text x="480" y="50" textAnchor="middle" className="fill-slate-400 text-xs font-bold">北</text>
      <text x="480" y="240" textAnchor="middle" className="fill-slate-400 text-xs font-bold">南</text>

      {/* 绘制所有教室 */}
      {rooms.map((room) => {
        const isFree = statuses[room.id] === 'free';
        const isOcc = statuses[room.id] === 'occupied';

        return (
          <g key={room.id} transform={`translate(${room.x}, ${room.y})`} onClick={() => handleClick(room.id)} style={{ cursor: 'pointer' }}>
            <rect
              width={room.w} height={room.h} rx="4"
              className={`${isFree ? 'fill-emerald-500' : isOcc ? 'fill-rose-500' : 'fill-slate-400'} hover:opacity-80 transition-opacity`}
              stroke="white" strokeWidth="2"
            />
            <text x={room.w / 2} y={room.h / 2 + 4} textAnchor="middle" className="fill-white text-xs font-bold">{room.id}</text>
            <g transform={`translate(${room.w / 2 - 8}, 5)`}>
              {isFree && <CheckCircle2 size={16} className="text-white" />}
              {isOcc && <XCircle size={16} className="text-white" />}
            </g>
          </g>
        );
      })}

      {/* 图例 */}
      <g transform="translate(50, 255)">
        <rect width="14" height="14" className="fill-emerald-500" rx="2" />
        <text x="22" y="11" className="fill-slate-600 text-xs">空闲</text>
        <rect x="70" width="14" height="14" className="fill-rose-500" rx="2" />
        <text x="92" y="11" className="fill-slate-600 text-xs">占用</text>
      </g>
    </svg>
  );
}

