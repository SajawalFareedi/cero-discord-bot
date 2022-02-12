if (process.argv[2] == "--production") {
  process.env.NODE_ENV = "production";
  console.log("Running in production mode");
} else {
  process.env.NODE_ENV = "devlopment";
  console.log("Running is development mode");
}

require("dotenv").config();
const fs = require("fs");
const dir = "./logs";

if (!fs.existsSync(dir)) {
  console.log("Logs folder created");
  fs.mkdirSync(dir);
}

require("./cero-rpg/DiscordBot");
const { errorLog } = require("./cero-rpg/utils/logger");

process.on("unhandledRejection", (err) => {
  console.log(err);
  errorLog.error({ err });
});
