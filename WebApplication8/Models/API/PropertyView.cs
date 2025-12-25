using Azure.Core.Pipeline;

namespace WebApplication8.Models.API
{
    public class PropertyView
    {
        public Guid id { get; set; }
        public Guid userId { get; set; }
        public User User { get; set; }
        public Guid propertyLisingId { get; set; }
        public PropertyListing PropertyListing { get; set; }
        public DateTime viewedAt { get; set; } = DateTime.UtcNow;
    }
}
