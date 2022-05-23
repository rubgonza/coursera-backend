//Express set up
const express = require("express"),
  http = require("http");
const hostname = "localhost";
const port = 3000;
const morgan = require("morgan");
const app = express();

//routes
const dishRouter = require("./routes/dishRouter");
const leaderRouter = require("./routes/leaderRouter");
const promoRouter = require("./routes/promoRouter");

//Static files
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public")); // uses files in folder

//Routes
app.use("/dishes", dishRouter);
app.use("/leaders", leaderRouter);
app.use("/promotions", promoRouter);

app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an Express Server</h1></body></html>");
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
