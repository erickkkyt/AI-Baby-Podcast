import type { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog-data'; // 导入博客数据

const BASE_URL = 'https://www.babypodcast.pro'; // 确保这是您的生产域名

export default function sitemap(): MetadataRoute.Sitemap {
  // 基础页面
  const staticPages = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(), // 可以设置为页面实际最后修改日期
      changeFrequency: 'monthly', // 页面内容更新频率
      priority: 1, // 页面相对重要性 (0.0 to 1.0)
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly', // 法律页面通常不常更改
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`, // 博客列表页
      lastModified: new Date(),
      changeFrequency: 'weekly', // 假设博客每周更新
      priority: 0.7,
    },
  ];

  // 动态生成的博客文章页面
  const blogPostEntries = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date), // 使用博文的日期作为 lastModified
    changeFrequency: 'monthly' as const, // 或者 'yearly' 如果不常更新
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...blogPostEntries,
  ];
} 