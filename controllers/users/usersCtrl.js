const bcrypt = require("bcryptjs");
const User = require("../../model/User");
const { AppErr, appErr } = require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");

//Register
const registerUserCtrl = async (req, res, next) => {
  const { fullname, password, email } = req.body;
  try {
    //check if email exist
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(new AppErr("User Already Exist", 400));
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.json({
      status: "success",
      fullname: user.fullname,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    next(new Error(error));
  }
};

//login
const userLoginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if email exist
    const userFound = await User.findOne({ email });
    if (!userFound) return next(new AppErr("Invalid Login Credentials", 400));

    //check for password valadity
    const isPasswordMatch = await bcrypt.compare(password, userFound.password);
    if (!isPasswordMatch) return next(new Error("Invalid Login Credentials"));

    res.json({
      status: "success",
      fullname: userFound.fullname,
      id: userFound._id,
      token: generateToken(userFound._id),
    });
  } catch (error) {
    next(error);
  }
};

//profile
const userProfileCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).populate({
      path: "accounts",
      populate: {
        path: "transactions",
        model: "Transaction",
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

//delete
const deleteUserCtrl = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

//update
const updateUserCtrl = async (req, res, next) => {
  try {
    //Check if email exist
    if (req.body.email) {
      const userFound = await User.findOne({ email: req.body.email });
      if (userFound) return next(new AppErr("Email is taken", 400));
    }

    //check is user updating password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //update the user
      const user = await User.findByIdAndUpdate(
        req.user,
        {
          password: hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        status: "succcess",
        data: user,
      });
    }
    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "succcess",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUserCtrl,
  userLoginCtrl,
  userLoginCtrl,
  userProfileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
};
