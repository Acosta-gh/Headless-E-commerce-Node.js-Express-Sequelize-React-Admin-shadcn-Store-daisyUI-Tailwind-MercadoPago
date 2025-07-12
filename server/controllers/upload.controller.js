const path = require('path');
const fs = require('fs');

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió archivo' });
  }
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
};

exports.deleteImage = (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Falta la URL de la imagen.' });

  const filename = url.split('/').pop();
  const filepath = path.join(__dirname, '..', 'uploads', filename);

  fs.unlink(filepath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json({ success: true, warning: 'La imagen ya no existe.' });
      } else {
        console.error('Error al borrar imagen:', err);
        return res.status(500).json({ error: 'No se pudo borrar la imagen.' });
      }
    }
    res.json({ success: true });
  });
};