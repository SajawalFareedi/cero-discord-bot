require("events").EventEmitter.defaultMaxListeners = 0;
const app = require("express")();
const cors = require("cors");
const homeRoutes = require("./routes/index");
const { json, urlencoded } = require("express");
const port = process.env.PORT || 3000;

app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use("/", homeRoutes);

app.listen(port, () => {
  console.log(`App is listening on http://127.0.0.1:${port}/`);
});
