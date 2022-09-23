const jwt = require('jsonwebtoken')

const secret = 'myCat';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInNjb3BlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NjE4NzE1OTZ9.ARjMYNOGHaKJWuqlLNycd-yVkT_ZnPevu3xiMEEMWaU'

function verifyToken(token, secret) {
  return jwt.verify(token, secret)
}

const payload = verifyToken(token, secret);
console.log(payload)
