# 🎯 WEBLOG
- The Weblog Project is a frequently updated web page used for personal commentary or business content.

- This site allows Bloggers to share information, opinions, and updates on various topics.

- The users can also view  other people's posts and also they can post their own ideas on a particular topic.

## ER DIAGRAM
## ![ER DIAGRAM FOR BLOG](Visual_Assets/Blog_ERdiagram.png)

## USE-CASE DIAGRAM
## ![USE-CASE DIAGRAM FOR BLOG](Visual_Assets/Blog-Usecase.png)

- ### 1NF:
    - ✔ Each table has its own `primary key`

    - ✔ There is no '`atomic`'(indivisible) value

- ### 2NF:
    - ✔Follows 1NF.

    - ✔There is no partial `depencies`(no `primary key` determines some other attributes.)

- ### 3NF:
    - ✔Follows 3NF.

    - ✔There is no transitive `depencies`(no non-key attribute determines some other attribute).

- ### 4NF:
    - ✔ Follows 4NF.

    - ✔ No multi-valued `depencies`.

Since these all the four Normalisation are followed by our table,the table is in the normalisation form.

## `EXPLANATION`:
- This ER Diagram consists of the tables `User`,`Post`, `category`and `Feedback`.
- The `user table `consists of the details of the user.
- The `post table` consists of the details of the user's posts,
- The `category table ` consists of the information on the particular category the user has posted their ideas.
- The `Feedback table` consists of the comments provided by the users for the posts.

## API CALLS NEEDED
- SIGN UP:
    ### `Request`:

    - Name +  E-mail Id +  Password

    ### `Response`: 
    - Sucessfully signed-in 

- LOGIN:
    ### `Request`:
   - Email Id + password
   ### `Response`:
    - Sucessfull login message + jwt token

- My Post:
     ### `Request`:
    - jwt token(user id will be decoded form the token)
     ### `Response`:
    - posts of the corresponding user 

- Posts on particular category:
     ### `Request`:
    - category id
     ### `Response`:
     - posts corresponds to that particular category

- Likes:
    ### `Request`:
    - jwt token + post id
    ### `Response`:
     - Count of no.of likes for that posts increases.

- Feedback:
     ### `Request`:

    - jwt token + post id + Comments(Content)
    ### `Response`:
    - The provided comment will be added and will be displayed below that corresponding posts.

    

 ### `Intially all the post will be available in short`

- To see the full post:
     ### `Request`:
     - post id 
     ### `Response`:
    - the full post corresponds to that post id  will be fetched and displayed

- To see similar posts by the user:
     ### `Request`:
     - user id
     ### `Response`:
     - the post corresponds to that particular user id will be displayed 

- To Post a content:
    ### `Request`:

     - jwt token + Title + Description + category + image
     ### `Response`:
     - post added sucessully 

- Delete a post: 
    ### `Request`:
    - jwt token + post id
    ### `Response`:
    - post removed sucessfully

- Update post:
     ### `Request`:

	- post id + Title , Description , category , image
     ### `Response`:
    - post updated suceesully  


## `EXPLANATION:`

- If the user sends the request for loging in ,the user is able to login in only if the email id and the password matches to the one in the `user table `

- Similarly if the user want to see a post on particular category the user sends a request to the server for that particular category where the category id is fetched from the category table which corresponds to that particular catogory name and with that again the posts related are fetched from the post table.
