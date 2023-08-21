const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const helmet = require("helmet");
const redis = require("redis");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// routers
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const serviceRoutes = require("./routes/service");
const userRoutes = require("./routes/user");
const { accessLogStream } = require("./middlewares/morganMiddleware");

// swagger/openapi
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Healthstack API",
      version: "1.0.0",
      description: "This is documentation for Healthstack API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: URL,
      },
    ],
  },
  apis: ["./controllers/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup the logger
// app.use(morgan("tiny", { stream: accessLogStream }));

// database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server started on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/", (req, res) => {
  res.send("Hello!");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
