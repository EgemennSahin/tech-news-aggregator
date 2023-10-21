export type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
};

export type Question = {
  title: string;
  link: string;
};

export type Repository = {
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
};
