const gravatar = require('gravatar');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('node:crypto');

function getGravatarUrl(email) {
  return gravatar.url(email, { s: '250', d: 'retro', protocol: 'https' }); // You can customize size and default image
}

async function createAvatar(email) {
  const avatarURL = getGravatarUrl(email);
  const UNIQUE_SUFFIX = crypto.randomUUID();
  const avatarFileName = `gravatar_${UNIQUE_SUFFIX}.jpg`; // Unique file name
  const avatarPath = path.join(
    __dirname,
    '..',
    'public',
    'avatars',
    avatarFileName
  );

  const res = await fetch(avatarURL);
  const gravatarImageBuffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(avatarPath, gravatarImageBuffer);

  return avatarFileName;
}

module.exports = { getGravatarUrl, createAvatar };
