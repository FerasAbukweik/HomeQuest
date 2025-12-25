namespace WebApplication8.DTOs.PropertyListing
{
    public class UserDashBoardData
    {
        public required List<UserPropertyCardDataDTO> propertiesCardData { get; set; }
        public required long numberOfActiveListings { get; set; }
        public required long numOfActiveListingsLastMonth { get; set; }
        public required long totalViews { get; set; }
        public required long totalViewsLastMonth { get; set; }
    }
}