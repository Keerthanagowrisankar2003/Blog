const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const GetBlogUserRouter = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
  });

GetBlogUserRouter.use(bodyParser.json());
GetBlogUserRouter.use(cors());
const secretKey = 'your_secret_key';
// Endpoint to get Blogs for a user based on the JWT token
const GetBlogUser = async (token,blog_id,req, res) => {
   
//   const token = extractToken(req); 
  try {
    // Validate the token and get the userId
     const decoded = jwt.verify(token, secretKey);
     const userId = decoded.userid;
    // Fetch blogs from the blog table from the Blogid 
    const [userResult] = await pool.promise().query(
        `SELECT userid
         FROM blog
         WHERE blog_id = ?;`,
       [blog_id]
     );
     
     if (userResult.length > 0) {
        const userid = userResult[0].userid;
      
        // Step 2: Retrieve Blog details for the retrieved userid
        const [blogs] = await pool.promise().query(
            `SELECT blog.blog_id, blog.title, blog_category.category AS category, blog.description, blog.Image,blog.LikeCount
             FROM blog
             JOIN blog_category ON blog.categoryid = blog_category.categoryid
             WHERE blog.userid = ?;`,
           [userid]
         );
         
      
        // Send the response in the expected format
        res.status(200).json({ blogs: blogs });
      }
      else {
        // Handle the case where no user is found for the given blogid
        res.status(404).json({ error: 'User not found for the given blogid' });
      }
    return;
  } catch (error) {
    console.error('Error fetching Blog :', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { GetBlogUserRouter, GetBlogUser };
