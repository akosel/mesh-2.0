'use strict';

module.exports = {
  db: 'mongodb://localhost/mean-dev',
  app: {
    name: 'Mesherator'
  },
  facebook: {
    clientID: '486219411504844',
    clientSecret: 'b8102e713ede65bffd7cdbd0f34f9a99',
    callbackURL: 'http://local.aaronkosel.com:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: '9pX48MOGXJx2PlDi6GXPXozSX',
    clientSecret: 'OtR40G4NhtVhPfE1iC2rfoYt4am6Gotp6N9Ym59BifEOQn06ko',
    callbackURL: 'http://local.aaronkosel.com:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER',
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  }
};
