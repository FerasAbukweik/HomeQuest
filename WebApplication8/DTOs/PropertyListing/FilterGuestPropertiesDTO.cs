using Azure.Core.Pipeline;
using WebApplication8.DTOs.infinitScrollDTOs;

namespace WebApplication8.DTOs.PropertyListing
{
    public class FilterGuestPropertiesDTO
    {
        public required GuestFilterDataDTO filterData { get; set; }
        public required InfinitScrollDTO infinitScrollData { get; set; }
    }
}
