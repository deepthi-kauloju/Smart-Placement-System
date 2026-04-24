const User = require("../../models/user.model");
const bcrypt = require('bcrypt');


const Signup = async (req, res) => {
  const { first_name, name, email, number, password } = req.body;
  const resolvedFirstName = first_name || name;

  try {
    if (!resolvedFirstName || !email || !number || !password) {
      return res.status(400).json({ msg: "Please fill all required fields!" });
    }

    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User Already Exists!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name: resolvedFirstName,
      email: email,
      number: number,
      password: hashPassword,
      role: "student",
      studentProfile: {
        isApproved: false
      }
    });
    await newUser.save();
    return res.json({ msg: "User Created!" });
  } catch (error) {
    console.log("student.signup.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = Signup;
