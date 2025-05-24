import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../server.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [posts] = await connection.query(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at, 
        p.updated_at,
        p.author_id,
        u.username as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `);
    
    connection.release();
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [posts] = await connection.query(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at, 
        p.updated_at,
        p.author_id,
        u.username as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    connection.release();
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(posts[0]);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/user
// @desc    Get posts by logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [posts] = await connection.query(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at, 
        p.updated_at,
        p.author_id,
        u.username as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id]);
    
    connection.release();
    res.json(posts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    const id = uuidv4();
    const connection = await pool.getConnection();
    
    await connection.query(
      'INSERT INTO posts (id, title, content, author_id) VALUES (?, ?, ?, ?)',
      [id, title, content, req.user.id]
    );
    
    const [posts] = await connection.query(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at, 
        p.updated_at,
        p.author_id,
        u.username as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `, [id]);
    
    connection.release();
    
    res.status(201).json(posts[0]);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this to your routes file

// @route   GET /api/posts/user/:userId
// @desc    Get posts by userId param (no auth needed or optional)
// @access  Public or Private depending on your design
router.get('/user/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [posts] = await connection.query(`
      SELECT 
        p.id, p.title, p.content, p.created_at, p.updated_at,
        p.author_id, u.username as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = ?
      ORDER BY p.created_at DESC
    `, [req.params.userId]);

    connection.release();
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts by userId:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    const connection = await pool.getConnection();
    
    // Check if post exists and belongs to the user
    const [posts] = await connection.query(
      'SELECT * FROM posts WHERE id = ?',
      [req.params.id]
    );
    
    if (posts.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (posts[0].author_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    // Update the post
    await connection.query(
      'UPDATE posts SET title = ?, content = ? WHERE id = ?',
      [title, content, req.params.id]
    );
    
    const [updatedPosts] = await connection.query(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at, 
        p.updated_at,
        p.author_id,
        u.username as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    connection.release();
    
    res.json(updatedPosts[0]);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Check if post exists and belongs to the user
    const [posts] = await connection.query(
      'SELECT * FROM posts WHERE id = ?',
      [req.params.id]
    );
    
    if (posts.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (posts[0].author_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    // Delete the post
    await connection.query(
      'DELETE FROM posts WHERE id = ?',
      [req.params.id]
    );
    
    connection.release();
    
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;