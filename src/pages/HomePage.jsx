import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import Filters from '../components/Filters';
import Summary from '../components/Summary';
import TransactionTable from '../components/TransactionTable';

export default function HomePage() {
  return (
    <>
      <Header />
      <TransactionForm />
      <Filters />
      <Summary />
      <TransactionTable />
    </>
  );
}
