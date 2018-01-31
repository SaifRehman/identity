var Login = artifacts.require("./contracts/Login.sol");
module.exports = function(deployer) {
deployer.deploy(Login);
};