const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash('error');
  if(errorMessage.length) {
    errorMessage = errorMessage[0]
  } else {
    errorMessage = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash('error');
  if(errorMessage.length) {
    errorMessage = errorMessage[0]
  } else {
    errorMessage = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage
  });
};

exports.postLogin = (req, res, next) => {
  const {email, password} = req.body;
  User.findOne({email})
    .then(user => {
      if(!user) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(matched => {
          if(matched) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch(err => {
          return res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const {email, password, confirmPassword} = req.body;
  User.findOne({email}).then(userResp => {
    if(userResp) {
      req.flash('error', 'Email exists. Pls use different email or login.');
      return res.redirect('/signup');
    }
    return bcrypt.hash(password, 12).then(hashedPass => {
      const user = new User({
        email,
        password: hashedPass,
        cart: { items: []}
      });
      return user.save();
    }).then(result => {
      res.redirect('/login');
    });
  }).catch(err => {
    console.log('user err', err);
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
