namespace WebApplication8.DTOs.PropertyListingDTOs
{
    public class EditPropertyListingDTO
    {
        public Guid id { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public string? address { get; set; }
        public List<string>? imageUrls { get; set; }
        public decimal? price { get; set; }
        public Boolean? isActive { get; set; }
        public PropertyTypesEnum? propertyType { get; set; }
        public PropertyStateEnum? propertyState { get; set; }
    }
}
