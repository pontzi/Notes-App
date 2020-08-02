const mongoose = require("mongoose");
//import environment variables
require("dotenv").config({ path: "variables.env" });

mongoose
  .connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.error("There is a error", err));
