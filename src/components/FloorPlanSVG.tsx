import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

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

    { id: 'B503', x: 180, y: 185, w: 65, h: 40 },
    { id: 'B502', x: 270, y: 185, w: 65, h: 40 },
    { id: 'B501', x: 350, y: 185, w: 65, h: 40 },

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
    <svg viewBox={viewBox} className="w-full bg-slate-50 rounded-lg border border-slate-200">
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

// 每座建筑的独特布局配置
// const BUILDING_LAYOUTS: Record<string, {
//   shape: 'linear' | 'u-shape' | 'l-shape' | 'compact';
//   description: string;
// }> = {
//   'A': { shape: 'linear', description: '长条形双走廊' },      // A座：标准长条，双楼梯
//   'B': { shape: 'u-shape', description: 'U型中庭式' },        // B座：U型围合，中间天井
//   'C': { shape: 'l-shape', description: 'L型转角' },          // C座：L型，较小
//   'D': { shape: 'compact', description: '紧凑单翼' },         // D座：单排，阶梯教室为主
// };

// export function FloorPlanSVG({ building, floor, statuses }: FloorPlanSVGProps) {
//   // 根据建筑类型分发到不同的渲染函数
//   switch (building) {
//     case 'A':
//       return <BuildingAPlan floor={floor} statuses={statuses} />;
//     case 'B':
//       return <BuildingBPlan floor={floor} statuses={statuses} />;
//     case 'C':
//       return <BuildingCPlan floor={floor} statuses={statuses} />;
//     case 'D':
//       return <BuildingDPlan floor={floor} statuses={statuses} />;
//     default:
//       return <div>未知建筑</div>;
//   }
// }


// ========== 通用教室方块组件 ==========


// =============================================================================
// 2. 主组件
// =============================================================================
// export function FloorPlanSVG({ building, floor, statuses }: FloorPlanSVGProps) {
//   const plan = FLOOR_PLANS[building]?.[floor];

//   if (!plan) {
//     return (
//       <div className="flex items-center justify-center h-64 text-slate-400">
//         暂无 {building}座 {floor}楼 的平面图数据
//       </div>
//     );
//   }

//   const handleClassroomClick = (classroom: string) => {
//     const status = statuses[classroom];
//     if (status === 'free') {
//       toast.success(`${classroom} 教室空闲`);
//     } else if (status === 'occupied') {
//       toast.error(`${classroom} 教室占用`);
//     } else {
//       toast.info(`${classroom} 状态未知`);
//     }
//   };

//   // 渲染教室方块
//   const renderRoom = (room: string, x: number, y: number, w: number, h: number) => {
//     if (!room) return null;
//     const isFree = statuses[room] === 'free';
//     const isUnknown = !statuses[room] || statuses[room] === 'unknown';

//     return (
//       <g
//         key={room}
//         transform={`translate(${x}, ${y})`}
//         onClick={() => handleClassroomClick(room)}
//         style={{ cursor: 'pointer' }}
//       >
//         <rect
//           width={w}
//           height={h}
//           rx="4"
//           className={`transition-all duration-200 hover:opacity-80 ${isFree ? 'fill-emerald-500' : isUnknown ? 'fill-slate-400' : 'fill-rose-500'
//             }`}
//           stroke="white"
//           strokeWidth="2"
//         />
//         <text
//           x={w / 2}
//           y={h / 2 + 4}
//           textAnchor="middle"
//           className="fill-white font-bold text-xs pointer-events-none"
//         >
//           {room}
//         </text>
//       </g>
//     );
//   };

//   // =============================================================================
//   // 3. 根据布局类型渲染
//   // =============================================================================
//   switch (plan.layout) {
//     case 'linear':
//       return (
//         <svg viewBox="0 0 900 350" className="w-full h-auto">
//           <text x="450" y="25" textAnchor="middle" className="fill-slate-700 text-lg font-bold">
//             {building}座 {floor}楼 平面图
//           </text>

