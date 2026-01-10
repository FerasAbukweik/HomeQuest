namespace WebApplication8.DTOs.PropertyListing
{
    public class FilterPropertiesDataDTO
    {
        public decimal? minPrice { get; set; }
        public decimal? maxPrice { get; set; }
        public DateTime? createdFrom { get; set; }
        public DateTime? createdTo { get; set; }
        public Boolean? sortByDate { get; set; }
        public long propertyType { get; set; } = 0;
        public long propertyState { get; set; } = 0;
        public string? title { get; set; }
    }
}
