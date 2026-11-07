# 💻 Vortex-Buy — Frontend

React + Vite + TypeScript web application for the **Vortex-Buy** e-commerce platform.

For the full project overview, backend instructions, and complete architecture, refer to the root [README.md](../README.md).

---

## 🚀 Features

- **Product Catalog & Filters**: Explore products by category, keyword search, price sliders, and sorting options.
- **Product Details & Reviews**: Multi-image galleries, customizable variants, stock status, and user ratings/reviews.
- **Cart & Zustand Store**: Client-side cart state synchronized with MongoDB.
- **Streamlined Checkout**: Address management, order summary, and Razorpay + COD payment flow.
- **User Dashboard**: Profile management, OTP verification modal, and order history with status tracking and cancellation.
- **Responsive UI**: Styled using Tailwind CSS and React Icons.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in this directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📜 Available Scripts

- `npm run dev` — Starts the local Vite development server with hot module replacement.
- `npm run build` — Compiles TypeScript and creates an optimized production bundle in `dist/`.
- `npm run preview` — Locally previews the generated production build.
- `npm run lint` — Runs ESLint to check for code quality and syntax issues.