//           {/* 建筑外框 */}
//           <rect x="50" y="40" width="800" height="250" fill="none" stroke="#cbd5e1" strokeWidth="2" rx="8" />

//           {/* 北侧教室 */}
//           <g transform="translate(70, 50)">
//             <text x="-30" y="30" className="fill-slate-500 text-xs font-bold">北</text>
//             {plan.zones.north?.map((room, i) => {
//               const maxRooms = plan.zones.north?.length || 1;
//               const width = 720 / maxRooms - 10;
//               return renderRoom(room, i * (width + 10), 0, width, 60);
//             })}
//           </g>

//           {/* 走廊 */}
//           <rect x="50" y="120" width="800" height="40" className="fill-slate-100" opacity="0.5" />
//           <text x="450" y="145" textAnchor="middle" className="fill-slate-400 text-xs">走廊</text>

//           {/* 南侧教室 */}
//           <g transform="translate(70, 170)">
//             <text x="-30" y="30" className="fill-slate-500 text-xs font-bold">南</text>
//             {plan.zones.south?.map((room, i) => {
//               const maxRooms = plan.zones.south?.length || 1;
//               const width = 720 / maxRooms - 10;
//               return renderRoom(room, i * (width + 10), 0, width, 60);
//             })}
//           </g>

//           {/* 楼梯 */}
//           {plan.stairs.map((s, i) => (
//             <g key={i} transform={`translate(${s.x * 8}, ${s.y * 3.2})`}>
//               <rect width="40" height="30" className="fill-slate-400" rx="2" />
//               <text x="20" y="20" textAnchor="middle" className="fill-white text-xs">{s.label || '楼梯'}</text>
//             </g>
//           ))}

//           {/* 入口 */}
//           <g transform="translate(420, 270)">
//             <polygon points="0,0 30,0 15,15" className="fill-slate-400" />
//             <text x="15" y="28" textAnchor="middle" className="fill-slate-500 text-xs">入口</text>
//           </g>
//         </svg>
//       );

//     case 'u-shape':
//       return (
//         <svg viewBox="0 0 900 400" className="w-full h-auto">
//           <text x="450" y="25" textAnchor="middle" className="fill-slate-700 text-lg font-bold">
//             {building}座 {floor}楼 (U型布局)
//           </text>

//           {/* U型外框 */}
//           <path
//             d="M 150 80 L 150 280 L 750 280 L 750 80 L 650 80 L 650 200 L 250 200 L 250 80 Z"
//             fill="#f8fafc"
//             stroke="#cbd5e1"
//             strokeWidth="2"
//           />

//           {/* 中庭 */}
//           <rect x="270" y="100" width="360" height="160" fill="#f1f5f9" stroke="#e2e8f0" strokeDasharray="4" />
//           <text x="450" y="185" textAnchor="middle" className="fill-slate-400 text-sm">中庭</text>

//           {/* 北侧（U顶） */}
//           <g transform="translate(260, 90)">
//             {plan.zones.north?.map((room, i) => {
//               const width = 380 / (plan.zones.north?.length || 1) - 5;
//               return renderRoom(room, i * (width + 5), 0, width, 50);
//             })}
//           </g>

//           {/* 西侧（U左） */}
//           <g transform="translate(160, 110)">
//             {plan.zones.west?.map((room, i) => {
//               const rooms = plan.zones.west?.length || 1;
//               const height = 160 / rooms - 5;
//               return renderRoom(room, 0, i * (height + 5), 80, height);
//             })}
//           </g>

//           {/* 东侧（U右） */}
//           <g transform="translate(660, 110)">
//             {plan.zones.east?.map((room, i) => {
//               const rooms = plan.zones.east?.length || 1;
//               const height = 160 / rooms - 5;
//               return renderRoom(room, 0, i * (height + 5), 80, height);
//             })}
//           </g>

