const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://anmol:mkrishna2soni@adata.dwp7npj.mongodb.net/income-expenses-app?retryWrites=true&w=majority"
    );
    console.log("Db connected successfully");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
dbConnect();
