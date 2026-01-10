

using WebApplication8.DTOs.PropertyListing;

namespace WebApplication8.DTOs.infinitScrollDTOs
{
    public class GuestPropertyCardInfinitScrollResponseDTO
    {
        public required List<GuestPropertyCardDataDTO> propertiesListings { get; set; }
        public required long currTaken { get; set; }
        public required bool isMoreAvaiable { get; set; }
    }
}
