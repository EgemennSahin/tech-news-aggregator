# Tech News Aggregator

Tech News Aggregator is a web application built with Next.js and TypeScript, that aggregates technology-related news, Stack Overflow questions, and GitHub repositories based on a user's search query. The application fetches data from various APIs and displays it in a paginated format.

## Features

- Fetch and display tech news from News API.
- Fetch and display tech-related Stack Overflow questions.
- Fetch and display GitHub repositories based on a query.
- Paginated viewing for all sections.
- Responsive layout that adjusts to different screen sizes.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/EgemennSahin/tech-news-aggregator.git
cd tech-news-aggregator
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root and add your News API key:

```bash
echo 'NEXT_PUBLIC_NEWS_API_KEY=your-api-key-here' > .env.local
```

4. Run the application in development mode:

```bash
npm run dev
```

Now you can open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## File Structure

- `apiService.ts`: Contains functions to fetch data from News API, Stack Overflow, and GitHub.
- `index.tsx`: Main component for the Home page, includes all UI elements and logic for fetching/displaying data.
- `data.ts`: Contains type definitions for data structures used in the project.

## Components

- `Pagination`: A component for rendering pagination controls.
- `List`: A generic component for rendering lists of items.
- `Section`: A component for rendering each section of data (News, Stack Overflow Questions, GitHub Repositories) including title, list of items, and pagination controls.

## Environment Variables

- `NEXT_PUBLIC_NEWS_API_KEY`: Your News API key for fetching news articles.

## Contributing

Feel free to fork the repository, create a feature branch, and submit a Pull Request when you have completed your feature or bug fix.

## License

This project is open-source and available under the MIT License. See the LICENSE file for more info.

## Support

If you encounter any issues or have feature suggestions, please open an issue on GitHub.

## Author

[Egemen Sahin](https://github.com/EgemennSahin)
