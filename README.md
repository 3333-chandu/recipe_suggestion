# taylors-kitchen
Created with CodeSandbox
Purpose:
This application helps users (like Taylor) find meals based on ingredients they have, their mood, or available cooking time. It fetches meal data from TheMealDB API, which is free and requires no authentication.

Features:

Input ingredients in a text field (required).

Optional filters for mood (happy, quick, relaxed) and cooking time (15, 30, 60 minutes).

Displays meals with name and image dynamically.

Kitchen-themed background for a pleasant cooking vibe.

Tech Stack:

React with TypeScript: UI and state management.

CSS: Custom styling for layout, buttons, inputs, and meal cards.

Public API: TheMealDB API
 to fetch meals.

How to Run Locally:

Clone the repository:

git clone <your-repo-url>
cd taylors-kitchen


Install dependencies:

npm install


Start the development server:

npm start


Open http://localhost:3000
 in your browser.

Deployment:

Can be deployed on Vercel or Netlify directly from GitHub.

Ensure the build folder is set as the publish directory for deployment.

Tips & Notes:

Only the ingredients input is required to fetch meals.

If no meals are found, try different ingredients.

Ensure style.css is correctly imported in App.tsx to avoid errors.

The app is fully responsive and visually designed for a kitchen-themed experience.
