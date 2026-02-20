// import app from "./app.js";
// import { connectDatabase } from "./db.js";

// const PORT = process.env.PORT || 5000;

// connectDatabase()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error.message);
//     process.exit(1);
//   });


import app from "./app.js";
import { connectDatabase } from "./db.js";

let isConnected = false;

const connectDBOnce = async () => {
  if (!isConnected) {
    try {
      await connectDatabase();
      console.log("MongoDB connected");
      isConnected = true;
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
    }
  }
};

// Vercel serverless handler
export default async function handler(req, res) {
  await connectDBOnce();
  return app(req, res);
}
