import dotenv from 'dotenv';
import app from './app.js';
import connectMongoDB from './lib/mongo-database.js';

dotenv.config();

const PORT = Number(process.env.PORT);

async function main() {
  try {
    await connectMongoDB();
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      console.log(`\n📴 Received ${signal}, shutting down...`);
      server.close(async () => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

main();
