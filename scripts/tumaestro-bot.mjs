/**
 * Lead Generation Robot para TuMaestro.es (Versión Real SEO)
 * 
 * Este script usa Playwright para navegar como un humano real
 * usando Proxies Residenciales de DataImpulse (España).
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Obtenemos la URL y el modo headless de los argumentos
// Obtenemos la URL (Ignoramos el argumento para forzar objetivos específicos)
// const targetUrl = process.argv[2] || 'https://tumaestro.es'; <-- ANULADO
const headless = process.argv[3] !== 'false';

// OBJETIVOS ESTRICTOS
const TARGET_URLS = [
    'https://tumaestro.es/recursos/cuentacuentos/',
    'https://tumaestro.es/juegos/'
];
// Seleccionar objetivo aleatorio para esta sesión
const targetUrl = TARGET_URLS[Math.floor(Math.random() * TARGET_URLS.length)];

// --- NUEVO: Lógica de Usuarios Recurrentes (Tasa de Retorno) ---
const MAX_PERSISTENT_PROFILES = 15; // Pool de 15 identidades "fijas"
const RETURNING_USER_PROBABILITY = 0.40; // 40% de visitas serán de usuarios conocidos
const isReturningUser = Math.random() < RETURNING_USER_PROBABILITY;
const profileId = isReturningUser
    ? Math.floor(Math.random() * MAX_PERSISTENT_PROFILES) + 1
    : 'temp-' + Date.now();

// Configuración DataImpulse (Usando variables de entorno para seguridad en la nube)
const BASE_PROXY_CONFIG = {
    server: process.env.PROXY_SERVER || 'http://gw.dataimpulse.com:823',
    loginBase: process.env.PROXY_LOGIN || '43eae80e80002d6d67b2',
    password: process.env.PROXY_PASSWORD || '4a8d1549c089df41'
};

// Ciudades disponibles para rotación (Nombres en inglés minúsculas standard)
const TARGET_CITIES = ['madrid', 'barcelona', 'valencia', 'sevilla', 'bilbao', 'malaga', 'alicante', 'zaragoza'];

// --- Configuración de Perfiles de Dispositivo (Anti-Huella) ---
const DEVICE_PROFILES = [
    // Desktop Windows Standard
    { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', width: 1920, height: 1080 },
    // Desktop Mac
    { ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', width: 1440, height: 900 },
    // Desktop Windows Large
    { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', width: 2560, height: 1440 },
    // Laptop Windows
    { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', width: 1366, height: 768 },
    // iPhone 14
    { ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1', width: 390, height: 844, isMobile: true },
    // Samsung Galaxy S23
    { ua: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36', width: 360, height: 780, isMobile: true },
    // Pixel 7
    { ua: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36', width: 412, height: 915, isMobile: true }
];

async function runBot() {
    // Selección aleatoria de perfil de dispositivo
    const device = DEVICE_PROFILES[Math.floor(Math.random() * DEVICE_PROFILES.length)];

    // Directorio de perfil: Persistente para "Returning Users", Temporal para "New Users"
    const userDataDir = isReturningUser
        ? `./tmp-profiles/persistent-user-${profileId}`
        : `./tmp-profiles/temp-user-${profileId}`;

    if (isReturningUser) {
        console.log(`[BOT] 🔄 USUARIO RECURRENTE: Usando perfil persistente #${profileId}`);
    } else {
        console.log(`[BOT] ✨ USUARIO NUEVO: Creando rastro efímero`);
    }

    // Seleccionamos ciudad aleatoria para diversificar log (aunque targeting es general)
    // Usamos __country-es genérico para MÁXIMA estabilidad
    const proxyUser = `${BASE_PROXY_CONFIG.loginBase}__country-es`;

    console.log(`[BOT] 🚀 SESIÓN: ESPAÑA (Auto) | 🖥️ ${device.width}x${device.height}`);
    console.log(`[BOT] 🛡️ Proxy: DataImpulse Residencial`);

    const launchOptions = {
        // En Linux (Koyeb/Docker) no necesitamos executablePath si instalamos los browsers de playwright
        // En Windows local, si no lo encuentra, usará el sugerido
        executablePath: process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : undefined,
        headless: headless,
        viewport: { width: device.width, height: device.height },
        userAgent: device.ua,
        deviceScaleFactor: device.isMobile ? 3 : 1,
        isMobile: device.isMobile || false,
        hasTouch: device.isMobile || false,
        locale: 'es-ES',
        timezoneId: 'Europe/Madrid',
        proxy: {
            server: BASE_PROXY_CONFIG.server,
            username: proxyUser,
            password: BASE_PROXY_CONFIG.password
        },
        args: [
            '--disable-blink-features=AutomationControlled',
            device.isMobile ? '--user-agent=' + device.ua : '--start-maximized',
            '--no-first-run',
            '--no-default-browser-check'
        ]
    };

    try {
        // Lanzamos navegador con el proxy autenticado
        const context = await chromium.launchPersistentContext(userDataDir, launchOptions);
        const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

        // --- LÓGICA DE REBOTE (BOUNCE RATE) ---
        // 20% de probabilidad de ser un "usuario impaciente" que se va a los 5 segundos
        const isBounceSession = Math.random() < 0.20;
        if (isBounceSession) {
            console.log(`[BOT] ⚡ SESIÓN DE REBOTE: El usuario se irá pronto.`);
        }

        // --- MEDIDOR DE TRÁFICO ---
        let totalBytes = 0;
        page.on('response', async (response) => {
            try {
                const headers = response.headers();
                if (headers['content-length']) {
                    totalBytes += parseInt(headers['content-length'], 10);
                }
            } catch (e) { }
        });

        // ... (resto de scripts de stealth y optimización se mantienen igual) ...

        // --- MODO INVISIBLE AVANZADO (STEALTH) ---
        // Eliminar rastro de "navigator.webdriver" que delata a los bots
        await page.addInitScript(() => {
            // 1. Borrar propiedad webdriver
            const newProto = navigator.__proto__;
            delete newProto.webdriver;
            navigator.__proto__ = newProto;

            // 2. Simular plugins y languages (si están vacíos delatan bot)
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
            Object.defineProperty(navigator, 'languages', {
                get: () => ['es-ES', 'es', 'en'],
            });

            // 3. Simular objeto chrome
            window.chrome = {
                runtime: {},
                loadTimes: function () { },
                csi: function () { },
                app: {}
            };

            // 4. Hackear permisos para que no parezcan de bot
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
        });

        // --- OPTIMIZACIÓN: AHORRO DE ANCHO DE BANDA (Inteligente) ---
        // Bloqueamos carga de Imágenes y Media, pero PERMITIMOS trackers de Google
        await page.route('**/*', (route) => {
            const req = route.request();
            const type = req.resourceType();
            const url = req.url().toLowerCase();

            // Excepción CRÍTICA: No bloquear Analytics, GTM, o pixels de seguimiento
            if (url.includes('google-analytics') || url.includes('gtag') || url.includes('collect') || url.includes('g.doubleclick')) {
                return route.continue();
            }

            if (['image', 'media', 'font'].includes(type)) {
                return route.abort();
            }
            return route.continue();
        });

        // --- SIMULACIÓN DE FUENTES DE TRÁFICO (SEO & SOCIAL) ---
        const REFERRERS = [
            'https://www.google.es/search?q=clases+particulares+tumaestro',
            'https://www.google.es/search?q=cuentos+infantiles+gratis',
            'https://www.google.es/search?q=juegos+educativos+online',
            'https://www.facebook.com/',
            'https://t.co/', // Twitter/X
            'https://www.instagram.com/',
            '' // Tráfico Directo
        ];
        const selectedReferrer = REFERRERS[Math.floor(Math.random() * REFERRERS.length)];

        if (selectedReferrer) {
            await page.setExtraHTTPHeaders({
                'Referer': selectedReferrer
            });
            console.log(`[BOT] 🌐 Fuente de tráfico: ${selectedReferrer}`);
        } else {
            console.log(`[BOT] 📥 Fuente de tráfico: Directo (Sin Referer)`);
        }

        console.log(`[BOT] Navegando a ${targetUrl}...`);

        // Timeout generoso
        await page.goto(targetUrl, { waitUntil: 'load', timeout: 60000 });

        // Si es sesión de rebote, esperamos poco y cerramos
        if (isBounceSession) {
            const bounceTime = 3000 + Math.random() * 4000;
            console.log(`[BOT] ⏱️ Salida rápida en ${(bounceTime / 1000).toFixed(1)}s`);
            await page.waitForTimeout(bounceTime);
            await context.close();
            console.log(`[BOT] ✅ Sesión de Rebote Finalizada`);
            return;
        }

        // 1. Verificar si GA está en el código
        const hasGA = await page.evaluate(() => {
            return !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
        });
        console.log(`[BOT] ¿Script de Google Analytics detectado?: ${hasGA ? 'SÍ' : 'NO'}`);

        // 2. Aceptar Cookies
        try {
            console.log(`[BOT] 🍪 Buscando banner de cookies...`);
            const selectors = [
                'button:has-text("Aceptar todas")',
                'button:has-text("ACEPTAR")',
                'button:has-text("Aceptar Todo")',
                '#accept-cookies'
            ];

            let clicked = false;
            for (const selector of selectors) {
                try {
                    const btn = await page.$(selector);
                    if (btn && await btn.isVisible()) {
                        await page.waitForTimeout(1000 + Math.random() * 1000);
                        await btn.click();
                        console.log(`[BOT] ✅ Cookies aceptadas con selector: ${selector}`);
                        clicked = true;
                        break;
                    }
                } catch (e) { }
            }
        } catch (e) { }

        // 3. Actividad Humana MEJORADA para GA4 (Session > 10s + Engagement)
        console.log(`[BOT] 👤 Iniciando patrón de comportamiento humano avanzado...`);

        // Función para mover el ratón con "ruido" humano
        const humanMove = async () => {
            if (device.isMobile) return; // No hay ratón en móvil
            const steps = 5;
            for (let j = 0; j < steps; j++) {
                await page.mouse.move(
                    Math.random() * (device.width || 800),
                    Math.random() * (device.height || 600),
                    { steps: 10 }
                );
            }
        };

        const minDuration = 20000; // 20 segundos mínimo
        const startTime = Date.now();

        while (Date.now() - startTime < minDuration) {
            // Scroll suave imitando lectura
            const scrollAmount = device.isMobile ? 200 : 400;
            await page.mouse.wheel(0, scrollAmount);
            await page.waitForTimeout(2000 + Math.random() * 3000); // Pausa más real para leer

            if (!device.isMobile) await humanMove();

            // Click aleatorio en zona segura
            if (Math.random() > 0.8) {
                const x = 100 + Math.random() * 100;
                const y = 200 + Math.random() * 200;
                if (device.isMobile) {
                    await page.touchscreen.tap(x, y);
                } else {
                    await page.mouse.click(x, y);
                }
            }

            await page.mouse.wheel(0, Math.random() > 0.5 ? 100 : -50);
            await page.waitForTimeout(1000);
        }

        // 4. Navegación Interna PRIORIZADA (Cuenta Cuentos y Juegos)
        console.log(`[BOT] 🔄 Buscando secciones prioritarias (Juegos/Cuentos)...`);

        // Palabras clave para detectar enlaces de interés
        const priorityKeywords = ['cuento', 'juego', 'game', 'story'];
        const priorityPaths = ['/recursos/cuentacuentos', '/juegos'];

        // Obtener todos los enlaces visibles
        const allLinks = await page.$$('a[href^="/"]:not([href*="login"]):not([href*="auth"])');
        let targetElement = null;
        let targetHref = '';

        // Filtrar enlaces que coincidan con nuestros objetivos
        for (const link of allLinks) {
            const href = await link.getAttribute('href');
            if (href && priorityKeywords.some(kw => href.toLowerCase().includes(kw))) {
                targetElement = link;
                targetHref = href;
                break; // Encontramos uno, nos vale
            }
        }

        if (targetElement) {
            console.log(`[BOT] 🎯 ENLACE PRIORITARIO ENCONTRADO: "${targetHref}"`);
            const linkText = await targetElement.innerText();
            console.log(`[BOT] 🔗 Navegando orgánicamente a: "${linkText.trim().substring(0, 30)}..."`);

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle' }),
                targetElement.click()
            ]);
        } else {
            console.log(`[BOT] ⚠️ Enlaces prioritarios no visibles. Forzando navegación directa...`);
            // Si no hay enlace visual, vamos directamente a la URL (Sigue contando como pageview)
            const randomPath = priorityPaths[Math.floor(Math.random() * priorityPaths.length)];
            const fullDestUrl = new URL(randomPath, targetUrl).toString();
            console.log(`[BOT] 🔀 Redirigiendo a objetivo: ${fullDestUrl}`);

            await page.goto(fullDestUrl, { waitUntil: 'networkidle' });
        }

        // Estar un tiempo en la página destino (Disfrutando del cuento/juego)
        const readingTime = 15000 + Math.random() * 10000;
        console.log(`[BOT] ⏱️ Permaneciendo en página objetivo ${(readingTime / 1000).toFixed(1)}s...`);
        await page.waitForTimeout(readingTime);

        console.log(`[BOT] ✅ Sesión SEO Finalizada (Duración total: ${((Date.now() - startTime) / 1000).toFixed(1)}s)`);
        console.log(`[BOT] 📊 Tráfico Consumido: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);

        await context.close();

        // --- LIMPIEZA DE DISCO ---
        // Si fue una sesión temporal, borramos la carpeta para no acumular GB innecesarios
        if (!isReturningUser && fs.existsSync(userDataDir)) {
            console.log(`[BOT] 🧹 Limpiando perfil temporal: ${userDataDir}`);
            try {
                fs.rmSync(userDataDir, { recursive: true, force: true });
            } catch (e) {
                console.log(`[BOT] ⚠️ No se pudo borrar el perfil temporal (posible proceso bloqueado)`);
            }
        }

    } catch (error) {
        console.error(`[BOT] ❌ Error (Revisar credenciales proxy o conexión):`, error.message);
    }
}

runBot();
