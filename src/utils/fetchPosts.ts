import axios from 'axios';
import { Post } from '../components/BlogHistory';

export async function fetchPosts(url: string): Promise<Post[]> {
  try {
    const response = await axios.get(url);
    
    // Assuming the JSON feed follows a standard format
    // Modify this according to your blog's JSON structure
    const posts = response.data.items || response.data.posts || [];
    
    return posts.map((post: any) => ({
      id: post.id,
      content_html: post.content_html || post.content,
      url: post.url,
      title: post.title,
      summary: post.summary || post.excerpt,
      date_modified: post.date_modified || post.date,
      tags: post.tags || []
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}