const { createClient } = require("redis");

const client = createClient({
    password: "KEGmoCSouZLXISDacUQrKikxalwYEFXN",
    socket: {
        host: "redis-16955.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
        port: 16955,
    },
});

client.connect();

module.exports = client;
