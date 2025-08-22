import dotenv from 'dotenv';
import app from './app.js';
import connectMongoDB from './config/mongo-database.js';

dotenv.config();

const PORT = Number(process.env.PORT);

async function main() {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

main();
