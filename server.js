const express = require("express");
require("./config/dbConnect");
const cors = require("cors");
const usersRoute = require("./routes/users/usersRoute");
const transactionsRoute = require("./routes/transactions/transactionsRoute");
const accountRoute = require("./routes/accounts/accountRoute");
const globalErrHandler = require("./middlewares/globalErrHandler");
usersRoute;
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/users", usersRoute);

app.use("/api/v1/transactions", transactionsRoute);

app.use("/api/v1/accounts", accountRoute);

//Error Handlers
app.use(globalErrHandler);
//listen to server
const PORT = process.env.PORT || 9070;
app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
