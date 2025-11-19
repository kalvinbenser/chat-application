const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4w2j6yx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};
