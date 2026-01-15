const { Client } = require('pg');
const client = new Client({
    connectionString: "postgresql://ugrhstjtrkltrdjzxfan:gIrklBQZIZouUK9wzvOsbfgIHS5EK6@b9llmurloofrvdch5tai-postgresql.services.clever-cloud.com:50013/b9llmurloofrvdch5tai?sslmode=require",
});

async function test() {
    try {
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected successfully!");
        const res = await client.query('SELECT NOW()');
        console.log("Current time from DB:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}

test();
