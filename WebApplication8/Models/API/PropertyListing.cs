using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication8.Models.API
{
    public class PropertyListing
    {
        [Key]
        public Guid id { get; set; }
        public required string title { get; set; }
        public required string description { get; set; }
        public required string address { get; set; }
        public List<string> imagesUrls { get; set; } = new List<string>();
        [Precision(18,10)]
        public required decimal price { get; set; }
        public required int state { get; set; }
        public DateTime? latestActiveDate { get; set; } = null; 
        public required DateTime createdAt { get; set; }
        public required int propertyType {get; set;}
        public required Guid userId { get; set; }
        public required User User { get; set; }
        public List<PropertyView> PropertiesViews { get; set; } = new List<PropertyView>();
    }
}
