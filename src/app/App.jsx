import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BudgetProvider } from "../features/Budget/context/BudgetContext";
import { TransactionProvider } from "../context/TransactionContext";
import NewsErrorPage from "../features/news/pages/NewsErrorPage";
import { newsLoader } from "../features/news/utils/newsLoader";
import About from "../pages/about";
import Wildcard from "../pages/wildcard";
import PageLoader from "../shared/components/ui/PageLoader";
import "./App.css";
import DashboardLayout from "./DashboardLayout";
import ErrorBoundry from "../shared/components/ui/ErrorBoundry";
import ProtectedRoute from "./ProtectedRoute";

const HomePage = lazy(() => import("../pages/HomePage"));
const ChartPage = lazy(() => import("../features/chart/pages/ChartPage"));
const SetTransactionPage = lazy(() => import("../features/transactions/pages/SetTransactionPage"));
const NotesPage = lazy(() => import("../features/notes/pages/NotesPage"));
const NewsPage = lazy(() => import("../features/news/pages/NewsPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const InsightsPage = lazy(() => import("../features/insights/pages/InsightsPage"));
const ManageViewersPage = lazy(
  () => import("../features/viewers/pages/ManageViewersPage"),
);
const BudgetPage = lazy(() => import("../features/budget/pages/BudgetPage"));
const VaultPage = lazy(() => import("../features/vault/pages/VaultPage"));

const withEB = (element) => (
  <ErrorBoundry>
    <Suspense fallback={<PageLoader />}>{element}</Suspense>
  </ErrorBoundry>
);

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: (
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      path: "/",
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
          path: "set-transaction",
          element: (
            <ProtectedRoute adminOnly>
              {withEB(<SetTransactionPage />)}
            </ProtectedRoute>
          ),
        },
        {
          path: "charts",
          element: withEB(<ChartPage />),
        },
        {
          path: "insights",
          element: withEB(<InsightsPage />),
        },
        {
          path: "manage-viewers",
          element: (
            <ProtectedRoute adminOnly>
              {withEB(<ManageViewersPage />)}
            </ProtectedRoute>
          ),
        },
        {
          path: "budget",
          element: withEB(<BudgetPage />),
        },
        {
          path: "notes",
          element: withEB(<NotesPage />),
        },
        {
          path: "vault",
          element: withEB(<VaultPage />),
        },
        {
          path: "news",
          element: withEB(<NewsPage />),
          loader: newsLoader,
          errorElement: <NewsErrorPage />,
        },
        {
          path: "about",
          element: withEB(<About />),
        },
      ],
    },
    {
      path: "*",
      element: <Wildcard />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  },
);

export default function App() {
  return (
    <BudgetProvider>
      <TransactionProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </TransactionProvider>
    </BudgetProvider>
  );
}
