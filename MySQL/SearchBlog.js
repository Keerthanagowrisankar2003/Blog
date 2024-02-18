const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router7 = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'server_database',
  password: 'Keerthanag@2003',
  database: 'blog_database',
  connectionLimit: 10,
});

router7.use(bodyParser.json());
router7.use(cors());
const secretKey = 'dgshvslcfsihbglvioxbruidghisudlkiy';
// Search endpoint
const SearchItem = async (req, res) => {
  // const token = extractToken(req);

  try {
    // const decoded = jwt.verify(token, secretKey);
    // const userId = decoded.userid;

    // if (userId == null) {
    //   return res.status(400).json({ error: 'User ID is required.' });
    // }

    const searchQuery = req.body.searchQuery; // Assuming the search query is sent in the request body
    console.log(searchQuery);

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const query = `SELECT * 
               FROM blog
               LEFT JOIN blog_category ON blog_category.categoryid = blog.categoryid 
               WHERE Title LIKE ?`;

    pool.query(query, [`%${searchQuery}%`], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        // Handle the error
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('Query results:', results);
        // Process the results
        res.status(200).json({results});

      }
    });
  } catch (error) {
    console.error('Error in SearchItem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { router7, SearchItem };
