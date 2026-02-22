import { TransactionProvider } from './context/TransactionContext';
import HomePage from './pages/HomePage';
import ChartPage from './pages/ChartPage';
import SetTransactionPage from './pages/SetTransactionPage';
import NotesPage from './pages/NotesPage';
import NewsPage from './pages/NewsPage';  
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { newsLoader } from './utils/newsLoader';
import NewsErrorPage from './pages/NewsErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/set-transaction',
    element: <SetTransactionPage />,
  },
  {
    path: '/charts',
    element: <ChartPage />,
  },
  {
    path: '/notes',
    element: <NotesPage />,
  },
  {
    path: '/news',
    element: <NewsPage />,
    loader: newsLoader,
    errorElement: <NewsErrorPage />,
  },
]);

export default function App() {
  return (
    <TransactionProvider>
      <RouterProvider router={router} />
    </TransactionProvider>
  );
}

