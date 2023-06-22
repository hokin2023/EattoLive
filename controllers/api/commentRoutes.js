const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {

  try {
    const comment = await Comment.findAll({});
    res.status(200).json(comment);
    
  } catch (err) {
    res.status(400).json(err);
  }

});

router.post('/', withAuth, async (req, res) => {

  // check the session
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      place_id: req.body.place_id,
      // use the id from the session
      user_id: req.session.user_id,
    })
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});

  
  router.delete('/:id', withAuth, async (req, res) => {
      Comment.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(dbCommentData => {
            if (!dbCommentData) {
              res.status(404).json({ message: 'No comment found with this id' });
              return;
            }
            res.json(dbCommentData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
  });
  
  module.exports = router;

