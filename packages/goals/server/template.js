 'use strict';

module.exports = {
  goal_invite_email: function(goal, user, req, token, mailOptions) {
    mailOptions.html = [
      'Hi ' + goal.user.name + ',',
      'We have received a request to reset the password for your account.',
      'If you made this request, please click on the link below or paste this into your browser to complete the process:',
      'http://' + req.headers.host + '/#!/goals/' + goal._id,
      'This link will work for 1 hour or until your password is reset.',
      'If you did not ask to change your password, please ignore this email and your account will remain unchanged.'
    ].join('\n\n');
    mailOptions.subject = 'Invite';
    return mailOptions;
  }
};
