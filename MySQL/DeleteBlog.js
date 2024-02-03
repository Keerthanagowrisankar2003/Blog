const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const DeleteBlogRouter = express.Router();//node router 

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
});

DeleteBlogRouter.use(bodyParser.json());
DeleteBlogRouter.use(cors());
const secretKey = 'your_secret_key';
const DeleteBlog = ( token,req,res,blog_id) => {
//   const token = extractToken(req); 
    try {
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userid;
      // Perform the deletion in the database
      pool.query(
        `DELETE FROM blog WHERE blog_id = ?`,
        [blog_id],
        (error, results) => {
          if (error) {
            console.error('Error deleting Blog:', error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.status(200).json({ message: 'Blog deleted successfully' });
           
          }
        }
      );
    } catch (error) {
      console.error('Error deleting Blog:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  module.exports = { DeleteBlogRouter, DeleteBlog };