const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const UpdateRouter = express.Router();//node router 

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
});

UpdateRouter.use(bodyParser.json());
UpdateRouter.use(cors());
const secretKey = 'dgshvslcfsihbglvioxbruidghisudlkiy';
const UpdateBlog = async(Title,Description ,Image,req,res) => {
  try {
   
    const token = extractToken(req); 
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userid;
        const { blog_id } = req.body;

    pool.query(
      `UPDATE blog SET Title= ?, Description = ? , Image = ? WHERE blog_id = ?`,
      [Title, Description,Image,blog_id],
      (error, results) => {
        if (error) {
          console.error('Error updating your Blog:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(200).json({ message: 'Blog updated successfully' });
         
        }
      }
    );
  } catch (error) {
    console.error('Error updating your Blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { UpdateRouter, UpdateBlog };
