
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteDataProvider } from "@/contexts/SiteDataContext";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import ColorManager from "./pages/ColorManager";
import ImageManager from "./pages/ImageManager";
import ReviewModerator from "./pages/ReviewModerator";
import LinkManager from "./pages/LinkManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteDataProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/painel" element={<AdminPanel />} />
            <Route path="/admin/colors" element={<ColorManager />} />
            <Route path="/admin/images" element={<ImageManager />} />
            <Route path="/admin/reviews" element={<ReviewModerator />} />
            <Route path="/admin/links" element={<LinkManager />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SiteDataProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
