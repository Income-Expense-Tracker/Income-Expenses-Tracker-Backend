const Account = require("../../model/Account");
const User = require("../../model/User");
const { AppErr } = require("../../utils/appErr");

//create
const createAccountCtrl = async (req, res, next) => {
  const { name, initialBalance, accountType, notes } = req.body;
  try {
    // 1. Find the logged in user
    const userFound = await User.findById(req.user);
    if (!userFound) return next(new AppErr("User not Found", 404));
    // 2. Create the Account
    const account = await Account.create({
      name,
      initialBalance,
      accountType,
      notes,
      createdBy: req.user,
    });
    // 3. push the account into users accounts field
    userFound.accounts.push(account._id);

    // 4. resave the user
    await userFound.save();

    res.json({ status: "success", data: account });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

//all
const getAccountsCtrl = async (req, res, next) => {
  try {
    const accounts = await Account.find().populate("transactions");
    res.json(accounts);
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

//single
const getAccountCtrl = async (req, res, next) => {
  try {
    //find the id from params
    const { id } = req.params;
    const account = await Account.findById(id).populate("transactions");
    res.json({ status: "success", data: account });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

//delete
const deleteAccountCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Account.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

//update
const updateAccountCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "succcess",
      data: account,
    });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

module.exports = {
  createAccountCtrl,
  getAccountCtrl,
  deleteAccountCtrl,
  updateAccountCtrl,
  getAccountsCtrl,
};
