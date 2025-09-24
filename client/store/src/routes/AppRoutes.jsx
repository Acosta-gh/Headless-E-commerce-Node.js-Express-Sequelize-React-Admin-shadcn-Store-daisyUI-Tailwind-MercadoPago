import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "@/components/ui/Loading";

const Layout = lazy(() => import("@/components/Layout"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profile"));
const Logout = lazy(() => import("@/pages/Logout"));
const Cart = lazy(() => import("@/pages/Cart"));
const Register = lazy(() => import("@/pages/Register"));
const Verify = lazy(() => import("@/pages/Verify"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Product = lazy(() => import("@/pages/Product"));
export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="logout" element={<Logout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<Verify />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
