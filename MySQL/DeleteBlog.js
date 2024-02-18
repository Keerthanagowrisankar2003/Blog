const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const DeleteBlogRouter = express.Router();
const createPool = require('./Connection');

const pool = createPool();
const secretKey = 'dgshvslcfsihbglvioxbruidghisudlkiy';
DeleteBlogRouter.use(bodyParser.json());
DeleteBlogRouter.use(cors());

const deleteLikes =async (blog_id) => {
     await pool.query(`DELETE FROM likes WHERE blog_id = ?`, [blog_id], (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log('deletion sucess');
                
            }
        });
    };


const deleteFeedback = async (blog_id) => {
   
    await pool.query(`DELETE FROM feedback WHERE blog_id = ?`, [blog_id], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    
};

const deleteBlogRecord = async(blog_id, userId) => {
   
     await pool.query(
            `DELETE FROM blog WHERE blog_id = ? AND userid = ?`,
            [blog_id, userId],
            (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    
};

const DeleteBlog = async ( blog_id, req, res) => {
    try {
        const token = extractToken(req); 
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userid;
        const blog_id = req.body;
        console.log('delete likes ');
        

        var result = await deleteLikes(blog_id);
        console.log(result);
        await deleteFeedback(blog_id);
        await deleteBlogRecord(blog_id, userId);

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting Blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { DeleteBlogRouter, DeleteBlog };
