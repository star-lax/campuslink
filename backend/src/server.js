import { createApp } from './app.js';
import { connectDatabase } from './database/connection.js';
const port = Number(process.env.PORT || 4000);
await connectDatabase();
createApp().listen(port, () => console.log(`CampusLink API listening on http://localhost:${port}`));
