import User from "../models/user.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken.js";


// User sign up
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists." });
        };

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = User.create({ name, email, password: hashedPassword });

        const token = generateToken(newUser._id)
        res.status(201).json({
            token,
            user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            address: newUser.address,
            postCode: newUser.postCode,
        },
        message: "User created.",
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", details: err.message });
    }
};

//User login controller
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed! User does not exist!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Authentication failed! Incorrect password!"});
        }

        const token = generateToken(user._id)
        // console.log("User Loged in:", user)
        // console.log("Token:", token)
        res.status(200).json({
            token,
            user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            postCode: user.postCode,
        },
        message: "Login Successful"
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error!", details: err.message })
    }
};

//Update address controller
export const updateUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        user.address = req.body.address; 
        user.postCode = req.body.postCode;
        user.phone = req.body.phone

        await user.save();

        res.status(200).json({ 
            message: "Address updated successfully", 
            address: user.address, 
            postCode: user.postCode,
            phone: user.phone
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error!", details: err.message })
    }
}


// Get all users from the database
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}); // Retrieve all users from the database
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving items!", details: err })
    }
};


// Get a user from the database by ID
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        console.log("Querying user ID:", userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "User found",
            user
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user!", details: err });
    }
}


export const changePassword = async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;
//   console.log(userId)

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password does not match" });
    // console.log("User Req:", req.user._id.toString())
    // console.log("Req Params:", req.params.id)

    if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Not authorized to change this user's password" });
      }
      

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error: error.toString() });
  }
};



export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      // Save the user
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error: error.toString() });
    }
  };
  