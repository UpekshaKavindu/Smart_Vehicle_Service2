using AutoMapper;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CustomerService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CustomerResponseDto>> GetAllAsync()
        {
            var customers = await _context.Customers
                .Include(c => c.Vehicles)
                .ToListAsync();
            return _mapper.Map<IEnumerable<CustomerResponseDto>>(customers);
        }

        public async Task<CustomerResponseDto?> GetByIdAsync(int id)
        {
            var customer = await _context.Customers
                .Include(c => c.Vehicles)
                .FirstOrDefaultAsync(c => c.Id == id);
            return customer == null ? null : _mapper.Map<CustomerResponseDto>(customer);
        }

        public async Task<CustomerResponseDto> CreateAsync(CustomerCreateDto dto)
        {
            // Check for duplicate email
            var exists = await _context.Customers.AnyAsync(c => c.Email == dto.Email);
            if (exists)
                throw new InvalidOperationException("A customer with this email already exists.");

            var customer = _mapper.Map<Customer>(dto);
            customer.CreatedAt = DateTime.UtcNow;
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return _mapper.Map<CustomerResponseDto>(customer);
        }

        public async Task<CustomerResponseDto?> UpdateAsync(int id, CustomerUpdateDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return null;

            // Check for duplicate email (excluding self)
            var duplicate = await _context.Customers
                .AnyAsync(c => c.Email == dto.Email && c.Id != id);
            if (duplicate)
                throw new InvalidOperationException("Another customer with this email already exists.");

            _mapper.Map(dto, customer);
            await _context.SaveChangesAsync();

            return _mapper.Map<CustomerResponseDto>(customer);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CustomerResponseDto>> SearchAsync(string? searchTerm)
        {
            var query = _context.Customers.Include(c => c.Vehicles).AsQueryable();
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.Trim().ToLower();
                query = query.Where(c =>
                    c.FirstName.ToLower().Contains(searchTerm) ||
                    c.LastName.ToLower().Contains(searchTerm) ||
                    c.Email.ToLower().Contains(searchTerm) ||
                    c.Phone.Contains(searchTerm)
                );
            }
            var customers = await query.ToListAsync();
            return _mapper.Map<IEnumerable<CustomerResponseDto>>(customers);
        }
    }
}