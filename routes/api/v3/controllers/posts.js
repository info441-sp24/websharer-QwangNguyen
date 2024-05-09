import express from 'express';
import getURLPreview from '../utils/urlPreviews.js';


var router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { url, description, likes } = req.body;

    const post = new req.models.Post({
        url,
        description,
        username: req.session.account.username,
        likes,
        created_date: new Date().toISOString()
    });

    await post.save();
    res.json({ "status": "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    let query = {};

    if (req.query.username) {
      query.username = req.query.username;
    }

    const posts = await req.models.Post.find(query);

    let postData = await Promise.all(
      posts.map(async post => {
        try {
          const htmlPreview = await getURLPreview(post.url);
          return { description: post.description, username: post.username, htmlPreview, id: post._id, likes: post.likes, url: post.url, created_date: post.created_date };
        } catch (error) {
          return { description: post.description, htmlPreview: 'Error generating HTML preview: ' + error.message };
        }
      })
    );
    res.json(postData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

router.post('/like', async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      res.status(401).json({
        status: "error",
        error: "not logged in"
      });
    }

    const { postID } = req.body;
    const post = await req.models.Post.findById(postID);

    if (!post) {
      return res.status(404).json({
        status: "error",
        error: "Post not found"
      });
    }

    if (!post.likes.includes(req.session.account.username)) {
      post.likes.push(req.session.account.username);
      await post.save();
    }

    res.json({ "status": "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

router.post('/unlike', async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      res.status(401).json({
        status: "error",
        error: "not logged in"
      });
    }

    const { postID } = req.body;
    const post = await req.models.Post.findById(postID);

    if (!post) {
      return res.status(404).json({
        status: "error",
        error: "Post not found"
      });
    }

    const userIndex = post.likes.indexOf(req.session.account.username);
    if (userIndex !== -1) {
      post.likes.splice(userIndex, 1);
      await post.save();
    }

    res.json({ "status": "success" });
  } catch(error) {
    console.error(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(401).json({
        status: "error",
        error: "not logged in"
      });
    }

    const { postID } = req.body;
    const post = await req.models.Post.findById(postID);

    if (!post) {
      return res.status(404).json({
        status: "error",
        error: "Post not found"
      });
    }

    if (post.username !== req.session.account.username) {
      return res.status(401).json({
        status: "error",
        error: "you can only delete your own posts"
      });
    }

    await req.models.Comment.deleteMany({ post: postID });
    await req.models.Post.deleteOne({ _id: postID });

    res.json({ "status": "success" });
  } catch(error) {
    console.error(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});


export default router;