const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const GetBlogCategoryRouter = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
  });

GetBlogCategoryRouter.use(bodyParser.json());
GetBlogCategoryRouter.use(cors());
const secretKey = 'dgshvslcfsihbglvioxbruidghisudlkiy';
// Endpoint to get Blogs for a particular category based on the JWT token
const GetBlogCategory = async (req, res,category) => {
    const CategoryName = category;
   const token = extractToken(req); 
  try {
    // Validate the token and get the userId
     const decoded = jwt.verify(token, secretKey);
     const userId = decoded.userid;
    // Fetch blogs based on the category
    const [blogs] = await pool.promise().query(
       `SELECT  blog.title, blog_category.category,blog.description,blog.Image,blog.LikeCount
       FROM blog
       LEFT JOIN blog_category ON blog_category.categoryid = blog.categoryid
       WHERE blog_category.category = ?`,
      [CategoryName]
    );
    // Send the response in the expected format
    res.status(200).json({ blogs: blogs });
    return;
  } catch (error) {
    console.error('Error fetching Blog :', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { GetBlogCategoryRouter, GetBlogCategory };
