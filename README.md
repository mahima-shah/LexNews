# LexNews React App

This is a refactored Vite + React version of the LexNews prototype.

## What changed

- Organized the single JSX prototype into a real project folder structure.
- Added reusable layout, news, auth, Mira, and UI components.
- Added reusable hooks for auth and saved articles.
- Moved article data, filters, and icons into separate files.
- Changed the design system to a monochrome palette.
- Updated Mira so the AI chat opens as a 3/4-height bottom sheet instead of taking the full screen.

## How to run locally

Open this folder in VS Code, then run:

```bash
npm install
npm run dev
```

Open the local URL Vite gives you, usually:

```bash
http://localhost:5173
```

## Folder structure

```txt
src/
  app/
    App.jsx
  components/
    auth/
      SignInModal.jsx
    layout/
      BottomNav.jsx
      Logo.jsx
      TopBar.jsx
    mira/
      MiraPanel.jsx
    news/
      ArticleImage.jsx
      ArticleReader.jsx
      NewsCard.jsx
      Tag.jsx
    ui/
      IconButton.jsx
      Pill.jsx
      SettingsRow.jsx
  constants/
    icons.jsx
  data/
    articles.js
    filters.js
  hooks/
    useAuth.js
    useSavedArticles.js
  screens/
    HomeScreen.jsx
    ProfileScreen.jsx
    SavedScreen.jsx
    SearchScreen.jsx
  styles/
    globals.css
  main.jsx
```
