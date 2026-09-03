import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customerApi } from '../api/customerApi';
import CustomerForm from '../components/customers/CustomerForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function CustomerEditPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await customerApi.getById(id);
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!customer) return <div>Customer not found</div>;

  const handleSubmit = (data) => customerApi.update(id, data);

  return (
    <div className="container mt-4">
      <h2>Edit Customer</h2>
      <CustomerForm initialData={customer} onSubmit={handleSubmit} submitLabel="Update" />
    </div>
  );
}