posts:
	json-server external_api/users.json -p 3001 --delay 500
comments:
	json-server external_api/reviews.json -p 3002 --delay 500
users:
	json-server external_api/users.json -p 3003 --delay 500
