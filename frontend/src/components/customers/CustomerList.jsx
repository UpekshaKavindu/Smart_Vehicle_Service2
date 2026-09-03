import { useState } from 'react';
import { Link } from 'react-router-dom';
import { customerApi } from '../../api/customerApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

export default function CustomerList({ customers, loading, error, onSearch, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setDeletingId(id);
      try {
        await customerApi.delete(id);
        onDelete(id);
      } catch (err) {
        alert(err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearchTerm(''); onSearch(''); }}>Clear</button>
        </form>
        <Link to="/customers/create" className="btn btn-success">Add Customer</Link>
      </div>

      {customers.length === 0 ? (
        <div className="alert alert-info">No customers found.</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Vehicles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.vehicleCount || 0}</td>
                <td>
                  <Link to={`/customers/${c.id}`} className="btn btn-sm btn-info me-1">View</Link>
                  <Link to={`/customers/${c.id}/edit`} className="btn btn-sm btn-warning me-1">Edit</Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                  >
                    {deletingId === c.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}