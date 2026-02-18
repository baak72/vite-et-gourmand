import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserProfile } from './utils/firebase';
import { useAuthStore } from './store/useAuthStore';
import { ReactLenis } from 'lenis/react'
import { ChefHat } from 'lucide-react';
import 'lenis/dist/lenis.css'
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomeView from './views/HomeView';
import MenusView from './views/MenusView';
import ContactView from './views/ContactView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilView from './views/ProfilView';
import MenuDetailView from './views/MenuDetailView';
import CommandeView from './views/CommandeView';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import EmployeeDashboardView from './views/EmployeeDashboardView';
import MentionsLegalesView from './views/MentionsLegalesView';
import CGVView from './views/CGVView';
import AdminDashboardView from './views/AdminDashboardView';

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      { path: "/", element: <HomeView /> },
      { path: "/menus", element: <MenusView /> },
      { path: "/contact", element: <ContactView /> },
      { path: "/login", element: <LoginView /> },
      { path: "/register", element: <RegisterView /> },
      { path: "/menu/:menuId", element: <MenuDetailView /> },
      { path: "/mentions-legales", element: <MentionsLegalesView /> },
      { path: "/cgv", element: <CGVView /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profil", element: <ProfilView /> },
          { path: "/commande/:menuId", element: <CommandeView /> }
        ]
      },
      {
        element: <RoleProtectedRoute />,
        children: [
          { path: "/employe/dashboard", element: <EmployeeDashboardView /> },
          { path: "/admin/dashboard", element: <AdminDashboardView /> }
        ]
      }, 
    ], 
  }
]);

const loadingMessages = [
  "Préchauffage des fourneaux...",
  "Sélection des produits...",
  "Dressage des assiettes...",
  "Vite et Gourmand arrive..."
];

function App() {
  
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  
  // Création de l'état de chargement
  const [authReady, setAuthReady] = useState(false);
  
  // État pour le message de chargement
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // --- Effet pour faire tourner les messages ---
  useEffect(() => {
    if (authReady) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [authReady]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profileData = await getUserProfile(user.uid);
        const fullUserData = {
          uid: user.uid,
          email: user.email,
          ...profileData
        };
        
        setUser(fullUserData);
      } else {
        clearUser(); 
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  // --- ÉCRAN DE CHARGEMENT LUXE ---
  if (!authReady) {
    return (
      <div className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center font-sans">
         {/* Styles d'animation injectés directement */}
         <style>{`
           @keyframes progress-indeterminate {
             0% { transform: translateX(-100%); }
             50% { transform: translateX(0%); }
             100% { transform: translateX(100%); }
           }
           .animate-progress-indeterminate {
             animation: progress-indeterminate 1.5s infinite linear;
           }
           .font-playfair { font-family: 'Playfair Display', serif; }
           .font-montserrat { font-family: 'Montserrat', sans-serif; }
         `}</style>

         {/* Cercle Animé */}
         <div className="relative flex items-center justify-center w-24 h-24 mb-8">
           <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-amber-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
           <div className="absolute inset-2 rounded-full border-2 border-white/5 border-b-amber-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
           <div className="animate-pulse text-white">
               <ChefHat size={32} />
           </div>
         </div>

         {/* Titre */}
         <h1 className="font-playfair text-2xl text-white font-bold tracking-widest uppercase mb-4 animate-in fade-in zoom-in duration-700">
           Vite <span className="text-amber-500 italic">&</span> Gourmand
         </h1>

         {/* Message Changeant */}
         <p className="text-amber-500/80 font-montserrat text-xs uppercase tracking-[0.2em] animate-pulse min-h-[20px] text-center px-4">
           {loadingMessages[loadingMsgIndex]}
         </p>

         {/* Barre de progression décorative */}
         <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
           <div className="h-full bg-amber-500 animate-progress-indeterminate origin-left"></div>
         </div>
      </div>
    );
  }
  
  return (
    <ReactLenis root>
      <RouterProvider router={router} />
    </ReactLenis>
  );
}

export default App;