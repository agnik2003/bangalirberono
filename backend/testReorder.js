const http = require('http');

async function testReorder() {
  const data = JSON.stringify({
    orderedIds: ["6ac370baed7b7adf120147d2", "6ac7827a6cd00907275ead0a", "6ac782f55c706fa8f137e6e4"]
  });

  const req = http.request('http://localhost:5000/api/packages/reorder/bulk', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      // Fake a cookie for auth if necessary, but wait, authMiddleware requires token.
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log('Response:', res.statusCode, body));
  });

  req.on('error', e => console.error(e));
  req.write(data);
  req.end();
}
testReorder();
