const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const GetAllBlogRouter = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
  });

GetAllBlogRouter.use(bodyParser.json());
GetAllBlogRouter.use(cors());
const secretKey = 'your_secret_key';
// Endpoint to get all Blogs based on the JWT token
const GetAllBlog = async (req, res) => {
  const token = extractToken(req); 
  try {
    // Validate the token and get the userId
    // const decoded = jwt.verify(token, secretKey);
    // const userId = decoded.userid;
    // Fetch Blogs from the Blog table
    const [blogs] = await pool.promise().query(
      `SELECT  blog.title, blog_category.category,blog.description,blog.Image,blog.LikeCount
      FROM blog
      LEFT JOIN blog_category ON blog_category.categoryid = blog.categoryid`
    );
    // Send the response in the expected format
    res.status(200).json({ blogs: blogs });
    return;
  } catch (error) {
    console.error('Error adding or fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { GetAllBlogRouter, GetAllBlog };
