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
const bodyParser = require('body-parser');
const { LikeCountRouter, LikeCount } = require('./LikeCount');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

//Signup 
app.use('./Signup', SignupRouter);
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
app.use('./login', LoginRouter);
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
app.use('./AddBlog', AddBlogRouter);
app.post('/AddBlog', async (req, res) => {
  const {token,Title, category,Description ,Image} = req.body;
  try {
    const UserAddBlog = await AddBlog (token,Title, category,Description ,Image,req,res);
  } 
  catch (error) {
    return 
  }
});
//UpdateBlog
app.use('./UpdateBlog', UpdateRouter);
app.put('/UpdateBlog',  async (req, res) => {
  const {token,blog_id,Title,Description,Image} = req.body;
  try {
    const UpdateBlogs = await UpdateBlog (token,blog_id,Title,Description,Image,req,res);
   
  } 
  catch (error) {
    return 
  }
});
//DeleteBlog
app.use('./DeleteBlog', DeleteBlogRouter);
app.delete('/DeleteBlog',  async (req, res) => {
  const {token,blog_id } = req.body;
  try {
    const DeleteBlogs = await DeleteBlog (token,req,res,blog_id);
  }
  catch (error) {
    return 
  }
});
//AddFeedBack
app.use('./AddFeedback', AddFeedbackRouter);
app.post('/AddFeedback', async (req, res) => {
  const { token, blog_id,Name,feedback } = req.body;
  try {
    const AddFeedbacks = await AddFeedback(token,blog_id,Name, feedback, req, res);
  } catch (error) {
    return;
  }
});
//GetAllBlog
app.use('./GetAllBlog', GetAllBlogRouter);
app.get('/GetAllBlog',  async (req, res) => {
  try {
    const GetAllBlogs = await GetAllBlog (req,res);
   
  } 
  catch (error) {
    return 
  }
});
//Get Category on particular Blog
app.use('./GetBlogCategory', GetBlogCategoryRouter);
app.get('/GetBlogCategory',  async (req, res) => {
  const { token, category } = req.body;
  try {
    const GetAllcategories = await GetBlogCategory (req,res,token,category);
   
  } 
  catch (error) {
    return 
  }
});
//Get My Blog
app.use('./GetMyBlog', GetMyBlogRouter);
app.get('/GetMyBlog',  async (req, res) => {
  const { token } = req.body;
  try {
    const GetAllUser = await GetMyBlog (token,req,res);
   
  } 
  catch (error) {
    return 
  }
});
//Get Blog on particular user
app.use('./GetBlogUser', GetBlogUserRouter);
app.get('/GetBlogUser',  async (req, res) => {
  const { token ,blog_id} = req.body;
  try {
    const GetAllUser = await GetBlogUser (token,blog_id,req,res);
   
  } 
  catch (error) {
    return 
  }
});
//Count no.of likes for a blog
app.use('./LikeCount', LikeCountRouter);
app.post('/LikeCount',  async (req, res) => {
  const { token ,blog_id} = req.body;
  try {
    const CountLikes = await LikeCount (token,blog_id,req,res);
   
  } 
  catch (error) {
    return 
  }
});







app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});