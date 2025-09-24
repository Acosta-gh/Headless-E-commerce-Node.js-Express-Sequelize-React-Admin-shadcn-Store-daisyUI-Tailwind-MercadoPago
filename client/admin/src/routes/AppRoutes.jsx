import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Loading from "@/components/ui/Loading";

const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/admin/Products"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Categories = lazy(() => import("../pages/admin/Categories"));
export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-4"><Loading /></div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          {/* Rutas protegidas */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
          </Route>
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}