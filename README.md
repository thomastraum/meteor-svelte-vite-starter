# Meteor Svelte Vite Starter

A modern starter template for building web applications with Meteor.js, Svelte 5, Vite, and TailwindCSS.

## Features

- 🚀 Meteor 3.0+ for full-stack JavaScript
- ⚡️ Svelte 5 with Vite for lightning-fast development
- 🎨 TailwindCSS for utility-first styling
- 📦 ESLint & Prettier pre-configured
- 🔧 TypeScript support
- 🛠️ Development tools and best practices setup

## Quick Start

1. Create a new project using this template:
```bash
git clone https://your-repo/meteor-svelte-vite-starter my-app
cd my-app
rm -rf .git
git init
```

2. Install dependencies:
```bash
meteor npm install
```

3. Start the development server:
```bash
meteor npm start
```

## Project Structure

- `/client` - Client-side entry point
- `/server` - Server-side entry point
- `/imports` - Application code
  - `/ui` - Svelte components
  - `/api` - Collections and methods
  - `/startup` - Initialization code

## Scripts

- `npm start` - Start development server
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm run check` - Run both lint and format


## build

```bash
meteor build --directory ./build
cd build/bundle
(cd programs/server && npm install)
NODE_ENV=production PORT=3000 MONGO_URL=mongodb://localhost:27017/yourapp ROOT_URL=http://localhost:3000 node main.js

```


