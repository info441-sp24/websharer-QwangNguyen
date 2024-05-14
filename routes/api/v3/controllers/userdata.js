import express from 'express';
var router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { song, age, bio, animal } = req.body;

    const userData = new req.models.User({
      username: req.session.account.username,
      song,
      age,
      bio,
      animal
    });

    await userData.save();
    res.json({ "status": "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "status": "error", "error": error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    let username = req.session.account.username;
    const users = await req.models.User.find(username);

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