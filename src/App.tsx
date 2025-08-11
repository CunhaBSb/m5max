import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContextSimple";
import { PrivateRoute } from "@/components/admin/PrivateRoute";
import { lazy, Suspense } from "react";
import Homepage from "./pages/Homepage";
import AdminLogin from "./pages/admin/AdminLogin";
import AcessoNegado from "./pages/admin/AcessoNegado";
import NotFound from "./pages/NotFound";

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEstoque = lazy(() => import("./pages/admin/AdminEstoque"));
const AdminOrcamentos = lazy(() => import("./pages/admin/AdminOrcamentos"));
const AdminEventos = lazy(() => import("./pages/admin/AdminEventos"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Aplicação Pública */}
            <Route path="/" element={<Homepage />} />
            
            {/* Aplicação Administrativa */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>}>
                  <AdminDashboard />
                </Suspense>
              </PrivateRoute>
            } />
            <Route path="/admin/estoque" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>}>
                  <AdminEstoque />
                </Suspense>
              </PrivateRoute>
            } />
            <Route path="/admin/orcamentos" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>}>
                  <AdminOrcamentos />
                </Suspense>
              </PrivateRoute>
            } />
            <Route path="/admin/eventos" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>}>
                  <AdminEventos />
                </Suspense>
              </PrivateRoute>
            } />
            <Route path="/admin/acesso-negado" element={<AcessoNegado />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
