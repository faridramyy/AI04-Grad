import dotenv from "dotenv";

dotenv.config();

const secrets = {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  ELEVEN_LABS_API_KEY: process.env.ELEVEN_LABS_API_KEY,
};

export default secrets;
