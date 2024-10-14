const captchaRouter = require('express').Router();

captchaRouter.post('/', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    res.status(400).send('Invalid request body');
    return;
  }

  console.log(token);

  try {
    const captchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.CAPTCHA_SECRET}&response=${token}`,
      }
    );

    const responseAsJson = await captchaResponse.json();
    console.log(responseAsJson);
    if (responseAsJson.success) {
      res.status(200).send(true);
      return;
    } else {
      res.status(401).send(false);
      return;
    }
  } catch (error) {
    res.status(500).send('Error validating captcha');
    console.log(error);
  }
});

module.exports = captchaRouter;