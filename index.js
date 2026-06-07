import express, { request, response } from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { mountSwaggerUI } from "./app/middlewares/swagger.setup.js";
import devRoutes from "./app/routes/dev.route.js";
import authRoutes from "./app/routes/auth.route.js";
import onboardingRoutes from "./app/routes/onboarding.route.js";
import userRoutes from "./app/routes/user.route.js";

const app = express();

async function start() {
  mountSwaggerUI(app);

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use(cors());
  app.use(express.json());

  app.use("/api/dev", devRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/onboarding", onboardingRoutes);
  app.use("/api/users", userRoutes);

  app.all(/(.*)/, (req, res, next) => {
    next(
      new Error(
        `The route ${req.originalUrl} was not found on this server`,
        404,
      ),
    );
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Comentario
