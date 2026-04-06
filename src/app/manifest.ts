import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Blog — 个人技术博客",
    short_name: "MyBlog",
    description: "分享前端开发、技术思考与学习笔记",
    start_url: "/",
    display: "standalone",
    background_color: "#18181b",
    theme_color: "#8b5cf6",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
