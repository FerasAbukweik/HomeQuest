using System.ComponentModel.DataAnnotations.Schema;
using WebApplication8.Models.API;

namespace WebApplication8.DTOs.PropertyListingDTOs
{
    public class PropertyDTO
    {
        public Guid id { get; set; }
        public required string title { get; set; }
        public required string description { get; set; }
        public required string address { get; set; }
        public List<string> imagesUrls { get; set; } = new List<string>();
        public required decimal price { get; set; }
        public required DateTime createdAt { get; set; }
        public Guid userId { get; set; }
        public required int propertyType { get; set; }
        public required int state { get; set; }
    }
}
