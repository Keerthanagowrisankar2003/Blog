const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const AddBlogRouter = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'blog_database',
    connectionLimit: 10,
});

AddBlogRouter.use(bodyParser.json({ limit: '100mb' }));
AddBlogRouter.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 5000000 }));
AddBlogRouter.use(cors());

const secretKey = 'dgshvslcfsihbglvioxbruidghisudlkiy';

const AddBlog = async (Title, category, Description, ImageLink, req, res) => {
  const token = extractToken(req);

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;

    // Check if the user exists
    const [userResult] = await pool.promise().query('SELECT * FROM user WHERE userid = ?', [userId]);

    if (userResult.length === 0) {
      res.status(400).json({ error: 'User does not exist' });
      return;
    }

    // Check if the category exists for the given user
    const [categoryResult] = await pool.promise().query(
      `SELECT * FROM blog_category WHERE category = ? AND userid = ?`,
      [category, userId]
    );

    let categoryId;

    if (categoryResult.length > 0) {
      categoryId = categoryResult[0].categoryid;
    } else {
      const [insertResult] = await pool.promise().query(
        `INSERT INTO blog_category (userid,category) VALUES (?,?)`,
        [userId, category]
      );
      categoryId = insertResult.insertId;
    }

    // Insert Blog into the blog table with the correct userId and categoryId
    await pool.promise().query(
      `INSERT INTO blog(userid, Title, Description, categoryid, Image) VALUES (?, ?, ?, ?, ?)`,
      [userId, Title, Description, categoryId, ImageLink]
    );

    res.status(201).json({ message: 'Blog added successfully' });
  } catch (error) {
    console.error('Error adding Blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { AddBlogRouter, AddBlog };
