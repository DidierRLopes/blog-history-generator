import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { Post } from '../components/BlogHistory';

export async function fetchPosts(url: string): Promise<Post[]> {
  try {
    const response = await axios.get(url, {
      responseType: 'text',
      headers: {
        'Accept': 'application/json, application/xml, application/atom+xml'
      }
    });
    
    const contentType = response.headers['content-type'];
    const isAtom = contentType?.includes('xml');
    
    if (isAtom) {
      const parser = new XMLParser();
      const xmlData = parser.parse(response.data);
      const entries = xmlData.feed?.entry || [];
      
      return entries.map((entry: any) => ({
        id: entry.id,
        content_html: entry.summary?.['#text'] || '',
        url: entry.link?.['@_href'] || '',
        title: entry.title,
        summary: entry.summary?.['#text'] || '',
        date_modified: entry.updated || entry.published,
        tags: Array.isArray(entry.category) 
          ? entry.category.map((cat: any) => cat['@_term'])
          : entry.category 
            ? [entry.category['@_term']]
            : []
      }));
    }
    
    // JSON Feed parsing
    const jsonData = JSON.parse(response.data);
    if (jsonData.version && jsonData.version.startsWith('https://jsonfeed.org/version/')) {
      const posts = jsonData.items || [];
      
      return posts.map((post: any) => ({
        id: post.id,
        content_html: post.content_html || '',
        url: post.url,
        title: post.title,
        summary: post.summary || '',
        date_modified: post.date_modified || post.date_published,
        tags: post.tags || []
      }));
    }
    
    // Fallback for other JSON formats
    const fallbackPosts = jsonData.items || jsonData.posts || [];
    
    return fallbackPosts.map((post: any) => ({
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