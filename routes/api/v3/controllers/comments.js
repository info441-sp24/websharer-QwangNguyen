import express from 'express';

var router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { postID } = req.query;
    const comments = await req.models.Comment.find({ post: postID });
    res.json(comments);
  } catch(error) {
    console.error(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(401).json({
        status: "error",
        error: "not logged in"
      });
    }
    const { newComment, postID } = req.body;

    const comment = new req.models.Comment({
        username: req.session.account.username,
        comment: newComment,
        post: postID,
        created_date: new Date().toISOString()
    });

    await comment.save();
    res.json({ "status": "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

export default router;