//           {/* 楼梯 */}
//           {plan.stairs.map((s, i) => (
//             <g key={i} transform={`translate(${s.x * 8}, ${s.y * 3.8})`}>
//               <rect width="35" height="30" className="fill-slate-400" rx="2" />
//               <text x="17" y="20" textAnchor="middle" className="fill-white text-xs">{s.label}</text>
//             </g>
//           ))}
//         </svg>
//       );

//     case 'l-shape':
//       return (
//         <svg viewBox="0 0 600 450" className="w-full h-auto">
//           <text x="300" y="25" textAnchor="middle" className="fill-slate-700 text-lg font-bold">
//             {building}座 {floor}楼 (L型布局)
//           </text>

//           {/* L型外框 */}
//           <path
//             d="M 80 60 L 250 60 L 250 200 L 520 200 L 520 400 L 80 400 Z"
//             fill="#f8fafc"
//             stroke="#cbd5e1"
//             strokeWidth="2"
//           />

//           {/* 走廊 */}
//           <path d="M 260 70 L 260 190 L 510 190 L 510 390 L 90 390 L 90 70 Z" fill="#f1f5f9" />

//           {/* 北侧短边 */}
//           <g transform="translate(100, 70)">
//             {plan.zones.north?.map((room, i) => {
//               const width = 140 / (plan.zones.north?.length || 1) - 5;
//               return renderRoom(room, i * (width + 5), 0, width, 50);
//             })}
//           </g>

//           {/* 东侧长边 */}
//           <g transform="translate(360, 210)">
//             {plan.zones.east?.map((room, i) => {
//               const height = 180 / (plan.zones.east?.length || 1) - 5;
//               return renderRoom(room, 0, i * (height + 5), 140, height);
//             })}
//           </g>

//           {/* 转角楼梯 */}
//           <g transform="translate(280, 140)">
//             <circle cx="20" cy="20" r="18" className="fill-slate-400" />
//             <text x="20" y="25" textAnchor="middle" className="fill-white text-xs">楼梯</text>
//           </g>

//           {/* 楼梯标记 */}
//           {plan.stairs.map((s, i) => (
//             <g key={i} transform={`translate(${s.x * 5.5}, ${s.y * 4.5})`}>
//               <rect width="30" height="25" className="fill-slate-400" opacity="0.5" rx="2" />
//             </g>
//           ))}
//         </svg>
//       );

//     case 'compact':
//       return (
//         <svg viewBox="0 0 700 350" className="w-full h-auto">
//           <text x="350" y="25" textAnchor="middle" className="fill-slate-700 text-lg font-bold">
//             {building}座 {floor}楼 (紧凑布局)
//           </text>

//           {/* 外框 */}
//           <rect x="100" y="50" width="500" height="250" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="4" />

//           {/* 纵向走廊 */}
//           <rect x="320" y="60" width="60" height="230" fill="#f1f5f9" />

//           {/* 西侧 */}
//           <g transform="translate(120, 70)">
//             {plan.zones.west?.map((room, i) => {
//               const rooms = plan.zones.west?.length || 1;
//               const height = 200 / rooms - 8;
//               return renderRoom(room, 0, i * (height + 8), 180, height);
//             })}
//           </g>

//           {/* 东侧 */}
//           <g transform="translate(400, 70)">
//             {plan.zones.east?.map((room, i) => {
//               const rooms = plan.zones.east?.length || 1;
//               const height = 200 / rooms - 8;
//               return renderRoom(room, 0, i * (height + 8), 180, height);
//             })}
//           </g>

//           {/* 中间竖向标识 */}
//           <text x="350" y="180" textAnchor="middle" className="fill-slate-400 text-xs writing-vertical">走廊</text>

//           {/* 楼梯 */}
//           {plan.stairs.map((s, i) => (
//             <g key={i} transform={`translate(${s.x * 6.8}, ${s.y * 3.4})`}>
//               <rect width="35" height="30" className="fill-slate-400" rx="2" />
//               <text x="17" y="20" textAnchor="middle" className="fill-white text-xs">楼梯</text>
//             </g>
//           ))}

