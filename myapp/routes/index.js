var express = require('express');
var app = express();
const Web3 = require('web3');

app.set('view engine', 'ejs');
/* GET home page. */
app.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


var jwt = require('jsonwebtoken');
var ethUtil = require('ethereumjs-util');
app.get('/hello', function(req, res) {
  res.render('pages/hello');
});

app.post('/works', (req, res) => {
  var sig = req.body.sig;
  var owner = req.body.owner;
  owner = owner.toLowerCase();
  // Same data as before
  var data = req.body.data;
  console.log(sig,owner,data);
  var message = ethUtil.toBuffer(data)
  var msgHash = ethUtil.hashPersonalMessage(message)
  // Get the address of whoever signed this message  
  var signature = ethUtil.toBuffer(sig)
  var sigParams = ethUtil.fromRpcSig(signature)
  var publicKey = ethUtil.ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s)
  var sender = ethUtil.publicToAddress(publicKey)
  var addr = ethUtil.bufferToHex(sender)
 
  // Determine if it is the same address as 'owner' 
  var match = false;
  console.log("addr",addr);
  console.log("owner",owner);
  if (addr === owner) { match = true; }
  if (match) {
    var token = jwt.sign({user: req.body.addr}, 'secret',  { expiresIn: '1d' });
    res.send(200, { success: 1, token: token })
  } else {
    // If the signature doesn’t match, error out
    res.send(500, { err: 'Signature did not match.'});
  }
});

function show(){
  alert('clicked');
  
}

module.exports = app;