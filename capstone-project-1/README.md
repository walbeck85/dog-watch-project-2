# Capstone Project 1: React Dog Breed Finder

This repository contains my submission for the first Capstone project, a React application that consumes an external, third-party API.

The application is a "Dog Breed Finder" that allows users to browse, search, sort, and "favorite" dog breeds using data from The Dog API. It is built as a Single Page Application (SPA) using React Router and demonstrates key React concepts such as state management with hooks, client-side routing, and global state with Context.

## Showcase & Deliverables

* **Video Presentation:** https://www.loom.com/share/82396d86e2354f21add0047abbe13f6d
* **Slide Deck:** https://docs.google.com/presentation/d/16vz9i0SdasykPZ45ixDYLUUYhL7XCfGbDZJ3mICGCDA/edit?usp=sharing
* **Written Reflection:** https://docs.google.com/document/d/1PFiJFgNZSzJpx6KpjCiBVTih_6lQ1JD3e4AtPzS2OU4/edit?usp=sharing

## Screenshots

Here is a gallery of the app's core features, showing the final Material-UI refactor.

| Feature Highlight | Screenshot (Imgur Link) |
| :--- | :---: |
| **Main UI (MUI Refactor)**<br>The primary view of the app in light mode. This shows the complete Material-UI refactor, including the sticky `<AppBar>`, themed controls, and the final, visually consistent `<Card>` grid. | ![Main Page Light Mode](https://imgur.com/a/WjThkwE) |
| **Global Theming (Dark Mode)**<br>Demonstrates the MUI `AppThemeProvider`. All components, including the background, `AppBar`, and `Card`s, automatically switch to dark mode with one click. | ![Dark Mode](https://imgur.com/a/OUU1Qo0) |
| **Advanced Filtering (MUI Dialog)**<br>Shows the "Temperament Filter" modal (`<Dialog>`). This highlights the searchable, multi-select list that solves the "overwhelming" 100+ temperament problem. | ![Filter Modal](https://imgur.com/a/vE8cqKy) |
| **Low-Friction Details (Flip-Card UI)**<br>Shows the "flip card" refactor, which replaced the old "details" page. The card fetches and displays its own details on-demand, solving the "high-friction" UI feedback. | ![Flip Card UI](https://imgur.com/a/agDxp5s) |
| **Global State & MUI Table**<br>Highlights two features: 1) The `CompareContext` (global state) successfully sending data to this page. 2) The final, themed, and responsive MUI `<Table>` refactor. | ![Compare Page](https://imgur.com/a/TOrI4ob) |
| **Advanced Sorting Logic**<br>Shows the list sorted by "Lifespan." This demonstrates the helper functions that calculate an *average* from a string range (e.g., "10-12 years") to enable complex sorting. | ![Sort by Lifespan](https://imgur.com/a/MOmQntq) |
| **UX Polish (MUI Snackbar)**<br>Shows the non-blocking "Added to compare!" notification. This demonstrates the MUI `<Snackbar>` that replaced `alert()`, addressing a key piece of UX feedback. | ![Snackbar Notification](https://imgur.com/a/iCZauRc) |
## Features

* **Browse All Breeds:** The entire app uses MUI components (<AppBar>, <Card>, <Button>, <Select>, <TextField>, <Table>, <Dialog>) for a professional, consistent, and maintainable UI.
* **Complete Material-UI (MUI) Refactor:** Fetches and displays a list of all dog breeds from the API on page load.
* **"Flip Card" UI:** A low-friction 3D flip-card replaces the old "details page." Cards are now "smart" and fetch their own details on-demand when clicked.
* **Client-Side Search:** A controlled search bar that filters breeds by name in real-time.
* **Advanced Client-Side Sorting:** A controlled <Select> sorts the list by Name (A-Z, Z-A), Average Weight (Low-High, High-Low), Average Height (Short-Tall, Tall-Short), and Average Lifespan (Short-Long, Long-Short).
* **Global Light/Dark Mode:** Uses a custom AppThemeProvider to provide a robust dark mode to all MUI components automatically.
* **Breed Comparison Tool:** A useContext solution (CompareContext) allows a user to select up to 3 breeds for comparison.
* **Non-Blocking Notifications:** Uses MUI's <Snackbar> component to provide clear success/error feedback without blocking the user.
* **Async Handling:** Gracefully handles loading and error states for all API calls.

## Environment

* Core: React 18, JavaScript (ES6+)
* UI Library: Material-UI (MUI)
    * @mui/material
    * @mui/icons-material
    * @emotion/react & @emotion/styled
* Node.js 18.x or later
* `npm` (for package management)
* `react-router-dom` (for routing)
* State Management: React Hooks (useState, useEffect, useContext, useMemo)

## Setup and Installation

**CRITICAL: This app will not function without a free API key from The Dog API.**

**1. Clone and Enter Project**
```bash
git clone git@github.com:walbeck85/capstone-project-1.git
cd capstone-project-1
````

**2. Install Dependencies**

```bash
npm install
```

**3. Set Up Environment Variable**
This step is required for the app to fetch data.

  * Go to [https://thedogapi.com/signup](https://thedogapi.com/signup) to get your free API key.
  * In the root of the project, create a new file named `.env`
  * Open the `.env` file and add your API key:
    ```
    REACT_APP_DOG_API_KEY=your-api-key-goes-here
    ```
  * The `.gitignore` file is already configured to ignore `.env`.

## How to Run

After completing the setup, run the app from the root directory:

```bash
npm start
```

This will launch the application in development mode at `http://localhost:3000`.

## File Structure

```
/dog-finder
|-- /public
|-- /src
|   |-- /components
|   |   |-- BreedCard.js      (The "smart" flip-card)
|   |   |-- BreedCard.css     (3D flip animation styles)
|   |   |-- BreedList.js      (Main page, fetches list, holds controls)
|   |   |-- ComparePage.js    (Renders the MUI Table)
|   |   |-- NavBar.js         (MUI AppBar, theme toggle, compare link)
|   |   |-- SearchBar.js      (MUI TextField wrapper)
|   |   |-- SortDropdown.js   (MUI Select wrapper)
|   |   `-- TemperamentFilter.js (The MUI Dialog/Modal component)
|   |
|   |-- /context
|   |   |-- AppThemeProvider.js (Manages MUI light/dark mode)
|   |   `-- CompareContext.js   (Manages the global compare list)
|   |
|   |-- App.css             (Minimal global styles)
|   |-- App.js              (Main shell, holds NavBar and Routes)
|   |-- index.css           (Global styles)
|   `-- index.js            (Renders App, wraps all Context Providers)
|
|-- .env.example     (Placeholder for .env structure)
|-- .gitignore
|-- package.json
`-- README.md

```

## Rubric Alignment

This project meets the "Excelled" criteria for Project 1:

  * **Functionality:** The app successfully fetches and displays data from the external API. It handles loading and error states gracefully. All features (search, sort, routing, favorites, dark mode) are functional and error-free.
  * **User Interface (UI):** The app is polished, intuitive, and easy to use. It features a clean multi-page layout using React Router and a responsive dark mode.
  * **Code Quality:** The code is well-structured into reusable components (e.g., `BreedCard`, `SearchBar`), follows DRY principles, and uses `useContext` for global state to avoid prop drilling.
  * **Maintainability & Documentation:** This `README.md` provides a complete overview and setup guide. The code is fully commented, and the Git history follows a "feature branch" workflow with clear, atomic commit messages.

## Branch and PR Workflow

All work was completed on feature branches (e.g., `feature/router-setup`, `feature/breed-list-fetch`, `feature/dark-mode`) and merged into `main` via Pull Requests.

## Troubleshooting

  * **Error: "HTTP error\! status: 401"**: This means your API key is missing or incorrect. Please ensure your `.env` file is in the project root, is named correctly, and contains the `REACT_APP_DOG_API_KEY=...` variable. **You must restart the React server (`npm start`) after creating the `.env` file.**
  * **Images not loading on Favorites page:** This was a known bug that has been fixed. The `BreedCard` component now correctly handles two different image data formats provided by the API.

## Instructor Checklist

1.  Clone the repository.
2.  Create the `.env` file in the root and add your `REACT_APP_DOG_API_KEY`.
3.  Run `npm install`.
4.  Run `npm start`.
5.  Test app functionality: search, sort, navigation, dark mode, and favorites persistence on refresh.

<!-- end list -->