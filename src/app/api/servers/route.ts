import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import http from 'http';

const SERVERS = [
    {
        id: 'leads-manager',
        name: 'Leads Manager',
        port: 3005,
        path: 'C:\\Users\\david\\Desktop\\Projects-Antigravity\\Leads Manager',
        command: 'node node_modules\\next\\dist\\bin\\next dev --port 3005',
    },
    {
        id: 'tu-maestro',
        name: 'Tu Maestro',
        port: 3001,
        path: 'C:\\Users\\david\\Desktop\\Projects-Antigravity\\Tu Maestro\\web',
        command: 'npm run dev -- -p 3001',
    },
    {
        id: 'la-voz-del-pueblo',
        name: 'La Voz Del Pueblo',
        port: 3000,
        path: 'C:\\Users\\david\\Desktop\\Projects-Antigravity\\La Voz Del Pueblo',
        command: 'npm run dev -- --port 3000',
    }
];

async function checkStatus(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const request = http.get(`http://localhost:${port}`, (res) => {
            resolve(res.statusCode === 200 || res.statusCode === 304);
            res.destroy();
        });
        request.on('error', () => resolve(false));
        request.setTimeout(1000, () => {
            request.destroy();
            resolve(false);
        });
    });
}

export async function GET() {
    const statuses = await Promise.all(
        SERVERS.map(async (server) => ({
            ...server,
            online: await checkStatus(server.port),
        }))
    );
    return NextResponse.json(statuses);
}

export async function POST(request: Request) {
    const { id } = await request.json();
    const server = SERVERS.find((s) => s.id === id);

    if (!server) {
        return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Find process on port and kill it
    exec(`netstat -ano | findstr :${server.port}`, (err, stdout) => {
        if (stdout) {
            const lines = stdout.split('\n');
            const pids = new Set();
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length > 4) {
                    pids.add(parts[parts.length - 1]);
                }
            });

            pids.forEach(pid => {
                if (pid && pid !== '0') {
                    exec(`taskkill /F /PID ${pid}`);
                }
            });
        }

        // Start server
        // For Leads Manager, we use a separate shell to avoid killing ourself immediately if possible,
        // though Next.js Dev will likely reload.
        const fullCommand = `cd /d "${server.path}" && start "Server: ${server.name}" ${server.command}`;

        setTimeout(() => {
            exec(fullCommand, (error) => {
                if (error) console.error(`Error starting ${server.name}:`, error);
            });
        }, 1000);
    });

    return NextResponse.json({ message: `Restarting ${server.name}...` });
}
