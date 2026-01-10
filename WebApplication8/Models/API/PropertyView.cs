using Azure.Core.Pipeline;
using System.ComponentModel.DataAnnotations;

namespace WebApplication8.Models.API
{
    public class PropertyView
    {
        [Key]
        public Guid id { get; set; }
        public Guid userId { get; set; }
        public User User { get; set; }
        public Guid propertyLisingId { get; set; }
        public PropertyListing PropertyListing { get; set; }
        public DateTime viewedAt { get; set; } = DateTime.UtcNow;
    }
}
