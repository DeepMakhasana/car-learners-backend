// Main file
const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log("Server started on port: " + port);
});
