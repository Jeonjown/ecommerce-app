import dotenv from 'dotenv';
import app from './app';
import { initDb } from './dbInit';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
})();
