const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const GetFeedbackRouter = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
  });

GetFeedbackRouter.use(bodyParser.json());
GetFeedbackRouter.use(cors());
const secretKey = 'dgshvslcfsihbglvioxbruidghisudlkiy';
// Endpoint to get Blogs for a user based on the JWT token
const GetFeedback = async (req, res) => {
    const { blog_id } = req.body;
   
   const token = extractToken(req); 
  try {
    // Validate the token and get the userId
     const decoded = jwt.verify(token, secretKey);
     const userId = decoded.userid;
    // Fetch blogs from the blog table for a particular user based on the userid encoded from the token
    const [feedback] = await pool.promise().query(
        `SELECT name, feedback FROM feedback WHERE blog_id = ?`,
        [blog_id],
    );
    // Send the response in the expected format
    res.status(200).json({ feedback: feedback});
    return;
  } catch (error) {
    console.error('Error fetching Blog :', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { GetFeedbackRouter, GetFeedback };
