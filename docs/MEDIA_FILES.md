# Media Files in Posts

This repository supports storing media files (images, videos, etc.) alongside your markdown posts in the `/posts` directory. These files are automatically copied to the output during build and **will not appear in the sidebar navigation**.

## Supported File Types

The following file types are automatically processed:

### Images
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`

### Videos
- `.mp4`, `.webm`, `.mov`, `.avi`

### Audio
- `.mp3`, `.wav`, `.ogg`

### Documents
- `.pdf`, `.zip`, `.json`

## Usage

### 1. Add Media Files to Your Posts Directory

Simply place your media files in the `/posts` directory alongside your markdown files. You can organize them in subdirectories as needed:

```
posts/
├── index.md
├── my-image.png          # Root level media
├── apps/
│   ├── bikefollow.md
│   └── app-screenshot.png # Media in subdirectory
└── blog/
    ├── article.md
    └── article-banner.jpg
```

### 2. Reference Media Files in Markdown

Use relative paths from the `/posts` root to reference your media files:

```markdown
<!-- In posts/index.md -->
![My Image](/posts/my-image.png)

<!-- In posts/apps/bikefollow.md -->
![App Screenshot](/posts/apps/app-screenshot.png)

<!-- Or use HTML for more control -->
<img src="/posts/my-image.png" alt="My Image" style="width: 50%;" />
```

### 3. Build Process

The media files are automatically copied during the build process:

```bash
# Development
npm run dev

# Production build
npm run build
```

## How It Works

1. The `scripts/copy-post-assets.mjs` script scans the `/posts` directory
2. It finds all media files (non-.md files with supported extensions)
3. It copies them to `/public/posts/` maintaining the directory structure
4. Next.js includes them in the static export to `/out/posts/`
5. The sidebar only shows `.md` files, so media files are not listed

## Notes

- Media files are **not tracked** in the sidebar navigation
- Only markdown (`.md`) files appear in the sidebar
- The `/public/posts/` directory is auto-generated and should not be manually edited
- Media files are referenced with `/posts/` prefix in markdown
