import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'posts');
const publicDir = path.join(process.cwd(), 'public');
const publicPostsDir = path.join(publicDir, 'posts');

// Media file extensions to copy
const mediaExtensions = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', // images
  '.mp4', '.webm', '.mov', '.avi', // videos
  '.mp3', '.wav', '.ogg', // audio
  '.pdf', '.zip', '.json', // documents
];

function isMediaFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return mediaExtensions.includes(ext);
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyMediaFiles(sourceDir, targetDir, relativePath = '') {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const relPath = path.join(relativePath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy media files from subdirectories
      copyMediaFiles(sourcePath, targetDir, relPath);
    } else if (entry.isFile() && isMediaFile(entry.name)) {
      // Copy media file to public/posts/[relative-path]
      const targetPath = path.join(targetDir, relPath);
      const targetDirectory = path.dirname(targetPath);
      
      ensureDirectoryExists(targetDirectory);
      
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${relPath}`);
    }
  }
}

function cleanPublicPostsDir() {
  if (fs.existsSync(publicPostsDir)) {
    fs.rmSync(publicPostsDir, { recursive: true, force: true });
  }
}

// Main execution
console.log('🔄 Copying media files from posts to public...');
cleanPublicPostsDir();
ensureDirectoryExists(publicPostsDir);
copyMediaFiles(postsDir, publicPostsDir);
console.log('✅ Media files copied successfully!');
