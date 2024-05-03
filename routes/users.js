import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Check if the user is authenticated
  if (req.session.isAuthenticated) {
      // User is logged in, retrieve user information from session
      const { name, username } = req.session.account;
      res.json({
          status: "loggedin",
          userInfo: { name, username }
      });
  } else {
      // User is not logged in, return loggedout status
      res.json({ status: "loggedout" });
  }
});

export default router;
