const options = process.env.NODE_ENV === "production" ? {
    client: 'pg',
    connection: process.env.DATABASE_URL, searchPath: ['public']
} : {
    client: 'pg',
    connection: {
        host: 'localhost',
        database: 'portfolio' // change
    }
};
const knex = require("knex")(options);

module.exports = knex;