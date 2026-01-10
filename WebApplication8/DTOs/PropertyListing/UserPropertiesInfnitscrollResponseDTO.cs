namespace WebApplication8.DTOs.PropertyListing
{
    public class UserPropertiesInfnitscrollResponseDTO
    {
        public required List<UserPropertyCardDataDTO> propertiesListings { get; set; }
        public required long currTaken { get; set; }
        public required bool isMoreAvaiable { get; set; }
    }
}
