const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const AddBlogRouter = express.Router();//node router 

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
});
AddBlogRouter.use(bodyParser.json());
AddBlogRouter.use(cors());
const secretKey = 'your_secret_key';
const AddBlog = async (token,Title, category,Description ,Image,req,res) => {
//   const token = extractToken(req); 
  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;
    // Check if the category exists in the category table
    const [categoryResult] = await pool.promise().query(
      `SELECT * FROM blog_category WHERE category = ?`,
      [category]
    );
    let categoryId;
    if (categoryResult.length > 0) {
      categoryId = categoryResult[0].categoryid;
    } else {
      const [insertResult] = await pool.promise().query(
        `INSERT INTO blog_category (userid,category) VALUES (?,?)`,
        [userId,category]
      );
      categoryId = insertResult.insertId;
    }
    // Insert Blog into the blog table with the correct userId
    await pool.promise().query(
      `INSERT INTO  blog(userid, Title, Description, categoryid,Image) VALUES (?, ?, ?, ?,?)`,
      [userId, Title, Description , categoryId,Image]
    );
    res.status(201).json({ message: 'Blog added successfully' });
  } catch (error) {
    console.error('Error adding Blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { AddBlogRouter, AddBlog };