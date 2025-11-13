import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import MenusView from './views/MenusView';
import ContactView from './views/ContactView';
// (Importation de  LoginView, etc. ici plus tard)

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
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
