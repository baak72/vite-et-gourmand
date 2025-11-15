import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import MenusView from './views/MenusView';
import ContactView from './views/ContactView';
import LoginView from './views/LoginView';

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
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
