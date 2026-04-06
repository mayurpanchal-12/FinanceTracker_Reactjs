import { useAuth } from '../context/AuthContext';

import TransactionForm from '../components/TransactionForm';
import Filters from '../components/Filters';
import Summary from '../components/Summary';
import TransactionTable from '../components/TransactionTable';
import { SkeletonSummary , SkeletonTable } from '../components/Skeleton';
import { useTransactions } from '../context/TransactionContext';

export default function HomePage() {
  const { role, adminEmail } = useAuth();
  const {loading} = useTransactions();
  if (loading) return <div className="p-4 flex flex-col gap-4"><SkeletonSummary count={3} />
    <SkeletonTable rows={6} /></div>;
  return (
    <>

      {role === 'admin' && <TransactionForm />}
      {role === 'viewer' && (
        <div className="card px-6 py-3 my-2 flex items-center gap-2 border-l-4 border-l-blue-400">
          <span className="text-blue-500 text-sm">👁</span>
          <p className="text-sm text-text-light font-medium">
            You are viewing{' '}
            {adminEmail ? (
              <span className="font-bold text-text-main">{adminEmail}</span>
            ) : (
              'someone'
            )}
            's data in{' '}
            <span className="font-bold text-blue-500">Viewer mode</span> — read only.
          </p>
        </div>
      )}
      <Filters />
      <Summary />
      <TransactionTable />
    </>
  );
}