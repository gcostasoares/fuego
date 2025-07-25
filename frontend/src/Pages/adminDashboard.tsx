/*  src/Pages/AdminDashboard.tsx
    ───────────────────────────────────────────────────────────────
    • Sidebar visible from md: breakpoint (≥ 768 px).
    • On smaller screens a top bar with a burger icon opens a drawer.
    • All original section logic preserved.
*/

import React, { useState } from "react";
import {
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";                     // ← icons (lucide-react is already available)

import AdminDoctorsContent        from "./adminDoctorsContent";
import AdminPharmaciesContent     from "./adminPharmaciesContent";
import AdminProductsContent       from "./adminProductsContent";
import AdminCBDShopsContent       from "./adminCBDShopsContent";
import AdminGrowEquipmentsContent from "./adminGrowEquipmentsContent";
import AdminHeadShopsContent      from "./adminHeadShopsContent";
import AdminArticlesContent       from "./adminArticlesContent";
import AdminCarouselContent       from "./adminCarouselContent";
import AdminPartnerLogosContent   from "./adminPartnerLogosContent";
import AdminGalleryContent        from "./adminGalleryContent";
import AdminShopDescriptionsContent from "./adminShopDescriptionsContent";
import AdminUsersContent          from "./adminUsersContent";
import AdminOriginsContent        from "./adminOriginsContent";
import AdminManufacturersContent  from "./adminManufacturersContent";
import AdminSaleProductsContent   from "./adminSaleProductsContent";

type Section =
  | "products"
  | "doctors"
  | "pharmacies"
  | "cbdshops"
  | "headshops"
  | "growequipments"
  | "articles"
  | "carousel"
  | "partnerlogos"
  | "gallery"
  | "shopdescriptions"
  | "users"
  | "origins"
  | "manufacturers"
  | "saleproducts";

const AdminDashboard: React.FC = () => {
  /* auth guard (unchanged) */
  const stored = localStorage.getItem("user");
  const user   = stored ? JSON.parse(stored) : null;
  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-2xl font-semibold mb-4">Zugriff verweigert</h2>
          <p className="mb-6">
            Sie haben keine Berechtigung, diese Seite anzuzeigen.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  /* state */
  const [selected, setSelected]   = useState<Section>("doctors");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* helpers */
  const navItem = (key: Section, label: string) => (
    <li
      key={key}
      onClick={() => {
        setSelected(key);
        setMobileOpen(false); // close drawer on mobile after click
      }}
      className={`cursor-pointer px-4 py-2 rounded ${
        selected === key ? "bg-blue-100 font-medium" : "hover:bg-blue-50"
      }`}
    >
      {label}
    </li>
  );

  const renderContent = () => {
    switch (selected) {
      case "products":         return <AdminProductsContent />;
      case "doctors":          return <AdminDoctorsContent />;
      case "pharmacies":       return <AdminPharmaciesContent />;
      case "cbdshops":         return <AdminCBDShopsContent />;
      case "headshops":        return <AdminHeadShopsContent />;
      case "growequipments":   return <AdminGrowEquipmentsContent />;
      case "articles":         return <AdminArticlesContent />;
      case "carousel":         return <AdminCarouselContent />;
      case "partnerlogos":     return <AdminPartnerLogosContent />;
      case "gallery":          return <AdminGalleryContent />;
      case "shopdescriptions": return <AdminShopDescriptionsContent />;
      case "users":            return <AdminUsersContent />;
      case "origins":          return <AdminOriginsContent />;
      case "manufacturers":    return <AdminManufacturersContent />;
      case "saleproducts":     return <AdminSaleProductsContent />;
      default:                 return null;
    }
  };

  /* ─── JSX ─────────────────────────────────────────────────── */
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ========== Desktop sidebar (md and up) ========== */}
      <aside className="hidden md:block w-64 bg-white p-4 border-r shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            {navItem("products",         "Cannabisblüten")}
            {navItem("doctors",          "Ärzte")}
            {navItem("pharmacies",       "Apotheken")}
            {navItem("cbdshops",         "CBD Shops")}
            {navItem("headshops",        "Head Shops")}
            {navItem("growequipments",   "Grow Equipments")}
            {navItem("articles",         "Articles")}
            {navItem("carousel",         "Carousel")}
            {navItem("partnerlogos",     "Partner Logos")}
            {navItem("gallery",          "Gallery")}
            {navItem("shopdescriptions", "Shop Descriptions")}
            {navItem("users",            "Users")}
            {navItem("origins",          "Origins")}
            {navItem("manufacturers",    "Manufacturers")}
            {navItem("saleproducts",     "Sale Products")}
          </ul>
        </nav>
      </aside>

      {/* ========== Mobile top bar + burger (below md) ========== */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14
                         bg-white border-b shadow-sm flex items-center px-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <MenuIcon size={28} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">Admin Dashboard</h1>
      </header>

      {/* ========== Mobile drawer ========== */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          onClick={() => setMobileOpen(false)}
        >
          {/* overlay */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

          {/* drawer panel */}
          <div
            className="relative w-64 bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}  // keep clicks inside
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <CloseIcon size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 mt-2">
              Admin Dashboard
            </h2>
            <nav>
              <ul className="space-y-2">
                {navItem("products",         "Cannabisblüten")}
                {navItem("doctors",          "Ärzte")}
                {navItem("pharmacies",       "Apotheken")}
                {navItem("cbdshops",         "CBD Shops")}
                {navItem("headshops",        "Head Shops")}
                {navItem("growequipments",   "Grow Equipments")}
                {navItem("articles",         "Articles")}
                {navItem("carousel",         "Carousel")}
                {navItem("partnerlogos",     "Partner Logos")}
                {navItem("gallery",          "Gallery")}
                {navItem("shopdescriptions", "Shop Descriptions")}
                {navItem("users",            "Users")}
                {navItem("origins",          "Origins")}
                {navItem("manufacturers",    "Manufacturers")}
                {navItem("saleproducts",     "Sale Products")}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* ========== Main content ========== */}
      <main className="flex-1 p-6 overflow-auto mt-14 md:mt-0">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
