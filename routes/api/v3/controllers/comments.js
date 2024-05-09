import express from 'express';

var router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Extract postID from the query parameter
    const { postID } = req.query;

    // Find all comments associated with the specified postID
    const comments = await req.models.Comment.find({ post: postID });

    // Return comments as JSON
    res.json(comments);
  } catch(error) {
    console.error(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { url, description, likes } = req.body;

    const post = new req.models.Post({
        id: req.body.id,
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

export default router;