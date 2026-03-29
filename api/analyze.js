const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL required' });
    }
    
    const outputDir = '/tmp/yt-analysis';
    const timestamp = Date.now();
    const workDir = `${outputDir}/${timestamp}`;
    
    // Create directories
    fs.mkdirSync(workDir, { recursive: true });
    fs.mkdirSync(`${workDir}/frames`, { recursive: true });
    
    try {
        // 1. Get video info
        const infoCmd = spawn('yt-dlp', ['--dump-json', '--no-playlist', url], { cwd: workDir });
        let infoOutput = '';
        
        await new Promise((resolve, reject) => {
            infoCmd.stdout.on('data', d => infoOutput += d);
            infoCmd.on('close', code => code === 0 ? resolve() : reject(new Error('Failed to get info')));
        });
        
        const info = JSON.parse(infoOutput.split('\n')[0]);
        const duration = Math.floor(info.duration || 0);
        const views = info.view_count ? `${(info.view_count/1000).toFixed(1)}K` : 'N/A';
        
        // 2. Download video (best quality)
        await new Promise((resolve, reject) => {
            const dl = spawn('yt-dlp', ['-f', 'best', '-o', 'video.mp4', '--no-playlist', url], { cwd: workDir });
            dl.on('close', code => code === 0 ? resolve() : reject(new Error('Download failed')));
        });
        
        // 3. Extract frames (every 10 seconds)
        const frameCount = Math.floor(duration / 10);
        for (let i = 0; i < frameCount; i++) {
            const time = i * 10;
            await new Promise((resolve) => {
                const ffmpeg = spawn('ffmpeg', [
                    '-ss', time.toString(),
                    '-i', `${workDir}/video.mp4`,
                    '-vframes', '1',
                    '-q:v', '2',
                    `${workDir}/frames/frame_${String(i).padStart(4, '0')}.jpg`
                ]);
                ffmpeg.on('close', () => resolve());
            });
        }
        
        // 4. Get subtitles (if available)
        await new Promise(() => {
            const sub = spawn('yt-dlp', ['--write-auto-subs', '--skip-download', '-o', 'subs', url], { cwd: workDir });
            sub.on('close', () => {});
        });
        
        // List frames
        const frames = fs.readdirSync(`${workDir}/frames`)
            .filter(f => f.endsWith('.jpg'))
            .sort()
            .map((f, i) => ({
                filename: f,
                time: `${i * 10}s`,
                // In production, you'd serve these from a CDN
                url: `/frames/${timestamp}/${f}`
            }));
        
        res.json({
            success: true,
            title: info.title,
            duration: `${Math.floor(duration/60)}:${String(duration%60).padStart(2,'0')}`,
            views,
            frames_extracted: frames.length,
            frames
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
