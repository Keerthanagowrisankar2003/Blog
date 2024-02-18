const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const FullBlogRouter = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
  });

FullBlogRouter.use(bodyParser.json());
FullBlogRouter.use(cors());
const secretKey = 'dgshvslcfsihbglvioxbruidghisudlkiy';
// Endpoint to get all Blogs based on the JWT token
const FullBlog = async (req, res) => {
 
  try {
    const token = extractToken(req); 
    // Validate the token and get the userId
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;
    // Fetch Blogs from the Blog table
    const { blog_id } = req.body;
    
    const [blogs] = await pool.promise().query(
      `SELECT  blog.blog_id,blog.title, blog_category.category,blog.description,blog.Image,blog.LikeCount
      FROM blog
      LEFT JOIN blog_category ON blog_category.categoryid = blog.categoryid WHERE blog_id = ?`, [blog_id]
    );
    // Send the response in the expected format
    res.status(200).json({ blogs: blogs });
    return;
  } catch (error) {
    console.error('Error adding or fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { FullBlogRouter, FullBlog };
