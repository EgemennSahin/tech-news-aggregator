// apiService.ts

import { Article, Question, Repository } from "@/types/data";

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const SO_API_URL = "https://api.stackexchange.com/2.3/search";
const GITHUB_API_URL = "https://api.github.com/search/repositories";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export async function fetchTechNews(query: string): Promise<Article[]> {
  const response = await fetch(
    `${NEWS_API_URL}?language=en&q=${query}&apiKey=${NEWS_API_KEY}`
  );
  const data = await response.json();
  return data.articles;
}

export async function fetchStackOverflowQuestions(
  tag: string
): Promise<Question[]> {
  const response = await fetch(
    `${SO_API_URL}?order=desc&sort=activity&intitle=${tag}&site=stackoverflow`
  );
  const data = await response.json();
  if (!data.items) return [];
  return data.items.map((item: any) => ({
    title: item.title,
    link: item.link,
    tags: item.tags,
  }));
}

export async function fetchGitHubRepos(query: string): Promise<Repository[]> {
  const response = await fetch(
    `${GITHUB_API_URL}?q=${query}&sort=stars&order=desc`
  );
  const data = await response.json();
  if (!data.items) return [];

  return data.items.map((repo: any) => ({
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
  }));
}
