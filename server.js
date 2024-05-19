const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const reminders = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/reminder', (req, res) => {
  const { message, time, emailIds } = req.body;
  const reminderId = Date.now().toString();
  const reminder = { message, time, emailIds, sent: false };
  reminders[reminderId] = reminder;
  scheduleReminder(reminderId, reminder);
  res.send('Reminder set');
});


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajataj1234@gmail.com',
    pass: 'ettk dgkc fhdu pjtr'
  }
});

function sendEmailReminder(reminder) {
  const mailOptions = {
    from: 'rajataj1234@gmail.com',
    to: reminder.emailIds ? reminder.emailIds.join(', ') : '',
    subject: 'Reminder',
    text: `Reminder: ${reminder.message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


function scheduleReminder(reminderId, reminder) {
  const now = new Date();
  const time = new Date(reminder.time);
  const delay = time - now;

  setTimeout(() => {
    console.log(`Sending reminder: ${reminder.message}`);
    // Here you would send the reminder, for example by email or a push notification
    sendEmailReminder(reminder);
    reminders[reminderId].sent = true;
  }, delay);
}

app.listen(3000, () => {
  console.log('Reminder app listening on port 3000!');
});