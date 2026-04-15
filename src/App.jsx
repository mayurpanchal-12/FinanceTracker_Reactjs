import { TransactionProvider } from './context/TransactionContext';
import { BudgetProvider } from './context/BudgetContext';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { newsLoader } from './utils/newsLoader';
import ErrorBoundary from './components/ErrorBoundry';
import PageLoader from './components/PageLoader';
import NewsErrorPage from './pages/NewsErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import './App.css';
import Wildcard from './pages/wildcard';
import About from './pages/about';

const HomePage = lazy(() => import('./pages/HomePage'));
const ChartPage = lazy(() => import('./pages/ChartPage'));
const SetTransactionPage = lazy(() => import('./pages/SetTransactionPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const ManageViewersPage = lazy(() => import('./pages/ManageViewersPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const VaultPage = lazy(() => import('./pages/VaultPage'));


const withEB = (element) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {element}
    </Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: withEB(<HomePage />),
      },
      {
        path: 'set-transaction',
        element: (
          <ProtectedRoute adminOnly>
            {withEB(<SetTransactionPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'charts',
        element: withEB(<ChartPage />),
      },
      {
        path: 'insights',
        element: withEB(<InsightsPage />),
      },
      {
        path: 'manage-viewers',
        element: (
          <ProtectedRoute adminOnly>
            {withEB(<ManageViewersPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'budget',
        element: withEB(<BudgetPage />),
      },
      {
        path: 'notes',
        element: withEB(<NotesPage />),
      },
      {
     path: 'vault',
    element: withEB(<VaultPage />),
     },
      {
        path: 'news',
        element: withEB(<NewsPage />),
        loader: newsLoader,
        errorElement: <NewsErrorPage />,
      },
      {
        path: 'about',
        element:withEB(<About />),
  
      }
    ],
  },
  {
    path: '*',
    element: <Wildcard />,
  },
],
{
  future: {
    v7_startTransition: true,
  },
});

export default function App() {
  return (
    <BudgetProvider>
      <TransactionProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </TransactionProvider>
    </BudgetProvider>
  );
}