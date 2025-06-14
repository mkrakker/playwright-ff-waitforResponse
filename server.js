const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Custom-Header',
	);
	res.header('Access-Control-Max-Age', '86400');

	if (req.method === 'OPTIONS') {
		res.status(204).end();
		return;
	}

	next();
});

app.use(express.json());

app.post('/api/test', (req, res) => {
	res.status(204).end();
});

app.listen(PORT, () => {
	console.log(`Test server running on http://localhost:${PORT}`);
});
