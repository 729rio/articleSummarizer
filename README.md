# News Cruncher 

News Cruncher simplifies the overwhelming amount of news online by turning lengthy articles into quick, digestible summaries. Powered by OpenAI, it extracts key information from article URLs and delivers customizable summaries—short, medium, or long—based on the user’s preference.

The tool focuses on delivering clean, relevant content by filtering out unnecessary sections, making the summaries precise and easy to read. With a simple, intuitive interface and strong error handling, articleSummarizer makes staying informed effortless and efficient.

# Development Period

July 26, 2024 - Aug 23, 2024 (Total 28 Days)


# Team Compositions and Roles

- Chris
  - Frontend Development
    - HTML Structure: Set up document type, language, character set, viewport, and container div.
    - React Entry Point: Loaded the main component into the DOM.
    - Main App Component: Implemented core functionality of the app.
    - State Management with useState: Managed URL, summary, error messages, and loading states. 
    - User Interface: Enabled URL input and display of summaries or errors. 
  - Backend Development
    - Content Fetching: Used fetch to retrieve article content from URLs.
    - Text Extraction Algorithm: Developed a heuristic to extract main article content based on tags and class names. 
    - Text Cleaning: Removed irrelevant content to imporve summary quality. 
    - Error Handling: Built mechanisms to manage fetch failures and extraction issues. 
- David
  - Frontend Development
    - CSS Styling: Created styles for fonts, colors, padding, margins and interactive elements.
    - Dropdown Menu: Developed a dropdown for selecting summary lengths.
    - Dark Mode: Implemented a button to toggle between light and dark mode for user interface.
  - Backend Development
    - Server Setup and Middleware Configuration: Configured Express server with CORS and JSON parsing.
    - API Key Management: Secured OpenAI API key usage.
    - API Interaction: Handled requests and processed responses from OpenAI.
    - HTML Parsing: Used Cheerio to parse HTML for content extraction.
    - Error Handling: Managed errors like missing URLs or summary lengths.
    - Debugging: Utilized logging technique to precisely identify crucial bugs during API interaction.
    - Testing: Conducted 50+ tests for UI, API calls, and API output using Postman, React Testing Library, and Cypress.

# Usage Models
