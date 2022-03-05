const router = require('express').Router();
const UserModel = require('./UserModel');
const bcrypt = require('bcryptjs');

router.post('/register',
  registerInputValidation,
  isEmailRegistered,          // if inputs are valid and email not registered the middle below is executed (create new user)
  hashPassword,
  (req, res, next)=>{
    console.log(req.body.password)        // this line encrypts password
    const newUser = new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    })

    newUser
      .save()
      .then((document)=>{
        if(document){
          document.password = undefined
          res.json(document)
        }else{
          res.send('document did not save')
        }
      })
      .catch((err)=>{
        console.log(err)
        res.send('error happened')
      })
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

// Middleware for updated input validation:
const registerInputValidation = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const missingFields = []
    
    if (!firstName) {
        missingFields.push('firstName');
    }
    if (!lastName) {
        missingFields.push('lastName');
    }
    if (!email) {
        missingFields.push('email');
    }
    if (!password) {
        missingFields.push('password');
    }

    if (missingFields.length) {
        res.status(404)
           .send(`The following fields are missing: ${missingFields.join(', ')}`)
    } else {
        next()
    }
}

// Middleware for unique email validation:
const isEmailRegistered = (req, res, next) => {
    const email = req.body;
    UserModel.findOne({email})
        .then((result) => {
            if (result) {
                res.status(404)
                   .send(`${email} email is already registered`);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error happened');
        })
}

// Middleware for encrypt password:
const hashPassword = (req, res, next) => {
    const { password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {      // a salt is a random data (cryptography)
        bcrypt.hash(password, salt, (err, passwordHash) => {     // only the computer can decrypt the hash
            if (err) {
                res.status(500).send('err');
            } else {
                req.body.password = passwordHash;
                next();
            }
        })
    })
}


module.exports = router;