import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerCreatePage from './pages/CustomerCreatePage';
import CustomerEditPage from './pages/CustomerEditPage';
import Navbar from './components/common/NavBar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CustomersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/create" element={<CustomerCreatePage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
        <Route path="*" element={<div>404 – Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}