module.exports = {
  rpc: {
  host:"localhost",
  port:8545
  },
  networks: {
  development: {
  host: "localhost",
  port: 8545, // port where your blockchain is running 
  network_id: "*",
  from: "0x4D92e119e48BE57d41811e74992cacE32Fc687De",
  gas: 1800000
  }
  }
  };