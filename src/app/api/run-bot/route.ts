import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { targetUrl, headless } = await req.json();

        // Ruta al script del bot
        const scriptPath = path.join(process.cwd(), 'scripts', 'tumaestro-bot.mjs');

        console.log(`[API] Iniciando Bot para: ${targetUrl} (Headless: ${headless})`);

        // Ejecutamos el bot como un proceso independiente
        const botProcess = spawn('node', [scriptPath, targetUrl, headless ? 'true' : 'false'], {
            detached: true,
            stdio: 'ignore'
        });

        botProcess.unref();

        return NextResponse.json({
            success: true,
            message: 'Robot lanzado en segundo plano'
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
