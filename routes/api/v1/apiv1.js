import express from 'express';
import fetch from 'node-fetch'
import parser from 'node-html-parser'
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Welcome to API v1');
});

router.get('/urls/preview', async function(req, res, next) {
  let url = req.query.url;
  try {
    let response = await fetch(url)
    let pageText = await response.text()
    let htmlPage = parser.parse(pageText)

    let metaTags = htmlPage.querySelectorAll('meta[property^="og:"]');
        
    let ogUrl = url;
    let ogTitle = url;
    let ogImage = '';
    let ogDescription = '';
    let ogSite_Name = '';

    metaTags.forEach(tag => {
      const property = tag.getAttribute('property');
      const content = tag.getAttribute('content');
  
      if (property === 'og:url') {
        ogUrl = content;
      }
      if (property === 'og:title') {
        ogTitle = content;
      }
      if (property === 'og:image') {
        ogImage = content;
      }
      if (property === 'og:description') {
        ogDescription = content;
      }
      if (property === 'og:site_name') {
        ogSite_Name = content;
      }
    });

    if (ogTitle === url) {
        let titleTag = htmlPage.querySelector('title');
        if (titleTag) {
            ogTitle = titleTag.text.trim();
        }
    }

    let htmlString = `
    <div class="preview-container">
        <div class="preview-box"> 
            <a href="${ogUrl}">
                <p class="preview-title"><strong>${ogTitle}</strong></p>
                <img class="preview-image" src="${ogImage}">
    `;

    if (ogDescription) {
        htmlString += `
            <p class="preview-description">${ogDescription}</p>
        `;
    }

    if (ogSite_Name) {
        htmlString += `
            <p class="preview-site">${ogSite_Name}</p>
        `;
    }

    htmlString += `
                    </a>
                </div>
            </div>
    `;

    res.send(htmlString);
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

export default router;