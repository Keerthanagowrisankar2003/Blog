const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const { sendOTP } = require('./MailOtp');
const SignupRouter = express.Router();
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
  });

// Middleware setup for router2
SignupRouter.use(bodyParser.json());
SignupRouter.use(cors());

// Function to check if a user with the given email already exists
const checkExistingUser = async (email) => {
  const [results] = await pool.promise().query('SELECT * FROM user WHERE emailid = ?', [email]);
  return results.length > 0;
};

// Function to hash the given password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Function to create the Blog_category table for a new user
const createBlogCategoryTable = async (connection, userId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `CREATE TABLE IF NOT EXISTS blog_category (
        userid INT,
        categoryid INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100),
        FOREIGN KEY (userid) REFERENCES user(userid)                             
      )`,
      (createCategoryTableError) => {
        if (createCategoryTableError) {
          reject(createCategoryTableError);
        } else {
          resolve();
        }
      }
    );
  });
};
// Function to insert a new user into the database
const insertUser = async (connection, firstname, lastname, email, hashedPassword) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO user (firstname, lastname, emailid, password) VALUES (?, ?, ?, ?)',
        [firstname, lastname, email, hashedPassword],
        (insertError, insertResults) => {
          if (insertError) {
            reject(insertError);
          } else {
            resolve(insertResults.insertId);
          }
        }
      );
    });
  };

// Function to create the Blog table for a new user
const createBlogTable = async (connection, userId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `CREATE TABLE IF NOT EXISTS blog (
        userid INT,
        blog_id INT AUTO_INCREMENT PRIMARY KEY,
        Title VARCHAR(100),
        categoryid INT,
        Description VARCHAR(1638),
        Image VARCHAR(1000),
        LikeCount INT,
        FOREIGN KEY (userid) REFERENCES user(userid),
        FOREIGN KEY (categoryid) REFERENCES blog_category(categoryid)
      )`,
      (createBlogTableError) => {
        if (createBlogTableError) {
          reject(createBlogTableError);
        } else {
          resolve();
        }
      }
    );
  });
};

// Signup route handler
const Signup = async (firstname, lastname, email, password, res) => {
  try {
    const userExists = await checkExistingUser(email);

    if (userExists) {
      res.status(409).json({ error: 'User already exists with this email' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        console.error('Error getting connection:', getConnectionError);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      connection.beginTransaction(async (beginError) => {
        if (beginError) {
          console.error('Error beginning transaction:', beginError);
          res.status(500).json({ error: 'Internal server error' });
          connection.release();
          return;
        }

        try {
          const userId = await insertUser(connection, firstname, lastname, email, hashedPassword);

          await createBlogCategoryTable(connection, userId);
          await createBlogTable(connection, userId);

          // Generate a random 6-digit OTP
          const otp = Math.floor(100000 + Math.random() * 900000);

          // Send the OTP to the user's email
          try {
            await sendOTP(email, otp);
            console.log('OTP sent successfully:', otp);
          } catch (otpError) {
            console.error('Error sending OTP:', otpError);
            res.status(500).json({ error: 'Error sending OTP' });
            connection.rollback(() => {
              connection.release();
            });
            return;
          }

          connection.commit((commitError) => {
            if (commitError) {
              console.error('Error committing transaction:', commitError);
              connection.rollback(() => {
                res.status(500).json({ error: 'Internal server error' });
                connection.release();
              });
            } else {
              res.status(200).json({ message: 'User signed up successfully' });
              connection.release();
            }
          });
        } catch (error) {
          console.error('Error during transaction:', error);
          connection.rollback(() => {
            res.status(500).json({ error: 'Internal server error' });
            connection.release();
          });
        }
      });
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { SignupRouter, Signup };