// Server config
import "./src/config/env";
import { connectMongoose } from "./src/config/mongoose";

// Start the server
import app from "./src/app";
(async () => {
  await connectMongoose();

  const PORT = 5023;

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
})();
