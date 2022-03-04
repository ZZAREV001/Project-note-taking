const router = require('express').Router();
const NoteModel = require('./model');   // import note model

// Get all notes (model: promise + callback with if-else + exception error catching)
router.get('/', (req, res, next) => {
    NoteModel.find()
      .then((results) => {
          if (!results) {
              res.status(404).send('No notes found');
          } else {
              res.json(results);
          }
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error happened');
      })
})

// Get single note (same model but we find by id)
router.get('/:id', (req, res, next) => {
    NoteModel.findById(req.params.id)
      .then((results) => {
          if (!results) {
              res.status(404).send('No note found');
          } else {
              res.json(results);
          }
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error happened');
      })
})

// Create
router.post('/login', inputValidation, (req, res, next) => {
    const newNote = new NoteModel({
        title: req.body.title,
        body: req.body.body
    });

    newNote
       .save()
       .then((document) => {
           if(document) {
            res.json(document);
           } else {
               res.send('document did not save');
           }
       })
       .catch((err) => {
           console.log(err);
           res.send('error happened');
       })
    
})

// Update (same model but with find one and update method).
// Add validation logic when input is entered in order to see if it is correct in a helper method (here updateInputValidation middleware). )
router.put('/:id', updateInputValidation, (req, res, next) => {
    // Indicate in parameters what do we want to update
    NoteModel.findOneAndUpdate({_id: req.params.id},
                                req.updateObj,
                                {new: true})  // show the new result
      .then((results) => {
          if (!results) {
              res.status(404).send('No note found');
          } else {
              res.json(results);   // return the result of the update as json  
          }
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error happened');
      })
})

// Delete (same model but with find one and remove method)
router.delete('/', (req, res, next) => {
    NoteModel.findOneAndRemove(req.params.id)
      .then((results) => {
          if (!results) {
              res.status(404).send('No note found');
          } else {
              res.send("successfully deleted");  // do not send JSON but a message for confirm deletion
          }
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error happened');
      })
})

// Exception for bad inputs (middleware):
const inputValidation = (req, res, next) => {
    const {title, body} = req.body;
    const missingFields = [];

    if (!title) {
        missingFields.push('title');
    }

    if (!body) {
        missingFields.push('body');
    }

    if (missingFields.length) {
        res
           .status(400)
           .send(`The following fields are missing: ${missingFields.joint(', ')}`);
    } else {
        next();
    }
}

// Middleware for updated input validation:
const updateInputValidation = (req, res, next) => {
    const { title, body } = req.body;
    const updateObj = {};
    // updateObj only have information about that is passed and nothing else
    if (title) {
        updateObj.title = title;
    }
    if (body) {
        updateObj.body = body;
    }

    req.updateObj = updateObj;
    next();
}

module.exports = router;
