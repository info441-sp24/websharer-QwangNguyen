import express from 'express';
var router = express.Router();


router.post('/', async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(401).json({
        status: "error",
        error: "not logged in"
      });
    }

    const { song, age, bio, animal } = req.body;
    const { username } = req.session.account.username;
    
    let userData = await req.models.User.findOne(username);
    if (userData) {
      if (song != "") userData.song = song;
      if (age != "") userData.age = age;
      if (bio != "") userData.bio = bio;
      if (animal != "") userData.animal = animal;
      await userData.save();
    } else {
      userData = new req.models.User({
        username: req.session.account.username,
        song,
        age,
        bio,
        animal
      });
      await userData.save();
    }

    res.json({ "status": "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    let username = req.query.username;
    
    if (!username) {
      return res.status(400).json({ "status": "error", "error": "Username is missing in the query parameters" });
    }

    const users = await req.models.User.find({"username": username});

    let userData= await Promise.all(
      users.map(async user => {
        try {
          return { username: user.username, song: user.song, age: user.age, bio: user.bio, animal: user.animal };
        } catch (error) {
          return { error: 'Error generating HTML preview: ' + error.message };
        }
      })
    );
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

export default router;