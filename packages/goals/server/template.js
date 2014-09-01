 'use strict';

module.exports = {
  goal_invite_email: function(goal, user, req, mailOptions) {
    mailOptions.html = [
      'Hi ' + user.name + ',',
      req.user.name + ' invited you to join a goal with them.',
      'Head down to your profile page to check it out.',
      'You can also go here http://thawing-earth-1562.herokuapp.com/goals/' + goal._id
    ].join('\n\n');
    mailOptions.subject = 'Invite';
    return mailOptions;
  }
};
