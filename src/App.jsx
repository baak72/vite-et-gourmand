import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserProfile } from './utils/firebase';
import { useAuthStore } from './store/useAuthStore';

import Layout from './components/Layout';
import HomeView from './views/HomeView';
import MenusView from './views/MenusView';
import ContactView from './views/ContactView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilView from './views/ProfilView';

const router = createBrowserRouter([
  {
    element: <Layout />,
    // (Possiblité d'ajouter une page d'erreur ici plus tard)
    children: [
      {
        path: "/",
        element: <HomeView />,
      },
      {
        path: "/menus",
        element: <MenusView />,
      },
      {
        path: "/contact",
        element: <ContactView />,
      },
      { path: "/login", 
        element: <LoginView />,
      },
      {
        path: "/register",
        element: <RegisterView />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profil",
            element: <ProfilView />, 
          }
        ]
      } 
    ], 
  }
]);

function App() {
  
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  
  // Création de l'état de chargement
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profileData = await getUserProfile(user.uid);
        const fullUserData = {
          uid: user.uid,
          email: user.email,
          ...profileData // Contient nom, prenom, telephone, role_id...
        };
        
        setUser(fullUserData);
      } else {
        clearUser(); 
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  // 8. On n'affiche RIEN tant que le travail de vérification n'est pas terminé
  if (!authReady) {
    return <div>Chargement de l'application...</div>; // (ou un spinner)
  }
  
  return (
    <RouterProvider router={router} />
  );
}

export default App;
