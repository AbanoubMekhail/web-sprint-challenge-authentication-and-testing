const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig')

// Write your tests here
// test('sanity', () => {
//   expect(true).toBe(false)
// })

describe('GET /', () => {
  it('has process.env.NODE_ENV as "testing"', () => {
    expect(process.env.NODE_ENV).toBe('testing')
  })
})

beforeAll(async () =>{
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()

})

describe('[POST] /api/auth/register', () =>{
  it('register a new user', async () => {
    const newUser = {username: 'testUser', password: 'testPass'}
    const response = await request(server)
    .post('/api/auth/register')
    .send(newUser)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('username', newUser.username)
    expect(response.body).toHaveProperty('password')
  })
  it('return 400 if username or password are missing', async () => {
    const response = await request(server)
    .post('/api/auth/register')
    .send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'username and password required')
  })
  it('return 409 if username exists in db', async () => {
    const existingUser = {username: 'testUser', password: 'testPass'}

    const response1 = await request(server) 
    .post('/api/auth/register')
    .send(existingUser)

    const response2 = await request(server)
    .post('/api/auth/register')
    .send(existingUser)


    expect(response2.status).toBe(409)
    expect(response2.body).toHaveProperty('message', 'username taken')
  })
})

describe('[POST] /api/auth/login', () => {
  it('logs in an existing user', async () => {
    const existingUser = {username: 'testUser', password: 'testPass'}

    await request(server)
    .post('/api/auth/register')
    .send(existingUser);

    const response = await request(server)
    .post('/api/auth/login')
    .send(existingUser)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message', `Welcome, ${existingUser.username}`)
    expect(response.body).toHaveProperty('token')
  })
  it('returns 400 if username or password are missing', async () => {
    const response = await request(server)
    .post('/api/auth/login')
    .send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'username and password required')
  })

  it('returns status of 401 if username or password are incorrect', async () => {
    const nonExistingUser = {username: 'nonExistingUser', password: 'testPass'}
    const response = await request(server)
    .post('/api/auth/login')
    .send(nonExistingUser)

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message', 'invalid credentials')
  })
})