const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: 'besababa.com@gmail.com',
      clientId: '400242408310-4j0hu2735smip3jhu24jckpi2aqa71dh.apps.googleusercontent.com',
      clientSecret: '3IfKHd6AYvVHtFuY6scd3VJn',
      refreshToken: ''
    })
  }
})


let mailOptions = {
  from: 'BeSababa <besababa.com@gmail.com>',
  to: 'fisher.eyal@gmail.com'
  subject: 'Ya Hashab',
  test: 'This mail is sent to you because you are HASAB!!!'
}

transporter.sendMail(mailOptions,(err,res) => {
  if(err){
    console.log('Error: ',err);
  }else{
    console.log('Email is sent');
  }
});
