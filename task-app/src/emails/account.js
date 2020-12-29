const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "kirillokeansky@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "kirillokeansky@gmail.com",
    subject: "Sad to see you go",
    text: `Bye-bye, ${name}. Please write your feedback of why are you leaving us.`,
  });
};

module.exports = { sendWelcomeEmail, sendCancellationEmail };