//           {/* 入口 */}
//           <g transform="translate(335, 290)">
//             <rect width="30" height="15" className="fill-slate-400" rx="2" />
//             <text x="15" y="28" textAnchor="middle" className="fill-slate-500 text-xs">入口</text>
//           </g>
//         </svg>
//       );

//     default:
//       return <div className="text-red-500">未知布局类型</div>;
//   }
// }

// 中南大学教学楼平面图布局定义
// 基于实际教学楼结构：中间走廊，两侧教室
// const FLOOR_PLANS: Record<string, Record<number, {
//   northWing: string[];
//   southWing: string[];
//   stairs: { x: number; y: number }[];
//   elevators: { x: number; y: number }[];
//   restrooms: { x: number; y: number }[];
// }>> = {
//   'A': {
//     1: {
//       // A座1楼：北侧8间，南侧8间
//       northWing: ['A101', 'A102', 'A103', 'A104', 'A108', 'A110', 'A111', 'A112'],
//       southWing: ['A113', 'A114', 'A115', 'A117', 'A119', 'A122', 'A123', 'A124'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     },
//     2: {
//       northWing: ['A201', 'A202', 'A203', 'A204', 'A206', 'A207', 'A208', 'A210'],
//       southWing: ['A211', 'A212', 'A213', 'A214', 'A215', 'A217', 'A219', 'A220', 'A221', 'A222', 'A223', 'A224'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     },
//     3: {
//       northWing: ['A301', 'A302', 'A303', 'A304', 'A308', 'A310', 'A311', 'A312'],
//       southWing: ['A313', 'A314', 'A315', 'A317', 'A318', 'A319', 'A320', 'A321', 'A322', 'A323', 'A324'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     },
//     4: {
//       northWing: ['A401', 'A404', 'A410', 'A411', 'A412', 'A413', 'A414', 'A415'],
//       southWing: ['A417', 'A419', 'A420', 'A421'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     }
//   },
//   'B': {
//     1: {
//       northWing: ['B101', 'B102', 'B103', 'B105', 'B106', 'B107', 'B108', 'B110'],
//       southWing: ['B111', 'B112', 'B113', 'B114', 'B117', 'B118'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     },
//     2: {
//       northWing: ['B201', 'B202', 'B203', 'B205', 'B206', 'B207', 'B208', 'B210'],
//       southWing: ['B211', 'B212', 'B213', 'B214', 'B217', 'B218', 'B219'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     },
//     3: {
//       northWing: ['B301', 'B302', 'B303', 'B304', 'B305', 'B306', 'B307', 'B308'],
//       southWing: ['B309', 'B311', 'B312', 'B313', 'B314', 'B319', 'B320'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     },
//     4: {
//       northWing: ['B401', 'B402', 'B403', 'B404', 'B405', 'B406', 'B407', 'B408'],
//       southWing: ['B409', 'B411', 'B412', 'B413', 'B414', 'B415', 'B418', 'B419', 'B420'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     },
//     5: {
//       northWing: ['B501', 'B502', 'B503', 'B504', 'B505', 'B506', 'B507', 'B508'],
//       southWing: ['B510', 'B511', 'B512', 'B513', 'B514', 'B517', 'B518', 'B519'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     }
//   },
//   'C': {
//     1: {
//       northWing: ['C103', 'C104', 'C105'],
//       southWing: ['C108', 'C109', 'C111', 'C112'],
//       stairs: [{ x: 25, y: 45 }, { x: 75, y: 45 }],
//       elevators: [{ x: 30, y: 55 }],
//       restrooms: [{ x: 70, y: 55 }]
//     },
//     2: {
//       northWing: ['C203', 'C204', 'C205'],
//       southWing: ['C206', 'C207', 'C209', 'C210'],
//       stairs: [{ x: 25, y: 45 }, { x: 75, y: 45 }],
//       elevators: [{ x: 30, y: 55 }],
//       restrooms: [{ x: 70, y: 55 }]
//     },
//     3: {
//       northWing: ['C304', 'C307', 'C308'],
//       southWing: ['C310', 'C311'],
//       stairs: [{ x: 25, y: 45 }, { x: 75, y: 45 }],
//       elevators: [{ x: 30, y: 55 }],
//       restrooms: [{ x: 70, y: 55 }]
//     },
//     4: {
//       northWing: ['C402', 'C403', 'C404'],
//       southWing: ['C407', 'C408', 'C410', 'C411'],
//       stairs: [{ x: 25, y: 45 }, { x: 75, y: 45 }],
//       elevators: [{ x: 30, y: 55 }],
//       restrooms: [{ x: 70, y: 55 }]
//     },
//     5: {
//       northWing: ['C501', 'C502', 'C503'],
//       southWing: ['C504', 'C507', 'C508', 'C510'],
//       stairs: [{ x: 25, y: 45 }, { x: 75, y: 45 }],
//       elevators: [{ x: 30, y: 55 }],
//       restrooms: [{ x: 70, y: 55 }]
//     }
//   },
//   'D': {
//     1: {
//       northWing: ['D101', 'D103', 'D104', 'D106', 'D107', 'D108'],
//       southWing: ['D110', 'D113', 'D117', 'D120', 'D121', 'D122', 'D123', 'D125'],
//       stairs: [{ x: 15, y: 45 }, { x: 85, y: 45 }],
//       elevators: [{ x: 20, y: 55 }],
//       restrooms: [{ x: 80, y: 55 }]
//     },
//     2: {
//       northWing: ['D202', 'D203', 'D204'],
//       southWing: ['D206', 'D207', 'D209'],
//       stairs: [{ x: 25, y: 45 }, { x: 75, y: 45 }],
//       elevators: [{ x: 30, y: 55 }],
//       restrooms: [{ x: 70, y: 55 }]
//     },
//     3: {
//       northWing: ['D303'],
//       southWing: [],
//       stairs: [{ x: 50, y: 45 }],
//       elevators: [{ x: 45, y: 55 }],
//       restrooms: [{ x: 55, y: 55 }]
//     }
//   }
// };

