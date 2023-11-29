const server = require('./server');
const request = require('supertest');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(false)
})

describe('GET /', () => {
  it('has process.env.NODE_ENV as "testing"', () => {
    expect(process.env.NODE_ENV).toBe('testing')
  })
})