// ⚠️ I had to move this to its own file.
// Importing mongoose was trying to pull the MONGO_URI .env before env initialized

import dotenv from "dotenv";
dotenv.config();
