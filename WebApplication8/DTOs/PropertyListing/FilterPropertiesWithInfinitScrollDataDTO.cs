using Azure.Core.Pipeline;
using WebApplication8.DTOs.infinitScrollDTOs;

namespace WebApplication8.DTOs.PropertyListing
{
    public class FilterPropertiesWithInfinitScrollDataDTO
    {
        public required FilterPropertiesDataDTO filterData { get; set; }
        public required InfinitScrollDTO infinitScrollData { get; set; }
    }
}
