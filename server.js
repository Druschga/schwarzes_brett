const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Speicher für Posts (PoC: in JSON-Datei)
const DATA_FILE = path.join(__dirname, 'data.json');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static('admin'));

// Helper: Posts lesen/schreiben
function readPosts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

function writePosts(posts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
}

// GET Posts (für Hauptseite)
app.get('/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// POST neuer Beitrag (Admin-Upload)
app.post('/posts', upload.single('pdf'), (req, res) => {
  const { title, content, priority } = req.body;
  const posts = readPosts();

  const newPost = {
    id: Date.now(),
    title,
    content,
    priority,
    date: new Date().toISOString().split('T')[0],
  };
  if (req.file) {
    newPost.pdfUrl = '/uploads/' + req.file.filename;
  }

  posts.push(newPost);
  writePosts(posts);

  res.json({ message: 'Beitrag erfolgreich hinzugefügt', post: newPost });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});