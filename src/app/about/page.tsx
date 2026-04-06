import { getAllPosts, getAllTags } from "@/lib/mdx";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import {
  Code2,
  Coffee,
  Github,
  Mail,
  FileText,
  Tag,
  Sparkles,
} from "lucide-react";

const skills = [
  { name: "React / Next.js", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Tailwind CSS", level: 88 },
  { name: "Node.js", level: 80 },
  { name: "Python", level: 70 },
  { name: "Docker / CI-CD", level: 65 },
];

export const metadata = {
  title: "关于我 - MyBlog",
  description: "了解博客作者和网站数据",
};

export default async function AboutPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  const totalTags = tags.length;
  const totalPosts = posts.length;
  const totalWords = posts.reduce(
    (sum, p) => sum + (p.readingTime?.words ?? 0),
    0
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-20">
      {/* 个人介绍 */}
      <section className="mb-16">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-[3px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-950 text-4xl">
                👨‍💻
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1.5 ring-4 ring-white dark:ring-zinc-950" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
            你好，我是博主 <span className="text-gradient">Zhao</span>
          </h1>
          <p className="max-w-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
            一名热爱前端技术的开发者，喜欢探索 Web 新技术、写有温度的技术文章。
            这个博客是我记录学习、分享经验的小天地。
          </p>
        </div>

        {/* 联系方式 */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 transition-colors hover:border-violet-500/50 hover:text-violet-500 dark:hover:text-violet-400"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a
            href="mailto:hello@example.com"
            className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 transition-colors hover:border-violet-500/50 hover:text-violet-500 dark:hover:text-violet-400"
          >
            <Mail className="h-4 w-4" /> 邮箱
          </a>
          <span className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Coffee className="h-4 w-4" /> 喝杯咖啡
          </span>
        </div>

        {/* 博客统计 */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mb-2">
              <FileText className="h-3.5 w-3.5" /> 文章
            </div>
            <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{totalPosts}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mb-2">
              <Tag className="h-3.5 w-3.5" /> 标签
            </div>
            <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{totalTags}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mb-2">
              <Sparkles className="h-3.5 w-3.5" /> 总字数
            </div>
            <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              {totalWords > 1000
                ? `${(totalWords / 1000).toFixed(1)}k`
                : totalWords}
            </p>
          </div>
        </div>
      </section>

      {/* 技能栈 */}
      <section className="mb-16">
        <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
          <Code2 className="h-5 w-5 text-violet-400" />
          技能栈
        </h2>
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-zinc-600 dark:text-zinc-300">{skill.name}</span>
                <span className="text-zinc-500">{skill.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-1000"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 访问统计 */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
          <Sparkles className="h-5 w-5 text-violet-400" />
          网站统计
        </h2>
        <AnalyticsChart />
      </section>
    </main>
  );
}
