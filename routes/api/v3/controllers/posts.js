import express from 'express';
import getURLPreview from '../utils/urlPreviews.js';


var router = express.Router();

router.post('/', async (req, res) => {
  try {
      const { url, description } = req.body;

      const post = new req.models.Post({
          url,
          description,
          username: req.session.account.username,
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
    let query = {}; // Default query

    if (req.query.username) {
      // If the username query parameter is provided, filter posts by username
      query.username = req.query.username;
    }

    const posts = await req.models.Post.find(query);

    // Generate HTML previews for each URL
    let postData = await Promise.all(
      posts.map(async post => {
        try {
          // Generate HTML preview using the getURLPreview function
          const htmlPreview = await getURLPreview(post.url);
          // Return information about the post
          return { description: post.description, username: post.username, htmlPreview };
        } catch (error) {
          // If generating the HTML preview has an error, put the error text in the htmlPreview field
          return { description: post.description, htmlPreview: 'Error generating HTML preview: ' + error.message };
        }
      })
    );

    res.json(postData);
  } catch (error) {
    // If there was an error, log it, then return JSON with status set to "error"
    console.log(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

export default router;