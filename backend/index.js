import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/chat", chatRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});