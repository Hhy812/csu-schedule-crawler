import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const dataFile = path.resolve(process.cwd(), 'visitors.json');

async function readData() {
    try {
        const raw = await fs.readFile(dataFile, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        return { count: 0, logs: [] };
    }
}

async function writeData(data) {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded)) {
        return forwarded[0];
    }
    return req.socket.remoteAddress;
}

app.use(express.json());

// 记录访问（前端每次打开页面调用）
app.post('/api/visit', async (req, res) => {
    try {
        const data = await readData();
        const now = new Date().toISOString();
        const ip = getClientIp(req);
        const ua = req.get('user-agent') || '';

        const entry = {
            time: now,
            ip,
            userAgent: ua,
            path: req.body?.path || '/',
        };

        data.count = (data.count || 0) + 1;
        data.logs = data.logs || [];
        data.logs.push(entry);

        await writeData(data);

        res.json({ count: data.count, entry });
    } catch (error) {
        console.error('visit log error', error);
        res.status(500).json({ error: '写入失败' });
    }
});

// 可选：返回当前统计与日志（用于调试）
app.get('/api/visit', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: '读取失败' });
    }
});

// 生产模式：可直接用此 server 提供静态文件
app.use(express.static(path.resolve(process.cwd(), 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
