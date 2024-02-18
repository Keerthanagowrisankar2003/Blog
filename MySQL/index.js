const express = require('express');
const {SignupRouter, Signup} = require('./Signup');
const {LoginRouter, login} = require('./Login');
const {AddBlogRouter, AddBlog} = require('./AddBlog');
const {UpdateRouter, UpdateBlog} = require('./UpdateBlog');
const { DeleteBlogRouter, DeleteBlog } = require('./DeleteBlog');
const { AddFeedbackRouter, AddFeedback } = require('./AddFeedBack');
const { GetAllBlogRouter,GetAllBlog } = require('./GetAllBlogs');
const { GetBlogCategoryRouter,GetBlogCategory } = require('./GetBlogCategory');
const { GetMyBlogRouter, GetMyBlog } = require('./GetMyBlog');
const { GetBlogUserRouter, GetBlogUser } = require('./GetBlogUser');
const { router7, SearchItem} = require('./SearchBlog');
const { FullBlogRouter, FullBlog} = require('./GetFullBlog');
var bodyParser = require('body-parser');
const { LikeCountRouter, LikeCount } = require('./LikeCount');
const importDependencies = require('./Imports');
const { GetFeedbackRouter, GetFeedback } = require('./GetFeedback');
const { cors} = importDependencies();

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

//Signup 
app.use('/Signup', SignupRouter);
app.post('/Signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const SignupUser = await Signup (firstname, lastname,email, password,res); 
  }
   catch (error) {
    return 
  }
});
//login
app.use('/login', LoginRouter);
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginUser = await login (email, password,res);
   // res.status(200).json({ message: login });
  } 
  catch (error) {
   // res.status(401).json({ error }\
    return 
  }
});
//AddBlog
app.use( bodyParser.json({limit: '50mb'}) );
app.use('/AddBlog', AddBlogRouter);
app.post('/Blog', async (req, res) => {
  const {Title, category,Description ,ImageLink} = req.body;
  try {
    const UserAddBlog = await AddBlog (Title, category,Description ,ImageLink,req,res);
    
  } 
  catch (error) {
    return 
  }
});
//UpdateBlog
app.use('/UpdateBlog', UpdateRouter);
app.put('/UpdateBlog',  async (req, res) => {
  const {token,blog_id,Title,Description,Image} = req.body;
  try {
    const UpdateBlogs = await UpdateBlog (blog_id,Title,Description,Image,req,res);
   
  } 
  catch (error) {
    return 
  }
});
//DeleteBlog
app.use('/DeleteBlog', DeleteBlogRouter);
app.options('*', cors());
app.post('/DeleteBlog',  async (req, res) => {
   const {blog_id } = req.body;
   console.log('deletion request');
  try {
    const DeleteBlogs = await DeleteBlog (blog_id,req,res);
    console.log('request recieved for deletion ');
  }
  catch (error) {
    console.error('Error handling deletion request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//AddFeedBack
app.use('/AddFeedback', AddFeedbackRouter);
app.post('/Feedback', async (req, res) => {
  const { token, blog_id,Name,feedback } = req.body;
  try {
    const AddFeedbacks = await AddFeedback(blog_id,Name, feedback, req, res);
  } catch (error) {
    return;
  }
});
//GetAllBlog
app.use('/GetAllBlog', GetAllBlogRouter);
app.get('/AllBlog', async (req, res) => {
  try {
    const blogs = await GetAllBlog(req, res);
    
  } catch (error) {
    return
  }
});
//Get Category on particular Blog
app.use('/GetBlogCategory', GetBlogCategoryRouter);
app.post('/BlogCategory',  async (req, res) => {
  const { category } = req.body;
  try {
    const GetAllcategories = await GetBlogCategory (req,res,category);
   
  } 
  catch (error) {
    return 
  }
});
//Get My Blog
app.use('/GetMyBlog', GetMyBlogRouter);
app.get('/MyBlog',  async (req, res) => {
  
  try {
    const GetAllUser = await GetMyBlog (req,res);
   
  } 
  catch (error) {
    return 
  }
});
//Get Blog on particular user
app.use(cors());
app.use('/BlogUser', GetBlogUserRouter);
app.post('/BlogUser',  async (req, res) => {
  const { blog_id,token} = req.body;
  try {
    const GetAllUser = await GetBlogUser (req,res,token,blog_id);
   
  } 
  catch (error) {
    return 
  }
});
//Count no.of likes for a blog
app.use('/LikeCount', LikeCountRouter);
app.post('/LikeCount',  async (req, res) => {
  const {blog_id} = req.body;
  try {
    const CountLikes = await LikeCount (blog_id,req,res);
   
  } 
  catch (error) {
    return 
  }
});
//Search Item
app.use('/SearchBlog', router7);
app.post('/SearchBlog',  async (req, res) => {
  const {searchQuery } = req.body;
  try {
    const SearchItems = await SearchItem (req,res,searchQuery);
   
  }
   catch (error) { 
    return 
  }
});
///FullBlog
//Search Item
app.use('/FullBlog', FullBlogRouter);
app.post('/FullBlog',  async (req, res) => {
  const {blog_id ,token} = req.body;
  try {
    const EntireBlogs= await FullBlog (req,res,token,blog_id);
   
  }
   catch (error) { 
    return 
  }
});
//GetFeedbacks 
app.use('/GetFeedback', GetFeedbackRouter);
app.post('/GetFeedback',  async (req, res) => {
  const {blog_id ,token} = req.body;
  try {
    const FeedbackBlogs= await GetFeedback (req,res,token,blog_id);
   
  }
   catch (error) { 
    return 
  }
});







app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});