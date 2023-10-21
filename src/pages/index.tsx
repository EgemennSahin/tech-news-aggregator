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
    <div className="container mx-auto p-6">
      <Link href={"/"} className="text-4xl font-bold">
        Tech News Aggregator
      </Link>

      <div className="my-8">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded text-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="ml-4 p-2 bg-blue-500 text-white rounded"
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
              className="mb-4 border p-4 rounded flex flex-col md:flex-row items-center"
            >
              {article.urlToImage && (
                <div className="mb-4 md:mb-0 md:mr-6">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-56 rounded shadow-md object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-2xl mb-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {article.title}
                  </a>
                </h3>
                <p>{article.description}</p>
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
            <div key={index} className="mb-4 border p-4 rounded">
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {question.title}
              </a>
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
            <div key={index} className="mb-4 border p-4 rounded">
              <h3 className="text-2xl mb-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.name}
                </a>
              </h3>
              <p>{repo.description}</p>
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
  <>
    {pageIndex > 0 && (
      <button
        onClick={() => setPageIndex(pageIndex - 1)}
        className="mt-2 bg-blue-500 text-white rounded p-2 mr-2"
      >
        Previous Page
      </button>
    )}
    {itemsLength > (pageIndex + 1) * PAGE_SIZE && (
      <button
        onClick={() => setPageIndex(pageIndex + 1)}
        className="mt-2 bg-blue-500 text-white rounded p-2"
      >
        Next Page
      </button>
    )}
  </>
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
  <section className={className}>
    <h2 className="text-3xl font-semibold mb-4">{title}</h2>
    <List items={items} pageIndex={pageIndex} render={render} />
    <Pagination
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
      itemsLength={items.length}
    />
  </section>
);
