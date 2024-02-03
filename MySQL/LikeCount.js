const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const LikeCountRouter = express.Router();//node router 


const pool = mysql.createPool({
  host: 'localhost',
  user: 'server_database',
  password: 'Keerthanag@2003',
  database: 'blog_database',
  connectionLimit: 10,
});

LikeCountRouter.use(bodyParser.json());
LikeCountRouter.use(cors());

const createLikesTable = async (connection) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `CREATE TABLE IF NOT EXISTS Likes (
          userid INT UNIQUE,
          blog_id INT,
          Like_id INT AUTO_INCREMENT PRIMARY KEY,
          LikeCount INT DEFAULT 0,
          FOREIGN KEY (blog_id) REFERENCES blog(blog_id),
          FOREIGN KEY (userid) REFERENCES user(userid)
        )`,
        (createLikesTableError) => {
          if (createLikesTableError) {
            reject(createLikesTableError);
          } else {
            resolve();
          }
        }
      );
    });
  };
  
  const LikeCount= async (token, blog_id, req, res) => {
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      const userId = decoded.userid;
  
      // Create likes table if it doesn't exist
      await createLikesTable(pool);
  
      // Insert like into the likes table with the correct userId and blog_id
      await pool.promise().query(
        `INSERT INTO Likes (userid, blog_id) VALUES (?, ?)`,
        [userId, blog_id]
      );
  
      // Get like count for the Blog
      const [likeCountResults] = await pool.promise().query(
        `SELECT COUNT(*) AS like_count FROM Likes WHERE blog_id = ?`,
        [blog_id]
      );
      const likeCount = likeCountResults[0].like_count;

      await pool.promise().query(
        `UPDATE blog SET likecount = ? WHERE blog_id = ?`,
        [likeCount, blog_id]
      );
  
      res.status(201).json({ likeCount: likeCount });
    } catch (error) {
      console.error('Error adding like:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = { LikeCountRouter, LikeCount };
  