import { useEffect, useState } from "react";
import {
  fetchTechNews,
  fetchStackOverflowQuestions,
  fetchGitHubRepos,
} from "@/helpers/apiServices";
import { Article, Question, Repository } from "@/types/data";
import { useRouter } from "next/router";
import Link from "next/link";

const PAGE_SIZE = 5;

export default function Home() {
  const [query, setQuery] = useState<string>(""); // For the search input
  const [articles, setArticles] = useState<Article[]>([]); // For the news articles
  const [questions, setQuestions] = useState<Question[]>([]); // For StackOverflow questions
  const [repos, setRepos] = useState<Repository[]>([]); // For GitHub repos

  const [articlePageIndex, setArticlePageIndex] = useState<number>(0);
  const [questionPageIndex, setQuestionPageIndex] = useState<number>(0);
  const [repoPageIndex, setRepoPageIndex] = useState<number>(0);

  const router = useRouter();

  // Set query from URL when component is mounted
  useEffect(() => {
    if (router.query.q) {
      setQuery(router.query.q as string);
      handleSearch(); // automatically trigger a search based on the URL query
    }
  }, [router.query.q]);

  const handleSearch = async () => {
    const [news, questions, repos] = await Promise.all([
      fetchTechNews(query),
      fetchStackOverflowQuestions(query),
      fetchGitHubRepos(query),
    ]);

    setArticles(news);
    setQuestions(questions);
    setRepos(repos);
  };

  return (
    <div className="mx-auto p-16 bg-gray-800 w-screen min-h-screen h-full">
      <Link
        href={"/"}
        className="text-4xl font-bold block mb-8 text-indigo-200"
      >
        Tech News Aggregator
      </Link>

      <div className="mb-8 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow p-2 border rounded text-black focus:border-indigo-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => router.push(`/?q=${query}`)}
        >
          Search
        </button>
      </div>

      <div>
        <Section
          title="News"
          items={articles}
          pageIndex={articlePageIndex}
          setPageIndex={setArticlePageIndex}
          render={(article, index) => (
            <div
              key={index}
              className="mb-6 p-8 rounded-xl flex flex-col md:flex-row items-start bg-indigo-800 bg-opacity-20"
            >
              {article.urlToImage && (
                <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-56 h-36 rounded shadow-md object-cover hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="text-2xl mb-3 font-bold">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-100 hover:text-indigo-300 hover:underline transition-colors duration-300"
                  >
                    {article.title}
                  </a>
                </h3>
                <p className="text-gray-300">{article.description}</p>
              </div>
            </div>
          )}
        />

        <Section
          className="mt-8"
          title="Stack Overflow Questions"
          items={questions}
          pageIndex={questionPageIndex}
          setPageIndex={setQuestionPageIndex}
          render={(question, index) => (
            <div
              key={index}
              className="mb-6 p-8 rounded-xl flex flex-col md:flex-row items-start bg-indigo-800 bg-opacity-20"
            >
              <div className="flex-grow">
                <h3 className="text-2xl mb-3 font-bold">
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-100 hover:text-indigo-300 hover:underline transition-colors duration-300"
                  >
                    {question.title}
                  </a>
                </h3>
                {question.tags && (
                  <div className="mt-3 flex flex-wrap">
                    {question.tags.map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="mr-2 mb-2 bg-indigo-600 text-indigo-100 rounded-full px-4 py-1 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        />

        <Section
          className="mt-8"
          title="GitHub Repositories"
          items={repos}
          pageIndex={repoPageIndex}
          setPageIndex={setRepoPageIndex}
          render={(repo, index) => (
            <div
              key={index}
              className="mb-6 p-8 rounded-xl flex flex-col md:flex-row items-start bg-indigo-800 bg-opacity-20"
            >
              <div className="flex-grow">
                <h3 className="text-2xl mb-3 font-bold">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-100 hover:text-indigo-300 hover:underline transition-colors duration-300"
                  >
                    {repo.name}
                  </a>
                </h3>
                <p className="text-gray-300">{repo.description}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

type PaginationProps = {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  itemsLength: number;
};

const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  setPageIndex,
  itemsLength,
}) => (
  <div className="mt-4 flex justify-between">
    {pageIndex > 0 ? (
      <button
        onClick={() => setPageIndex(pageIndex - 1)}
        className="bg-indigo-600 text-white rounded p-2 hover:bg-indigo-700"
      >
        Previous Page
      </button>
    ) : (
      <div />
    )}
    {itemsLength > (pageIndex + 1) * PAGE_SIZE && (
      <button
        onClick={() => setPageIndex(pageIndex + 1)}
        className="bg-indigo-600 text-white rounded p-2 hover:bg-indigo-700"
      >
        Next Page
      </button>
    )}
  </div>
);

type ListProps<T> = {
  items: T[];
  pageIndex: number;
  render: (item: T, index: number) => JSX.Element;
};

const List: React.FC<ListProps<any>> = ({ items, pageIndex, render }) => (
  <>
    {items
      .slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)
      .map(render)}
  </>
);

type SectionProps<T> = {
  className?: string;
  title: string;
  items: T[];
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  render: (item: T, index: number) => JSX.Element;
};

const Section: React.FC<SectionProps<any>> = ({
  className,
  title,
  items,
  pageIndex,
  setPageIndex,
  render,
}) => (
  <section className={`p-4 rounded ${className}`}>
    <h2 className="text-3xl font-semibold mb-6 text-indigo-500">{title}</h2>
    <List items={items} pageIndex={pageIndex} render={render} />
    <Pagination
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
      itemsLength={items.length}
    />
  </section>
);
