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
            font-family: sans-serif;
            background-color: #333;
          }
          #link{
            text-decoration: none;
            font-size: 1.5rem;
            border: solid 2px #3377ff;
            color: #3377ff;
            padding: .5rem 1rem;
            border-radius: 4rem;
            transition: all .5s;
          }
          #link:hover{
            background-color: #3377ff;
            color: #eff;
          }
          h1{
            color: #eff;
            font-weight: 400;
            font-size: 1.3rem;
          }
        </style>
      </head>
      <body id="body">
        <h1>You just created an account at IDiary.netlify.app.com</h1>
        <div id="linkarea">
          <a id="link" href="https://idiary.netlify.app/acceptemail/${token}">tap here to complete</a> 
        </div>
      </body>
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
            font-family: sans-serif;
            background-color: #333;
          }
          #link{
            text-decoration: none;
            font-size: 1.5rem;
            border: solid 2px #3377ff;
            color: #3377ff;
            padding: .5rem 1rem;
            border-radius: 4rem;
            transition: all .5s;
          }
          #link:hover{
            background-color: #3377ff;
            color: #eff;
          }
          h1{
            color: #eff;
            font-weight: 400;
            font-size: 1.3rem;
          }
        </style>
    </head>
    <body id="body">
        <h1 id="h1">You had requested password reset</h1>
        <div id="linkarea">
          <a id="link" href="https://idiary.netlify.app/resetpassword/${token}">reset password</a>
        </div>
    </body>
    <script>
    </script>
    </html>`
  })
}