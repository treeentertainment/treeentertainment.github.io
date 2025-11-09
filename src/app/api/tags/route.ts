import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

const postsDir = path.join(process.cwd(), "posts");

function getAllMarkdownFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries.flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? getAllMarkdownFiles(fullPath) : [fullPath];
    });
    return files.filter((f) => f.endsWith(".md"));
}

function parseTags(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value
            .map((t) => (typeof t === "string" ? t.trim() : ""))
            .filter(Boolean);
    }
    if (typeof value === "string") {
        return value
            .split(/[,;]+/)
            .map((t) => t.trim())
            .filter(Boolean);
    }
    return [];
}

function slugify(key: string) {
    return key
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export async function GET() {
    const files = getAllMarkdownFiles(postsDir);
    const tagCount: Record<string, number> = {};
    const displayName: Record<string, string> = {};

    for (const file of files) {
        const content = fs.readFileSync(file, "utf-8");
        const { data } = matter(content);
        const tags = parseTags(data.tags);
        for (const tag of tags) {
            const raw = String(tag).trim();
            const key = raw.toLowerCase(); // 대소문자 무시하고 집계
            tagCount[key] = (tagCount[key] || 0) + 1;
            if (!displayName[key]) {
                // 첫 등장 형태를 그대로 저장
                displayName[key] = raw;
            }
        }
    }

    const tags = Object.keys(tagCount)
        .map((key) => ({
            name: displayName[key],
            slug: slugify(key),
            count: tagCount[key],
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

    return NextResponse.json(tags);
}