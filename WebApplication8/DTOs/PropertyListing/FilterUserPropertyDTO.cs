using WebApplication8.DTOs.infinitScrollDTOs;
using WebApplication8.DTOs.PropertyListing;

namespace WebApplication8.DTOs.PropertyListingDTOs
{
    public class FilterUserPropertiesDTO
    {
        public required UserFilterDataDTO filterData { get; set; }
        public required InfinitScrollDTO infinitScrollData { get; set; }
    }
}
