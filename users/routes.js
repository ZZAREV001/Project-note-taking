const router = require('express').Router();
const UserModel = require('./UserModel');

router.post('/login', (req, res, next) => {
    const newUser = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    newUser
       .save()
       .then((document) => {
           if(document) {
               document.password = undefined;
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

router.post('/register', (req, res, next) => {
    res.send('Register');
})

router.get('/:id', (req, res, next) => {
    UserModel
        .findById(req.params.id)
        .then((result) => {
            if (!result) {
                res.status(404)
                   .send("User not found");
            } else {
                result.password = undefined;   // Undefined type will hide the password 
                res.json(result);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error happened");
        })
})


module.exports = router;