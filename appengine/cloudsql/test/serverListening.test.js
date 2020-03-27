const supertest = require('supertest');
const path = require('path');
const app = require(path.join(__dirname, '../', 'server.js'));

after(function() {
  process.exitCode(0);
})

it('should be listening', async () => {
  await supertest(app).get('/').expect(200)
});
