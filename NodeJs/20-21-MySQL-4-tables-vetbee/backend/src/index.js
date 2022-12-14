const express = require("express");
const cors = require("cors");

const pets = require("./routes/v1/pets");
const meds = require("./routes/v1/medications");
const logs = require("./routes/v1/logs");
const prescriptions = require("./routes/v1/prescriptions");

require("./config");

const PORT = process.env.serverPort || 5000;
const app = express();

app.use(cors());
app.use(express.json());

console.log(pets);

app.use("/v1/pets", pets);

app.get("/meds", meds.getMeds);

app.post("/meds", meds.postMeds);

app.get("/logs", logs.getLogs);

app.post("/logs", logs.postLogs);

app.get("/prescriptions", prescriptions.getPrescriptions);

app.post("/prescriptions", prescriptions.postPrescriptions);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
