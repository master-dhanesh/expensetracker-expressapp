const { createClient } = require("redis");

const client = createClient({
    password: "ujsLqTP0tmz8BjD9tDiSShRhT95xi8xd",
    socket: {
        host: "redis-10316.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
        port: 10316,
    },
});

client.connect();

module.exports = client;
