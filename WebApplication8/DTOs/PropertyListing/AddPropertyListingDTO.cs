using System.ComponentModel.DataAnnotations.Schema;
using WebApplication8.Models.API;

namespace WebApplication8.DTOs.PropertyListingDTOs
{
    public class AddPropertyListingDTO
    {
        public required string title { get; set; }
        public required string description { get; set; }
        public required string address { get; set; }
        public List<string> imageUrls { get; set; } = new List<string>();
        public required decimal price { get; set; }
        public required int propertyType { get; set; }
        public required int propertyState { get; set; }
    }
}
