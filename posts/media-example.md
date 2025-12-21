---
title: "Media Files Example"
date: "2025-12-21"
description: "Example of how to use media files in posts"
tags: ["example", "media"]
---

# Using Media Files

This post demonstrates how to use media files stored in the posts directory.

## Images

You can reference images using the `/posts/` path prefix:

![Test Image](/posts/test-image.png)

### Images in Subdirectories

For files in subdirectories like `posts/apps/app-icon.png`:

![App Icon](/posts/apps/app-icon.png)

### Using HTML for More Control

<img src="/posts/test-image.png" alt="Test Image" style="width: 30%;" />

## Notes

- Media files are automatically copied during build
- They do not appear in the sidebar navigation
- Only `.md` files are shown in the sidebar
