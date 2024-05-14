import express from 'express';
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

export default router;