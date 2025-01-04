import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import * as dotenv from 'dotenv';
import { renderToStaticMarkup } from 'react-dom/server';
import { fetchPosts } from './utils/fetchPosts.js';
import BlogHistory from './components/BlogHistory.js';
import React from 'react';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generate() {
  try {
    const blogUrl = process.env.BLOG_URL;
    if (!blogUrl) {
      throw new Error('BLOG_URL environment variable is not set');
    }

    // Fetch posts
    const posts = await fetchPosts(blogUrl);

    // Generate static SVG
    const svg = renderToStaticMarkup(
      React.createElement(BlogHistory, {
        posts,
        static: true,
        width: 800,
        height: 400
      })
    );

    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    // Save SVG file
    await fs.writeFile(
      join(outputDir, 'blog-history.svg'),
      svg
    );

    console.log('Successfully generated blog-history.svg');
  } catch (error) {
    console.error('Error generating SVG:', error);
    process.exit(1);
  }
}

generate();