 'use strict';

module.exports = {
  goal_invite_email: function(goal, user, req, mailOptions) {
    mailOptions.html = [
      'Hi ' + user.name + ',',
      'You were invited to help someone out on one of their goals!',
      'Follow the link to see it',
      'http://' + req.headers.host + '/#!/goals/' + goal._id,
    ].join('\n\n');
    mailOptions.subject = 'Invite';
    return mailOptions;
  }
};
