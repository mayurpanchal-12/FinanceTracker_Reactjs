


import { TransactionProvider } from './context/TransactionContext';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { newsLoader } from './utils/newsLoader';
import ErrorBoundary from './components/ErrorBoundry';
import PageLoader from './components/PageLoader';
import NewsErrorPage from './pages/NewsErrorPage';
import './App.css';
import Wildcard from './pages/wildcard';

const HomePage = lazy(() => import('./pages/HomePage'));
const ChartPage = lazy(() => import('./pages/ChartPage'));
const SetTransactionPage = lazy(() => import('./pages/SetTransactionPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/set-transaction',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
          <SetTransactionPage />
        </ErrorBoundary>
      </Suspense>
    ),
  },
  {
    path: '/charts',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
          <ChartPage />
        </ErrorBoundary>
      </Suspense>
    ),
  },
  {
    path: '/notes',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
          <NotesPage />
        </ErrorBoundary>
      </Suspense>
    ),
  },
  {
    path: '/news',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
          <NewsPage />
        </ErrorBoundary>
      </Suspense>
    ),
    loader: newsLoader,
    errorElement: <NewsErrorPage />,
  },
    {
    path: '*',
    element: (
      <Wildcard/>
    ),
   
  },
]);

export default function App() {
  return (
    <TransactionProvider>
      <RouterProvider router={router} />
    </TransactionProvider>
  );
}