# 中南大学空闲教室查询系统

基于真实教学楼平面图的可视化空闲教室查询系统。

## 🌟 功能特点

- 📊 **真实平面图**: 按照中南大学教学楼实际布局设计
- 🎨 **可视化展示**: 绿色(空闲) / 红色(占用) 直观显示
- 🔍 **智能搜索**: 支持按教室号快速搜索
- 📱 **响应式设计**: 适配电脑、平板、手机
- ⚡ **实时统计**: 显示空闲率、空闲/占用数量

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist/` 目录。

## 📦 部署到服务器

### 方式一：Nginx 部署

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/classroom-query/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### 方式二：Docker 部署

```bash
# 构建镜像
docker build -t classroom-query .

# 运行容器
docker run -d -p 8080:80 classroom-query
```

### 方式三：静态托管

将 `dist/` 目录上传到：
- 腾讯云 COS + CDN
- 阿里云 OSS + CDN
- GitHub Pages
- Vercel / Netlify

## 📝 更新教室数据

### 步骤1：准备Excel文件

Excel格式要求：
- 每个周一个Sheet，命名为"第1周"、"第2周"等
- 每行是一个时间段（1-2节、3-4节、5-6节、7-8节、9-10节）
- 每列是一个星期（周一、周二、周三、周四、周五）
- 单元格内容是空闲教室列表，空格分隔

示例结构：
```
第1周 空闲教室
         周一                    周二                    ...
1-2节   A101 A102 A103...        A104 A105...            ...
3-4节   A101 A102...             A103 A104...            ...
```

### 步骤2：运行转换脚本

```bash
cd scripts
python convert_excel.py 新学期空闲教室.xlsx ../public/classroom_data.json
```

### 步骤3：重新构建部署

```bash
npm run build
# 将 dist/ 目录部署到服务器
```

## 🏗️ 教学楼布局说明

系统按照中南大学新校区教学楼的实际布局设计：

### A座教学楼
- 1-4层，每层16-24间教室
- 中间走廊，南北两侧分布教室
- 东西两侧有楼梯和电梯

### B座教学楼
- 1-5层，每层14-17间教室
- 与A座类似布局

### C座教学楼
- 1-5层，每层5-7间教室
- 规模较小

### D座教学楼
- 1-3层，每层1-16间教室
- 3层教室较少

## 🛠️ 自定义布局

如需修改教学楼布局，编辑 `src/components/FloorPlanSVG.tsx`：

```typescript
const FLOOR_PLANS = {
  'A': {
    1: {
      northWing: ['A101', 'A102', ...],  // 北侧教室
      southWing: ['A103', 'A104', ...],  // 南侧教室
      stairs: [{ x: 15, y: 45 }, ...],   // 楼梯位置
      elevators: [{ x: 20, y: 55 }],     // 电梯位置
      restrooms: [{ x: 80, y: 55 }]      // 卫生间位置
    }
  }
};
```

## 📁 项目结构

```
├── public/
│   └── classroom_data.json    # 教室数据
├── scripts/
│   └── convert_excel.py       # 数据转换脚本
├── src/
│   ├── components/
│   │   ├── FloorPlanSVG.tsx   # SVG平面图组件
│   │   ├── FloorView.tsx      # 楼层视图
│   │   ├── SearchBar.tsx      # 搜索组件
│   │   ├── Sidebar.tsx        # 侧边栏
│   │   └── StatsPanel.tsx     # 统计面板
│   ├── types/
│   │   └── classroom.ts       # 类型定义
│   ├── App.tsx                # 主应用
│   └── index.css              # 样式
├── dist/                      # 构建输出
├── Dockerfile                 # Docker配置
└── README.md                  # 本文件
```

## 🔧 技术栈

- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui 组件库
- Vite 构建工具

## 📄 许可证

MIT License
