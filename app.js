app.post('/login', (req, res) => {
    // All Ethereum addresses are 42 characters long
    if (!req.body.address || req.body.address.length !== 42) {
    res.sendStatus(400);
    return;
}

req.body.address = req.body.address.toLowerCase();
const challenge = cuid();
challenges[req.body.address] = challenge;
const token = jwt.sign({
    address: req.body.address,
    access: 'finishLogin'
}, secret);
res.json({
    challenge: challenge,
    jwt: token
});
    });

app.post('/finishLogin', validateJwt, (req, res) => {
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
    }, secret);
    res.json({
        jwt: token,
        address: req.jwt.address
    });
} else {
    // HTTP Accepted (not completed)
    res.sendStatus(202);
}
    });

app.post('/apiTest', validateJwt, (req, res) => {
    if (req.jwt.access !== 'full') {
    res.sendStatus(401); //Unauthorized
    return;
}

res.json({
    message: 'It works!'
});  
    });


