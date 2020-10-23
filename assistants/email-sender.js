const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API
  }
}))
  

exports.sendAcceptEmail = (to, subject, token) => {
  transporter.sendMail({
    to: to, 
    from: process.env.EMAIL_SENDER,
    subject: subject,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@300&display=swap" rel="stylesheet">
        <style> 
          *{box-sizing: border-box;margin: 8%;}
          #body{
            width: 100%;
            height: auto;
            background-image:  linear-gradient(to bottom right, #e5edf0, #00ccff);
            font-family: 'Epilogue', sans-serif;
          }
          #link{
            text-decoration: none;
            font-size: 1rem;
            background-color: #111187;
            padding: 1%;
            border-radius: 1vh;
            color: #eee;
          }
          #h1{font-size: 1.3rem;color: #111;margin-top: 5%}
          #h2{font-size: 1.1rem;color: #113;font-weight: 900;}
          #linkarea{text-align: center;}
          #p{font-size: 1.1rem;color: #333;font-weight: 700;}
        </style>
    </head>
    <body id="body">
        <h1 id="h1">You just created an account at Toodoodoo!&#128526;</h1>
        <h2 id="h2">About Toodoodoo&#128540;</h2>
        <p id="p">Toodoodoo is online platform that allows you to create todos and share them with your friends and others, toodoodoo also allows you communicate with everyone&#128519;</p>
        <div id="linkarea">
          <h3>Cannot wait to get started?&#129488;</h3>
          <a id="link" href="http://localhost:3000/acceptemail/${token}">tap to complete your registration!&#128591;</a>
        </div>
    </body>
    <script>
    </script>
    </html>`
  })
}

exports.resetPasswordEmail = (to, subject, token) => {
  transporter.sendMail({
    to: to, 
    from: process.env.EMAIL_SENDER,
    subject: subject,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@300&display=swap" rel="stylesheet">
        <style> 
          *{box-sizing: border-box;margin: 8%;}
          #body{
            width: 100%;
            height: auto;
            background-image:  linear-gradient(to bottom right, #e5edf0, #aaccff);
            font-family: 'Epilogue', sans-serif;
          }
          #link{
            text-decoration: none;
            font-size: 1rem;
            background-color: #111187;
            padding: 2% 3%;
            border-radius: 2vh;
            color: #eee;
          }
          #h1{font-size: 1.3rem;color: #111;margin-top: 5%}
          #linkarea{text-align: center;}
        </style>
    </head>
    <body id="body">
        <h1 id="h1">You requested password reset&#128640;</h1>
        <div id="linkarea">
          <h3>To reset password follow the link below&#128521;</h3>
          <a id="link" href="http://localhost:3000/resetpassword/${token}">reset password!&#129505;</a>
        </div>
    </body>
    <script>
    </script>
    </html>`
  })
}