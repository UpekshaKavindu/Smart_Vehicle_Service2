/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { customerApi } from '../api/customerApi';
import CustomerList from '../components/customers/CustomerList';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCustomers = async (search = '') => {
    setLoading(true);
    try {
      const data = await customerApi.getAll(search);
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = (search) => loadCustomers(search);
  const handleDelete = (id) => setCustomers(prev => prev.filter(c => c.id !== id));

  return (
    <div className="container mt-4">
      <h2>Customer Management</h2>
      <CustomerList
        customers={customers}
        loading={loading}
        error={error}
        onSearch={handleSearch}
        onDelete={handleDelete}
      />
    </div>
  );
}