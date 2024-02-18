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
const secretKey= 'dgshvslcfsihbglvioxbruidghisudlkiy';

const createLikesTable = async (connection) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `CREATE TABLE IF NOT EXISTS Likes (
          userid INT ,
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
  
  const LikeCount = async ( blog_id, req, res) => {
    const token = extractToken(req); 
    try {
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userid;
  
      // Create likes table if it doesn't exist
      await createLikesTable(pool);
  
      // Get a connection from the pool
      const connection = await pool.promise().getConnection();
  
      try {
        // Begin transaction
        await connection.beginTransaction();
  
        // Check if the user has already liked the post
        const [existingLikeResults] = await connection.query(
          `SELECT * FROM Likes WHERE userid = ? AND blog_id = ?`,
          [userId, blog_id]
        );
  
        if (existingLikeResults.length > 0) {
          // User has already liked the post, return an appropriate response
          res.status(400).json({ error: 'User has already liked this post' });
          return;
        }
  
        // Insert like into the likes table with the correct userId and blog_id
        await connection.query(
          `INSERT INTO Likes (userid, blog_id) VALUES (?, ?)`,
          [userId, blog_id]
        );
  
        // Get like count for the Blog
        const [likeCountResults] = await connection.query(
          `SELECT COUNT(*) AS like_count FROM Likes WHERE blog_id = ?`,
          [blog_id]
        );
        const likeCount = likeCountResults[0].like_count;
  
        console.log('Like count before updating blog table:', likeCount);
  
        // Update like count in the blog table
        const updateBlogResult = await connection.query(
          `UPDATE blog SET likecount = ? WHERE blog_id = ?`,
          [likeCount, blog_id]
        );
  
        console.log('Update blog result:', updateBlogResult);
  
        // Commit the transaction
        await connection.commit();
  
        // Query the blog table directly after the update
        const [updatedBlog] = await pool.promise().query(
          `SELECT * FROM blog WHERE blog_id = ?`,
          [blog_id]
        );
  
        if (updatedBlog.length === 0) {
          console.log(`Blog with blog_id ${blog_id} not found.`);
        } else {
          const updatedLikeCount = updatedBlog[0].likecount;
          console.log(`Updated like count in the blog table: ${updatedLikeCount}`);
        }
  
        res.status(201).json({ likeCount: likeCount });
      } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        throw error;
      } finally {
        // Release the connection back to the pool
        connection.release();
      }
    } catch (error) {
      console.error('Error adding like:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = { LikeCountRouter, LikeCount };