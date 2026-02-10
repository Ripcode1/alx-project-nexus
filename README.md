# E-Commerce Frontend

This is the frontend for my ALX ProDev capstone project. It's a full e-commerce store built with Next.js that talks to a Django REST API I built separately.

## What it does

Basically a working online shop. You can browse products, filter by category/price/availability, read and write reviews, add stuff to a cart, create an account, place orders, and see your order history. Nothing crazy, but everything actually works end-to-end.

## Tech stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for global state (auth + cart)
- **Tailwind CSS** for styling
- **react-hot-toast** for notifications

## Running locally

```bash
git clone https://github.com/Ripcode1/alx-project-nexus.git
cd alx-project-nexus
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://ecommerce-api-wp9c.onrender.com/api/v1
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/              # pages (App Router)
│   ├── products/     # listing + [slug] detail
│   ├── cart/         # shopping bag
│   ├── orders/       # order history
│   ├── login/        # auth
│   ├── register/
│   └── profile/
├── components/       # reusable UI
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── FilterSidebar.tsx
│   ├── Pagination.tsx
│   └── ReviewSection.tsx
├── store/            # Redux slices
│   ├── authSlice.ts
│   └── cartSlice.ts
├── types/            # TypeScript interfaces
└── utils/            # API client
```

## How state management works

Two Redux slices handle the important stuff:

**authSlice** — stores the logged-in user and JWT tokens. Both get persisted to localStorage so you don't get logged out on refresh. On app load, `loadFromStorage` pulls everything back into Redux.

**cartSlice** — stores cart items with quantities. Same localStorage persistence pattern. The cart is fully client-side since the backend doesn't have a cart model — orders get created directly from cart contents when you check out.

## API integration

The frontend connects to my Django API deployed on Render. The `utils/api.ts` file handles all HTTP requests with a generic `request<T>` function that auto-attaches auth headers and handles errors.

Key endpoints used:
- `GET /products/` with query params for filtering (category, price range, stock, search, ordering, pagination)
- `GET /products/{slug}/` for product detail
- `GET|POST /products/{slug}/reviews/` for reviews
- `POST /auth/login/` and `/auth/register/` for authentication
- `POST /orders/place/` to create orders from cart
- `GET /orders/` for order history

Backend repo: [ecommerce-api](https://github.com/Ripcode1/ecommerce-api)

## Deployment

The frontend is deployed on **Vercel**. The backend API runs on Render. The `NEXT_PUBLIC_API_URL` env var connects the two.

## Things I'd do with more time

- Real product images instead of category placeholders
- Wishlist functionality
- Better error boundaries for edge cases
- Dark mode toggle
- Payment integration
