const User = require("../model/userModel");
const bcrypt = require("bcrypt");

// Register
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username already exists
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }

    // Check if the email already exists
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // Remove the password field from the returned user object
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    return res.json({
      status: true,
      user: userWithoutPassword,
    });
  } catch (exception) {
    next(exception); // Corrected the typo
  }
};

// Login
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        msg: "Incorrect Username or Password",
        status: false,
      });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        msg: "Incorrect Username or Password",
        status: false,
      });
    }

    // Remove the password field from the returned user object
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    return res.json({
      status: true,
      user: userWithoutPassword,
    });
  } catch (exception) {
    next(exception); // Corrected the typo
  }
};

// Set Avatar
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (exception) {
    next(exception);
  }
};

// Get All Users
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]); // Chained select after find
    return res.json(users);
  } catch (exception) {
    next(exception);
  }
};
