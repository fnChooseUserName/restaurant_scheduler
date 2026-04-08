import cors from "cors";
import express from "express";

import { errorHandler } from "./middleware/errorHandler";
import { shiftRoutes } from "./routes/shiftRoutes";
import { staffRoutes } from "./routes/staffRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/staff", staffRoutes);
app.use("/api/shifts", shiftRoutes);

app.use(errorHandler);

export { app };
