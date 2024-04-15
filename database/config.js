const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connection established");
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to db");
  }
};

module.exports = {
  dbConnection,
};
