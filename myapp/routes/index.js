var express = require('express');
var app = express.Router();
const Web3 = require('web3');


/* GET home page. */
app.get('/', function (req, res, next) {
  res.send('respond with a resource');
});



app.get('/test', function (req, res, next) {
  Web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));
  Web3.eth.defaultAccount = Web3.eth.accounts[0]
  var loginAbi = require('../../build/contracts/Login.json').abi;
  console.log('loginABI', loginAbi)
  const LoginContract = Web3.eth.contract(loginAbi);
  console.log('loginnnncontraaaaaact', LoginContract)
  var loginContract = LoginContract.at('0x91dfecc6aa68f4e07c701284ebcb052f1f8845fc');
  var loginAttempt = loginContract.LoginAttempt();
  var challenges = {};
  var successfulLogins = {};
  console.log('loginAttempt', loginAttempt)
  loginAttempt.watch((error, event) => {
    console.log('in the eventtttttttttttttt')
    if (error) {
      console.log(error);
      return;
    }
    console.log('event', event);
    var sender = event.args.sender.toLowerCase();
    if (challenges[sender] === event.args.challenge) {
      successfulLogins[sender] = true;
      res.send('respond with a resource');
    }
  });
});


app.post('/login', (req, res) => {
  var jwt = require('jsonwebtoken');
  // All Ethereum addresses are 42 characters long
  if (!req.body.address || req.body.address.length !== 42) {
    res.sendStatus(400);
    return;
  }
  req.body.address = req.body.address.toLowerCase();
  const challenge = ".7475443aA";
  var challenges = {};
  challenges[req.body.address] = challenge;
  const token = jwt.sign({
    address: req.body.address,
    access: 'finishLogin'
  }, "secret");
  res.json({
    challenge: challenge,
    jwt: token
  });
});

app.post('/finishLogin', (req, res) => {
  if (!req.jwt || !req.jwt.address || req.jwt.access !== 'finishLogin') {
    res.sendStatus(400);
    return;
  }
  if (successfulLogins[req.jwt.address]) {
    delete successfulLogins[req.jwt.address];
    delete challenges[req.jwt.address];
    const token = jwt.sign({
      address: req.jwt.address,
      access: 'full'
    }, "secret");
    res.json({
      jwt: token,
      address: req.jwt.address
    });
  } else {
    // HTTP Accepted (not completed)
    res.sendStatus(202);
  }
});

app.post('/apiTest', (req, res) => {
  if (req.jwt.access !== 'full') {
    res.sendStatus(401); //Unauthorized
    return;
  }

  res.json({
    message: 'It works!'
  });
});

module.exports = app;
