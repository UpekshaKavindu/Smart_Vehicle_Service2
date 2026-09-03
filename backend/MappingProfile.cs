using AutoMapper;
using Backend.DTOs;
using Backend.Models;

namespace Backend
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Customer, CustomerResponseDto>()
                .ForMember(dest => dest.VehicleCount, opt => opt.MapFrom(src => src.Vehicles.Count));
            CreateMap<CustomerCreateDto, Customer>();
            CreateMap<CustomerUpdateDto, Customer>(); // if you make separate
        }
    }
}