// export function FloorPlanSVG({ building, floor, statuses }: FloorPlanSVGProps) {
//   const plan = FLOOR_PLANS[building]?.[floor];

//   if (!plan) {
//     return (
//       <div className="flex items-center justify-center h-64 text-slate-400">
//         暂无该楼层平面图数据
//       </div>
//     );
//   }

//   const handleClassroomClick = (classroom: string) => {
//     const status = statuses[classroom];
//     if (status === 'free') {
//       toast.success(`${classroom} 教室空闲`, {
//         description: '点击可查看详情',
//       });
//     } else if (status === 'occupied') {
//       toast.error(`${classroom} 教室占用`, {
//         description: '当前时间段有课',
//       });
//     }
//   };

//   // 计算教室尺寸
//   const maxNorth = Math.max(plan.northWing.length, 4);
//   const maxSouth = Math.max(plan.southWing.length, 4);
//   const maxClassrooms = Math.max(maxNorth, maxSouth);

//   const roomWidth = Math.min(120, 800 / maxClassrooms - 10);
//   const roomHeight = 70;
//   const corridorHeight = 60;
//   const startX = (800 - (maxClassrooms * (roomWidth + 10))) / 2 + 50;

//   return (
//     <svg viewBox="0 0 900 350" className="w-full h-auto">
//       {/* 标题 */}
//       <text x="450" y="25" textAnchor="middle" className="fill-slate-700 text-lg font-bold">
//         {building}座 {floor}楼 平面图
//       </text>

//       {/* 北侧教室 */}
//       <g transform={`translate(${startX}, 50)`}>
//         <text x="-40" y="45" className="fill-slate-500 text-sm">北侧</text>
//         {plan.northWing.map((room, i) => {
//           const status = statuses[room] || 'occupied';
//           const isFree = status === 'free';

