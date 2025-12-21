# TREE ENTERTAINMENT Official Website

This is the official website for TREE ENTERTAINMENT built with Next.js.

## Features

- ✅ Markdown-based content management
- ✅ Support for images, videos, and other media files in posts
- ✅ Automatic sidebar navigation (shows only posts, not media files)
- ✅ Static site generation
- ✅ Tag-based content organization

## Adding Media Files to Posts

You can place images, videos, and other media files directly in the `/posts` directory alongside your markdown files. These files will be automatically copied during build but **will not appear in the sidebar**.

For detailed information, see [Media Files Documentation](./docs/MEDIA_FILES.md).

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The built site will be in the `/out` directory.
