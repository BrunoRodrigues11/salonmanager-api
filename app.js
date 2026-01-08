require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const collaboratorRoutes = require("./src/routes/collaboratorRoutes");
app.use("/api/collaborators", collaboratorRoutes);

const procedureRoutes = require("./src/routes/procedureRoutes");
app.use("/api/procedures", procedureRoutes);

const priceRoutes = require("./src/routes/priceRoutes");
app.use("/api/prices", priceRoutes);

const recordRoutes = require("./src/routes/recordRoutes");
app.use("/api/records", recordRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
