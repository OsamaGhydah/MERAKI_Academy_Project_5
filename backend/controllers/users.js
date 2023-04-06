const { pool } = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;
const TOKEN_EXP_Time = process.env.TOKEN_EXP_Time;
const SALT = Number(process.env.SALT);

// creating a token
const generateToken = (rows) => {
  const payload = {
    userId: rows[0].id,
    country: rows[0].country,
    role: rows[0].role_id,
  };
  const options = {
    expiresIn: TOKEN_EXP_Time,
  };

  return jwt.sign(payload, SECRET, options);
};

// This function creates (new user)
const register = async (req, res) => {
  const { firstName, lastName, age, country, email, password, role_id, img } =
    req.body;
  const loweredMail = email.toLowerCase();
  const query = `INSERT INTO users (firstName,
    lastName,
    age,
    country,
    email,
    password,
    role_id,
    img) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    const placeHolders = [
      firstName,
      lastName,
      age,
      country,
      loweredMail,
      hashedPassword,
      role_id,
      img,
    ];
    await pool.query(query, placeHolders);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "The email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users FULL OUTER JOIN roles
  ON users.role_id = roles.id WHERE email=$1 ;`;
  const placeHolders = [email.toLowerCase()];
  try {
    const { rows } = await pool.query(query, placeHolders);
    const isValid = await bcrypt.compare(password, rows[0].password);
    if (isValid) {
      const token = generateToken(rows);
      res.status(200).json({
        success: true,
        massage: "Valid login credentials",
        token,
        userId: rows[0].id,
        firstName: rows[0].firstName,
        img: rows[0].img,
        rows,
      });
    } else {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { register, login };
