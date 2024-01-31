const Jimp = require('jimp');

async function resizeAvatar(req, res, next) {
  const imagePath = req.file.path;
  const targetWidth = 250;
  const targetHeight = 250;

  try {
    const image = await Jimp.read(imagePath);
    await image.resize(targetWidth, targetHeight).writeAsync(imagePath);
    next();
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
}

module.exports = resizeAvatar;
