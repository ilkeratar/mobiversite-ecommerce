# Mobiversite E‑Commerce Test Project

This project was prepared as part of an e‑commerce application development task requested by Mobiversite. A functional and modern e‑commerce site was built using Next.js 15 (App Router), TypeScript, Tailwind CSS, and the React Context API. For persistence, the backend API is served as a live mock API on Render using Express.js and json-server.

---

## Live Demo & API

* **Live Demo (Vercel):** https://ecomiversite.vercel.app/
* **API Endpoint (Render):** https://ecomiversite-api.onrender.com

---

## Features

This project implements the following key functionalities specified in the test case:

* **Product Listing and Detail:** List products (`/products`) and view product details (`/products/[id]`). Data fetching with server components and integration of `loading.tsx` / `not-found.tsx`.
* **Authentication:** Secure, `httpOnly` cookie‑based user registration (`/register`) and login (`/login`). Logout function.
* **Route Protection:** Protect routes like `/profile`, `/wishlist`, and `/checkout` using `middleware.ts`. Prevent authenticated users from accessing `/login` and `/register`.
* **Cart Management:** Usable without authentication, persisted in `localStorage`, and managed with Context API. Quantity updates, item removal, and total calculation/display.
* **Wishlist Management:** Accessible only to authenticated users, stored on the user's account via the API, and managed with Context API.
* **Checkout Flow:** Multi‑step (Address, Payment, Confirmation) checkout process. Unauthenticated users are redirected to login and returned back. Secure order creation with Server Action. After a successful order, the cart is cleared and the user is redirected to the confirmation page.
* **Profile Page:** "Account" tab showing user information with address update capability.
* **Order History:** Fetch and list user's past orders from the API under `/profile?tab=orders`.
* **Styling:** Entire UI designed with Tailwind CSS to be modern, clean, and **responsive**.
* **Extra Features:** Advanced search, toast notifications (react-hot-toast), promo code application.

---

## Technologies Used

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **Data Fetching:** Axios
* **API:** Express.js + json-server (deployed on Render)
* **Deployment:** Vercel (Frontend), Render (API)
* **UI/UX:** react-hot-toast, lucide-react (icons)

---

## Local Setup and Run

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ilkeratar/mobiversite-ecommerce
    cd mobiversite-ecommerce
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set environment variable:** Create a file named `.env.local` in the project root and add your local API address:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```
4.  **Start development servers:** Start both the Next.js frontend and the Express API server (which will use the local `db.json`) simultaneously:
    ```bash
    npm run start:all
    ```
    This will start the following addresses:
    * Frontend: `http://localhost:3000`
    * API: `http://localhost:3001`

---

## Design Decisions and Rationale

* **API Approach (Express on Render vs `my-json-server`):** The test case required a local `json-server` and Vercel deployment. These are incompatible (Vercel cannot reach `localhost`), so a persistent mock API was needed for the live demo. `my-json-server` was considered, but because it doesn't persist `POST/PUT` requests, validating critical scenarios like order history on the live demo would be impossible. Therefore, to remain faithful to the spirit of the test case and to provide a fully functional demo, a simple Express API wrapping `json-server` logic was implemented and deployed for free on Render. This provided persistence and improved testability.
* **Use of TypeScript:** Given the project scope and modern frontend expectations, TypeScript was chosen to ensure type safety, better IntelliSense, and long‑term maintainability.
* **State Management (Context API):** As required by the test case, React Context API was used for global state. It was sufficient and performant for the current project size. Logical separation was made as `AuthContext`, `CartContext`, and `WishlistContext`. Cart data (`CartContext`) is stored in `localStorage` for anonymous users, while the Wishlist (`WishlistContext`) is stored on the user's account via the API (inside the `user` object in `db.json`) since it must be user‑specific.
* **Authentication (Server Actions + Context):** A hybrid approach was adopted for security and alignment with Next.js App Router architecture. Sensitive operations like registration, login, and logout were handled server‑side using **React Server Actions**, where `httpOnly` cookies are set/cleared. Route protection is handled by `middleware.ts`. Client‑side UI state (e.g., showing the username in the Navbar) is managed via `AuthContext`, which is fed at the server (`RootLayout`) and consumed with the `useAuth` hook. This maximizes security and avoids unnecessary client‑side API calls.
* **API Communication (Axios):** Per the test case, Axios is used for all API requests. Requests are made through a centralized Axios instance in `lib/apiClient.ts`. Error handling was developed to include HTTP status codes returned by the API (such as 404 detection in `page.tsx`).
* **UI/UX Improvements:** To achieve the test case goal of a "clean, responsive, user‑friendly" UI, a modern design was implemented with Tailwind CSS. `react-hot-toast` was integrated for user feedback. Loading states (spinners) are shown during API requests (Wishlist, Checkout) and fast client‑side operations (Cart). The `/checkout` page was designed as a multi‑step flow to improve UX. Suspense and 404 states are managed via `loading.tsx` and `not-found.tsx`.

---

## Bonus Features

* **Cart Persistence:** Unauthenticated users' carts are stored in `localStorage`.
* **Responsive Design:** The site adapts to various screen sizes.
* **Loading Simulation:** While fetching data in server components with `await wait()`, and during client/API interactions using `setTimeout` or real API latency, loading states are simulated/shown.
* **Clean Folder/Route Structure:** Route groups like `(main)`, `(auth)`, and `(protected)` are used under the `app` directory. UI consistency is ensured via `layout.tsx` files.
* **Meaningful Redirects:** Flows like redirecting to the appropriate page after login/registration via a `redirect` parameter, and redirection to the confirmation and profile pages after checkout are implemented.
* **Extras:** Promo code system, advanced search bar, toast notifications, multi‑step checkout, order confirmation page.