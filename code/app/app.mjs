import express from 'express'
import connectionPool from './db.mjs'


(async () => {
  const r = await connectionPool.query(
    'select current_database(), inet_server_addr()'
  );
  console.log(r.rows);
})();

const app = express()
const port = 3002

app.use(express.json())

app.get('/posts', async (req, res) => {
    const result = await connectionPool.query(`SELECT * FROM posts`);
    res.status(200).json({message: 'Posts retrieved successfully', posts: result.rows});
})

app.post('/posts', async (req, res) => {


    const newPost = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
        published: new Date()
    };

const result = await connectionPool.query(
    `INSERT INTO posts (post_id, title, content, category, length, status, created_at, updated_at, published) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
        1,
        newPost.title,
        newPost.content,
        newPost.category,
        newPost.length,
        newPost.status,
        newPost.created_at,
        newPost.updated_at,
        newPost.published
    ]);

    res.send('Post created')

    return res.status(201).json({
         message: 'Post created successfully' 
    })
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})

