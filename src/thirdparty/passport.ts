import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import secrets from 'utils/secrets';

import User from 'context/auth/schema/user';

// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secrets.sessionSecret,
};

// Create JWT strategy
// payload: decoded jwt token
// done: callback function
const jwtLogin = new JwtStrategy(jwtOptions, (payload: any, done: any) => {
  User.findById(payload.sub, (err: any, user: any) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  });
});

passport.use(jwtLogin);
