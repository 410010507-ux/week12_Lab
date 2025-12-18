db = db.getSiblingDB('week12');

db.createUser({
  user: 'week12-user',
  pwd: 'week12-pass',
  roles: [{ role: 'readWrite', db: 'week12' }]
});

db.createCollection('participants');
db.participants.createIndex({ email: 1 }, { unique: true });
db.participants.createIndex({ ownerId: 1 });

db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

db.users.insertOne({
  email: 'admin@example.com',
  passwordHash: '<<<$2b$10$n8knKRIT5OWYgf1P3vWo7u3lbn1QS3BDW.Wl5XT.7SRgqOw1ZW2GO>>',
  role: 'admin',
  createdAt: new Date()
});
