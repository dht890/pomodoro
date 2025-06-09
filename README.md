# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# 🚀 Feature Development Git Workflow

This document outlines the steps to properly use version control (Git) when adding a new feature to a project.

---

## ✅ 1. Start from the Main Branch

Make sure you're on the `main` (or `master`) branch and it's up to date:

```bash
git checkout main
git pull origin main
```

---

## ✅ 2. Create a Feature Branch

Create a new branch using a descriptive name:

```bash
git checkout -b feature/your-feature-name
```

---

## ✅ 3. Make Your Changes

Write code, add files, and test your new feature.

---

## ✅ 4. Stage and Commit Your Changes

Stage and commit your changes with a clear message:

```bash
git add .
# or
git add path/to/file.js

git commit -m "Add login page with form and basic validation"
```

---

## ✅ 5. Pull the Latest Main (Optional but Recommended)

Rebase your feature branch with the latest `main`:

```bash
git pull origin main --rebase
```

---

## ✅ 6. Push Your Feature Branch

Upload your branch to the remote:

```bash
git push origin feature/your-feature-name
```

---

## ✅ 7. Open a Pull Request (PR)

On GitHub/GitLab/Bitbucket:
- Open a PR from your feature branch into `main`
- Request reviews if needed

---

## ✅ 8. Review and Fix Issues

Respond to feedback, make changes, and push them:

```bash
git add .
git commit -m "Fix form validation issues"
git push
```

---

## ✅ 9. Merge the PR

Once approved, merge it into `main`:

```bash
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main
```

---

## ✅ 10. Delete the Feature Branch

Clean up your local and remote branches:

```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## ✅ (Optional) Tag the Release

If this feature is part of a release:

```bash
git tag v1.1.0
git push origin v1.1.0
```

---
