import { useState } from "react";
import {
  fetchTechNews,
  fetchStackOverflowQuestions,
  fetchGitHubRepos,
} from "@/helpers/apiServices";
import { Article, Question, Repository } from "@/types/data";
import Link from "next/link";

const PAGE_SIZE = 5;

const SEASONS = {
  SPRING: {
    bg: "bg-green-200",
    text: "text-green-700",
    primary: "bg-green-500",
    secondary: "bg-green-300",
    hover: "hover:bg-green-600",
  },
  SUMMER: {
    bg: "bg-yellow-200",
    text: "text-yellow-700",
    primary: "bg-yellow-500",
    secondary: "bg-yellow-300",
    hover: "hover:bg-yellow-600",
  },
  AUTUMN: {
    bg: "bg-orange-200",
    text: "text-orange-700",
    primary: "bg-orange-500",
    secondary: "bg-orange-300",
    hover: "hover:bg-orange-600",
  },
  WINTER: {
    bg: "bg-blue-200",
    text: "text-blue-700",
    primary: "bg-blue-500",
    secondary: "bg-blue-300",
    hover: "hover:bg-blue-600",
  },
};

export default function Home() {
  const [query, setQuery] = useState<string>(""); // For the search input
  const [articles, setArticles] = useState<Article[]>([]); // For the news articles
  const [questions, setQuestions] = useState<Question[]>([]); // For StackOverflow questions
  const [repos, setRepos] = useState<Repository[]>([]); // For GitHub repos

  const [articlePageIndex, setArticlePageIndex] = useState<number>(0);
  const [questionPageIndex, setQuestionPageIndex] = useState<number>(0);
  const [repoPageIndex, setRepoPageIndex] = useState<number>(0);

  const [currentSeason, setCurrentSeason] = useState(
    Object.keys(SEASONS)[Math.floor(Math.random() * 4)] as keyof typeof SEASONS
  );

  const changeSeason = () => {
    const seasons = Object.keys(SEASONS);
    let newSeason: keyof typeof SEASONS;
    do {
      newSeason = seasons[
        Math.floor(Math.random() * seasons.length)
      ] as keyof typeof SEASONS;
    } while (newSeason === currentSeason);
    setCurrentSeason(newSeason);
  };

  const handleSearch = async () => {
    const [news, questions, repos] = await Promise.all([
      fetchTechNews(query),
      fetchStackOverflowQuestions(query),
      fetchGitHubRepos(query),
    ]);

    if (news) {
      setArticles(news);
    }
    if (questions) {
      setQuestions(questions);
    }
    if (repos) {
      setRepos(repos);
    }

    changeSeason();
  };

  return (
    <div
      className={`mx-auto p-16 w-screen min-h-screen h-full ${SEASONS[currentSeason].bg}`}
    >
      <Link
        href={"/"}
        className={`text-4xl font-bold block mb-8 ${SEASONS[currentSeason].text}`}
      >
        Tech News Aggregator
      </Link>

      <div className="mb-8 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className={`flex-grow p-2 rounded drop-shadow-md ${SEASONS[currentSeason].text} ${SEASONS[currentSeason].secondary} focus:${SEASONS[currentSeason].hover}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          className={`p-2 rounded ${SEASONS[currentSeason].primary} drop-shadow-md`}
          onClick={() => {
            handleSearch();
          }}
        >
          Search
        </button>
      </div>

      <div>
        <Section
          className={`${SEASONS[currentSeason].text} mt-8`}
          color={`text-white ${SEASONS[currentSeason].primary}`}
          title="News"
          items={articles}
          pageIndex={articlePageIndex}
          setPageIndex={setArticlePageIndex}
          render={(article, index) => (
            <div
              key={index}
              className={`mb-6 p-8 rounded-xl flex flex-col md:flex-row items-start ${SEASONS[currentSeason].secondary}`}
            >
              {article.image_url && (
                <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-56 h-36 rounded shadow-md object-cover hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="text-2xl mb-3 font-bold">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${SEASONS[currentSeason].text} hover:underline transition-colors duration-300`}
                  >
                    {article.title}
                  </a>
                </h3>
                <p className="text-gray-900">{article.description}</p>
              </div>
            </div>
          )}
        />
        <Section
          className={`${SEASONS[currentSeason].text} mt-8`}
          color={`text-white ${SEASONS[currentSeason].primary}`}
          title="Stack Overflow Questions"
          items={questions}
          pageIndex={questionPageIndex}
          setPageIndex={setQuestionPageIndex}
          render={(question, index) => (
            <div
              key={index}
              className={`mb-6 p-8 rounded-xl flex flex-col md:flex-row items-start ${SEASONS[currentSeason].secondary}`}
            >
              <div className="flex-grow">
                <h3 className="text-2xl mb-3 font-bold">
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${SEASONS[currentSeason].text} hover:underline transition-colors duration-300`}
                  >
                    {question.title}
                  </a>
                </h3>
                {question.tags && (
                  <div className="mt-3 flex flex-wrap">
                    {question.tags.map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className={`mr-2 mb-2 ${SEASONS[currentSeason].bg} text-gray-900 rounded-full px-4 py-1 text-sm`}
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
          className={`${SEASONS[currentSeason].text} mt-8`}
          color={`text-white ${SEASONS[currentSeason].primary}`}
          title="GitHub Repositories"
          items={repos}
          pageIndex={repoPageIndex}
          setPageIndex={setRepoPageIndex}
          render={(repo, index) => (
            <div
              key={index}
              className={`mb-6 p-8 rounded-xl flex flex-col md:flex-row items-start ${SEASONS[currentSeason].secondary}`}
            >
              <div className="flex-grow">
                <h3 className="text-2xl mb-3 font-bold">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${SEASONS[currentSeason].text} hover:underline transition-colors duration-300`}
                  >
                    {repo.name}
                  </a>
                </h3>
                <p className="text-gray-900">{repo.description}</p>
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
  color: string;
};

const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  setPageIndex,
  itemsLength,
  color,
}) => (
  <div className="mt-4 flex justify-between">
    {pageIndex > 0 ? (
      <button
        onClick={() => setPageIndex(pageIndex - 1)}
        className={`${color} rounded p-2 drop-shadow-md`}
      >
        Previous Page
      </button>
    ) : (
      <div />
    )}
    {itemsLength > (pageIndex + 1) * PAGE_SIZE && (
      <button
        onClick={() => setPageIndex(pageIndex + 1)}
        className={`${color} rounded p-2 drop-shadow-md`}
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
  color: string;
  title: string;
  items: T[];
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  render: (item: T, index: number) => JSX.Element;
};

const Section: React.FC<SectionProps<any>> = ({
  className,
  color,
  title,
  items,
  pageIndex,
  setPageIndex,
  render,
}) => (
  <section className={className}>
    <h2 className="text-3xl font-semibold mb-6">{title}</h2>
    <div className="px-2">
      <List items={items} pageIndex={pageIndex} render={render} />
      <Pagination
        color={color}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        itemsLength={items?.length || 0}
      />
    </div>
  </section>
);
