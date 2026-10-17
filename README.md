# Stop & Shop - Ecommerce Store

A modern, responsive e-commerce storefront built with React, Vite, Chakra UI v3, and Clerk authentication. Browse products from the DummyJSON API, search for items, and manage your cart with a smooth, polished user interface.

## Features

- **Product browsing**: Display products in a responsive grid layout with infinite scroll ("Load more") functionality
- **Search**: Real-time search with debouncing (400ms) and immediate search on form submission
- **Product details**: Show product images, ratings, pricing (with discount calculations), categories, and stock availability
- **Shopping cart**: Add/remove items, adjust quantities, view subtotal, with cart persistence in localStorage
- **Authentication**: User sign-in/sign-up via Clerk with gated cart functionality (must be signed in to add items)
- **Dark/Light mode**: Theme switching powered by next-themes and Chakra UI color mode
- **Responsive design**: Mobile-first layout that adapts across screen sizes
- **Hero section**: Landing page with featured banner and value proposition

## Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) - UI library
- **Build Tool**: [Vite 8](https://vitejs.dev/) - Fast build tool and dev server
- **UI Components**: [Chakra UI v3](https://www.chakra-ui.com/) - Component system with Tailwind CSS integration
- **Authentication**: [Clerk](https://clerk.com/) - User management and authentication
- **Routing**: [React Router DOM 7](https://reactrouter.com/) - Client-side routing
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS modules
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Data Source**: [DummyJSON Products API](https://dummyjson.com/products)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Ecommerce-Store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with your Clerk publishable key:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

   You can get a publishable key by signing up at [Clerk.com](https://clerk.com/).

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the development server with hot module replacement (HMR) |
| `npm run build` | Builds the app for production to the `dist/` directory |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check for code quality issues |

## Project Structure

```
Ecommerce-Store/
├── dist/                # Production build output
├── node_modules/        # Dependencies
├── public/              # Static assets (favicon.svg, background.png)
├── src/
│   ├── component/       # React components
│   │   ├── Hero.jsx     # Landing page hero section
│   │   ├── Main.jsx     # Main layout component
│   │   ├── Navbar.jsx   # Navigation bar with cart and auth
│   │   ├── Products.jsx # Product listing and cart logic
│   │   └── Search.jsx   # Search bar component
│   ├── components/ui/   # Chakra UI v3 generated components
│   │   ├── color-mode.jsx
│   │   ├── provider.jsx
│   │   └── toaster.jsx (if present)
│   ├── pages/           # Page components
│   │   ├── Home.jsx     # Home page
│   │   └── Product.jsx  # Products page
│   ├── Styles/          # CSS modules and styles
│   │   └── Hero.css     # Hero section styles
│   ├── App.css          # Global app styles
│   ├── App.jsx          # Root app component with routing structure
│   └── main.jsx         # App entry point with providers (Clerk, Chakra)
├── .env                 # Environment variables (not committed)
├── .gitignore           # Git ignore rules
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── vite.config.js       # Vite configuration with path aliases
└── README.md            # Project documentation
```

## Key Implementation Details

### Cart Management

- Cart state is managed locally using `useCart()` hook in `Products.jsx`
- Cart items are persisted to `localStorage` under the key `store-cart`
- Quantity is limited by available stock; attempting to exceed shows "Max available" message
- Discounts are calculated client-side: `salePrice = price * (1 - discountPercentage/100)`

### Search Behavior

- Typing triggers a debounced search after 400ms of inactivity
- Pressing Enter or clicking Search submits immediately (skipping debounce)
- Clearing the search resets to showing all products
- Search requests to `https://dummyjson.com/products/search?q=...`

### Authentication Flow

- Protected cart actions: Users must be signed in to add items to cart
- If unauthenticated, clicking "Add to cart" redirects to sign-up flow
- Navbar shows Sign In/Sign Up buttons when signed out, and UserButton when signed in

### API Integration

- Fetches products from DummyJSON API with pagination (`limit=12`, `skip` for "Load more")
- Handles loading states, errors, and race conditions (cancels stale requests on new searches)
- Displays product count: "Showing X of Y products"

## Deployment

1. **Build for production**

   ```bash
   npm run build
   ```

2. **Preview the build locally**

   ```bash
   npm run preview
   ```

3. **Deploy to your platform of choice** (Vercel, Netlify, Cloudflare Pages, etc.)

   The built files are in the `dist/` directory and work as a static site.

## Environment Notes

- The project uses `@` as a path alias pointing to `./src/` (configured in `vite.config.js`)
- Chakra UI v3 uses `defaultSystem` and custom UI components in `src/components/ui/`
- Clerk requires a valid publishable key in `.env` - the app will throw an error if missing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and for learning/demo purposes.