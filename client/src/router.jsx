import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './pages/Homepage'
import ProductsPage from './pages/ProductsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
    ],
  },
])
