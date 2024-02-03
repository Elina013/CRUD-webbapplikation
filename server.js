const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create User
app.post('/create-user', upload.single('image'), async (req, res) => {
  const { name, email, phone } = req.body;
  const image = req.file ? `uploads/${req.file.originalname}` : null;

  const newUser = await prisma.user.create({
    data: { name, email, phone, image },
  });

  res.json(newUser);
});

// Get all Users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Edit User
app.put('/edit-user/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, phone, image } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, email, phone, image },
  });

  res.json(updatedUser);
});

// Delete User
app.delete('/delete-user/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  await prisma.user.delete({ where: { id: userId } });

  res.json({ message: 'User deleted successfully' });
});

// Serve HTML page for creating a user
app.get('/create-user-page', (req, res) => {
  // Implement HTML rendering logic or use a templating engine
  res.sendFile(__dirname + '/create_user.html');
});

// Serve HTML page for viewing all users
app.get('/view-users-page', async (req, res) => {
  const users = await prisma.user.findMany();
  // Implement HTML rendering logic or use a templating engine to display user cards
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
