import "dotenv/config";

import { app } from "./app";

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Choose another PORT in .env or stop the process using that port.`);
  } else {
    console.error("Server failed to start:", err);
  }
  process.exit(1);
});
