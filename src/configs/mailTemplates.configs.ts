export function VerificationMail(code: string) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        background-color: #f4f7fe;
        text-align: center;
        padding: 40px 0;
      }
      .container {
        text-align: center;
        max-width: 400px;
        margin: 0 auto;
        padding: 15px 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      }
      .title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0 10px 0;
        color: #000000;
      }
      .subtitle {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.5);
      }
      .verification-text {
        text-align: center;
        font-size: 20px;
        font-weight: 500;
        color: #000000;
        margin: 20px auto 50px auto;
      }
      .code-box {
        width: max-content;
        text-align: center;
        background-color: #4318ff;
        border-radius: 10px;
        margin: 20px auto;
        padding: 5px 50px;
      }
      .code {
        text-align: center;
        font-size: 40px;
        font-weight: bold;
        color: #ffffff;
        letter-spacing: 5px;
        height: fit-content;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 class="title">EasyForm</h1>
      <p class="subtitle">make your form easy as possible</p>
      <p class="verification-text">Your Email Verification Code</p>
      <div class="code-box">
        <p class="code">${code}</p>
      </div>
    </div>
  </body>
</html>
`;
}
