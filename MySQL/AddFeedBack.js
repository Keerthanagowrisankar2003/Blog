const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const AddFeedbackRouter= express.Router();//node router 


const pool = mysql.createPool({
  host: 'localhost',
  user: 'server_database',
  password: 'Keerthanag@2003',
  database: 'blog_database',
  connectionLimit: 10,
});

AddFeedbackRouter.use(bodyParser.json());
AddFeedbackRouter.use(cors());
const secretKey = 'dgshvslcfsihbglvioxbruidghisudlkiy';


const createFeedbackTable = async (connection, userId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `CREATE TABLE IF NOT EXISTS feedback (
        userid INT,
        blog_id INT,
        feedback_id INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255),
        feedback TEXT,
        FOREIGN KEY (blog_id) REFERENCES blog(blog_id),
        FOREIGN KEY (userid) REFERENCES user(userid)
      )`,
      (createFeedbackTableError) => {
        if (createFeedbackTableError) {
          reject(createFeedbackTableError);
        } else {
          resolve();
        }
      }
    );
  });
};

const AddFeedback = async ( blog_id,Name,feedback, req, res) => {
  try {
    const token = extractToken(req); 
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;

    // Create feedback table if it doesn't exist
    await createFeedbackTable(pool, userId);

    // Insert feedback into the feedback table with the correct userId
    await pool.promise().query(
      `INSERT INTO feedback (userid,blog_id,Name,feedback) VALUES (?, ?, ?, ?)`,
      [userId,blog_id,Name, feedback]
    );

    res.status(201).json({ message: 'Feedback added successfully' });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { AddFeedbackRouter, AddFeedback };
