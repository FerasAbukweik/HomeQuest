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
        public required int propertyType { get; set; }
        public required int propertyState { get; set; }
    }
}
