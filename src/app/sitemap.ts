import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.babypodcast.pro'; // 确保这是您的生产域名

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
    // 如果您有其他希望被索引的公开页面，请在此处添加
  ];
} 