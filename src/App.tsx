import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/app/page";
import ListPage from "@/app/list/page";
import SinglePage from "@/app/[slug]/page";
import AdminDashboard from "@/app/admin/page";
import Loader from "@/components/Loader";
import DealsPage from "@/app/deals/page";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import CartPage from "@/app/cart/page";
import OrdersPage from "@/app/orders/page";
import CheckoutPage from "@/app/checkout/page";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <>
      <Loader key={location.pathname} />
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/:slug" element={<SinglePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </Layout>
    </BrowserRouter>
  );
}

export default App;