//           return (
//             <g
//               key={room}
//               transform={`translate(${i * (roomWidth + 10)}, 0)`}
//               onClick={() => handleClassroomClick(room)}
//               style={{ cursor: 'pointer' }}
//             >
//               <rect
//                 width={roomWidth}
//                 height={roomHeight}
//                 rx="6"
//                 className={`transition-all duration-200 ${isFree
//                   ? 'fill-emerald-500 hover:fill-emerald-600'
//                   : 'fill-rose-500 hover:fill-rose-600'
//                   }`}
//                 stroke="white"
//                 strokeWidth="2"
//               />
//               <text
//                 x={roomWidth / 2}
//                 y={roomHeight / 2 - 8}
//                 textAnchor="middle"
//                 className="fill-white font-bold text-sm"
//               >
//                 {room}
//               </text>
//               {isFree ? (
//                 <CheckCircle2 x={roomWidth / 2 - 8} y={roomHeight / 2 + 5} size={16} className="text-white" />
//               ) : (
//                 <XCircle x={roomWidth / 2 - 8} y={roomHeight / 2 + 5} size={16} className="text-white" />
//               )}
//             </g>
//           );
//         })}
//       </g>

//       {/* 走廊 */}
//       <rect
//         x="50"
//         y={50 + roomHeight + 10}
//         width="800"
//         height={corridorHeight}
//         className="fill-slate-200"
//         rx="4"
//       />
//       <text x="450" y={50 + roomHeight + 10 + corridorHeight / 2 + 5} textAnchor="middle" className="fill-slate-400 text-sm">
//         走廊
//       </text>

//       {/* 楼梯/电梯/卫生间标识 */}
//       {plan.stairs.map((pos, i) => (
//         <g key={`stair-${i}`} transform={`translate(${pos.x * 8}, ${pos.y * 3.5})`}>
//           <rect width="30" height="30" className="fill-slate-300" rx="4" />
//           <text x="15" y="20" textAnchor="middle" className="fill-slate-600 text-xs">楼梯</text>
//         </g>
//       ))}

//       {/* 南侧教室 */}
//       <g transform={`translate(${startX}, ${50 + roomHeight + 10 + corridorHeight + 10})`}>
//         <text x="-40" y="45" className="fill-slate-500 text-sm">南侧</text>
//         {plan.southWing.map((room, i) => {
//           const status = statuses[room] || 'occupied';
//           const isFree = status === 'free';

//           return (
//             <g
//               key={room}
//               transform={`translate(${i * (roomWidth + 10)}, 0)`}
//               onClick={() => handleClassroomClick(room)}
//               style={{ cursor: 'pointer' }}
//             >
//               <rect
//                 width={roomWidth}
//                 height={roomHeight}
//                 rx="6"
//                 className={`transition-all duration-200 ${isFree
//                   ? 'fill-emerald-500 hover:fill-emerald-600'
//                   : 'fill-rose-500 hover:fill-rose-600'
//                   }`}
//                 stroke="white"
//                 strokeWidth="2"
//               />
//               <text
//                 x={roomWidth / 2}
//                 y={roomHeight / 2 - 8}
//                 textAnchor="middle"
//                 className="fill-white font-bold text-sm"
//               >
//                 {room}
//               </text>
//               {isFree ? (
//                 <CheckCircle2 x={roomWidth / 2 - 8} y={roomHeight / 2 + 5} size={16} className="text-white" />
//               ) : (
//                 <XCircle x={roomWidth / 2 - 8} y={roomHeight / 2 + 5} size={16} className="text-white" />
//               )}
//             </g>
//           );
//         })}
//       </g>

//       {/* 入口标识 */}
//       <g transform="translate(400, 280)">
//         <polygon points="0,0 -15,20 15,20" className="fill-slate-400" />
//         <text x="0" y="35" textAnchor="middle" className="fill-slate-500 text-xs">主入口</text>
//       </g>
//     </svg>
//   );
// }
