using Backend.DTOs;

namespace Backend.Services
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerResponseDto>> GetAllAsync();
        Task<CustomerResponseDto?> GetByIdAsync(int id);
        Task<CustomerResponseDto> CreateAsync(CustomerCreateDto dto);
        Task<CustomerResponseDto?> UpdateAsync(int id, CustomerUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<CustomerResponseDto>> SearchAsync(string? searchTerm);
    }
}