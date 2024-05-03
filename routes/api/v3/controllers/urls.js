import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.get('/preview', async function(req, res, next) {
  let url = req.query.url;
  try {
    let preview = await getURLPreview(url);
    res.send(preview);
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

export default router;