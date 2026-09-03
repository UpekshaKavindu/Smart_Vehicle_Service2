import CustomerForm from '../components/customers/CustomerForm';
import { customerApi } from '../api/customerApi';

export default function CustomerCreatePage() {
  const handleSubmit = (data) => customerApi.create(data);
  return (
    <div className="container mt-4">
      <h2>Create Customer</h2>
      <CustomerForm onSubmit={handleSubmit} submitLabel="Create" />
    </div>
  );
}