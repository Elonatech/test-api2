const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const { token_key } = require("../config/key");
const jwt = require("jsonwebtoken");

// Sign Up
const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fill All Field" });
    }
    // check if admin already exist
    const oldadmin = await Admin.findOne({ email });
    if (oldadmin) {
      return res.status(409).json({ message: "Admin Already Exist" });
    }
    //Encrypt admin password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: encryptedPassword });
    return res.status(201).json({ admin });
  } catch (error) {
    console.log(error);
  }
};

//  Sign In
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Fill All Required Fields");
  }

  // check if Admin exist
  const admin = await Admin.findOne({ email: email });
  if (!admin) {
    return res.status(400).send("Admin does not exist");
  }

  // compare passwords
  const passwordValid = await bcrypt.compare(password, admin.password);
  if (!passwordValid) {
    return res.status(400).send("Incorrect Email or Password");
  }

  const payload = { id: Admin._id };
  // Admin jwt
  const token = jwt.sign(payload, token_key, { expiresIn: "3600" });
  return res
    .status(200)
    .json({ message: "Login Successful", email: admin.email, access: token });
};

module.exports = { adminRegister, adminLogin };
