
const db = require('../data/dbConfig')

function findBy(filter) {
    return db('users').where(filter);
}

function add(user) {
    return db('users').insert(user, 'id').then(([id]) => id);
}

module.exports = {
    findBy,
    add
}