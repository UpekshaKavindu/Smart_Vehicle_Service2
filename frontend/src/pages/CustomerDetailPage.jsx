import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerApi } from '../api/customerApi';
import AiSummary from '../components/customers/AiSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function CustomerDetailPage() {
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

  return (
    <div className="container mt-4">
      <h2>Customer Details</h2>
      <div className="card">
        <div className="card-body">
          <p><strong>ID:</strong> {customer.id}</p>
          <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
          <p><strong>Created:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
          <p><strong>Vehicles:</strong> {customer.vehicleCount || 0}</p>
          <div className="d-flex gap-2 mt-3">
            <Link to={`/customers/${customer.id}/edit`} className="btn btn-warning">Edit</Link>
            <Link to="/customers" className="btn btn-secondary">Back to List</Link>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <AiSummary customerId={customer.id} />
    </div>
  );
}