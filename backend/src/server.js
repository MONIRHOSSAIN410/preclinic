import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5010;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
  })
  .catch(() => process.exit(1));
