const Account = require("../../model/Account");
const Transaction = require("../../model/Transaction");
const User = require("../../model/User");
const { AppErr } = require("../../utils/appErr");

//create
const createTransactionCtrl = async (req, res, next) => {
  const { name, amount, notes, transactionType, account, category } = req.body;
  try {
    // 1. Find User
    const userFound = await User.findById(req.user);
    if (!userFound) return next(new AppErr("User Not Found", 404));

    // 2. Find the Account
    const accountFound = await Account.findById(account);
    if (!accountFound) return next(new AppErr("Account Not Found", 404));

    // 3. Create the Transaction
    const transaction = await Transaction.create({
      amount,
      notes,
      account,
      transactionType,
      category,
      name,
      createdBy: req.user,
    });

    // 4. Push the Transaction to the account
    accountFound.transactions.push(transaction._id);

    // 5. resave the acount
    await accountFound.save();

    res.json({ status: "success", data: transaction });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

//all
const getTransactionsCtrl = async (req, res, next) => {
  try {
    const trans = await Transaction.find();
    res.status(200).json({
      status: "success",
      data: trans,
    });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

//single
const getTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trans = await Transaction.findById(id);
    res.status(200).json({
      status: "success",
      data: trans,
    });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

//delete
const deleteTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

//update
const updateTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trans = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      status: "success",
      data: trans,
    });
  } catch (error) {
    next(new AppErr(error.messase, 500));
  }
};

module.exports = {
  createTransactionCtrl,
  getTransactionsCtrl,
  getTransactionsCtrl,
  getTransactionCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
};
