import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PORT = process.env.PORT || 5000;

async function cleanupPort() {
    try {
        console.log(`🔍 Checking if port ${PORT} is in use...`);

        // Platform-specific command to find process using the port
        const isWindows = process.platform === 'win32';

        if (isWindows) {
            // Windows: Use netstat to find the process
            const { stdout } = await execAsync(`netstat -ano | findstr :${PORT}`);

            if (stdout) {
                // Extract PID from netstat output
                const lines = stdout.trim().split('\n');
                const pids = new Set();

                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    const lastPart = parts[parts.length - 1];
                    if (lastPart && !isNaN(lastPart) && lastPart !== '0') {
                        pids.add(lastPart);
                    }
                });

                if (pids.size > 0) {
                    console.log(`⚠️  Port ${PORT} is in use by process(es): ${Array.from(pids).join(', ')}`);

                    for (const pid of pids) {
                        try {
                            await execAsync(`taskkill /F /PID ${pid}`);
                            console.log(`✅ Killed process ${pid}`);
                        } catch (err) {
                            // Process might have already terminated
                            console.log(`⚠️  Could not kill process ${pid} (might be already terminated)`);
                        }
                    }

                    // Wait a bit for the port to be released
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log(`✅ Port ${PORT} is now available`);
                } else {
                    console.log(`✅ Port ${PORT} is available`);
                }
            } else {
                console.log(`✅ Port ${PORT} is available`);
            }
        } else {
            // Unix/Linux/Mac: Use lsof
            try {
                const { stdout } = await execAsync(`lsof -ti:${PORT}`);
                const pid = stdout.trim();

                if (pid) {
                    console.log(`⚠️  Port ${PORT} is in use by process ${pid}`);
                    await execAsync(`kill -9 ${pid}`);
                    console.log(`✅ Killed process ${pid}`);

                    // Wait a bit for the port to be released
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log(`✅ Port ${PORT} is now available`);
                } else {
                    console.log(`✅ Port ${PORT} is available`);
                }
            } catch (err) {
                // lsof returns error if no process found - this is fine
                console.log(`✅ Port ${PORT} is available`);
            }
        }
    } catch (error) {
        // If we can't check or clean up, just continue
        console.log(`ℹ️  Port cleanup check completed`);
    }
}

cleanupPort().then(() => {
    console.log(`🚀 Ready to start server on port ${PORT}\n`);
    process.exit(0);
}).catch((err) => {
    console.error('❌ Error during port cleanup:', err.message);
    process.exit(1);
});
