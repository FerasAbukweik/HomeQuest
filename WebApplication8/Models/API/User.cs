using System.ComponentModel.DataAnnotations;
using WebApplication8.Models.Token;

namespace WebApplication8.Models.API
{
    public class User
    {
        [Key]
        public Guid id { get; set; }
        public required string userName { get; set; }
        public required string passwordHash { get; set; }
        public required string email { get; set; }
        public required string phoneNumber { get; set; }
        public required string firstName { get; set; }
        public required string lastName { get; set; }
        public UserRoles role { get; set; } = UserRoles.User;
        public List<RefreshToken> refreshTokens { get; set; } = new List<RefreshToken>();
        public List<PropertyListing> propertiesListings { get; set; } = new List<PropertyListing>();
        public List<PropertyView> PropertiesViews { get; set; } = new List<PropertyView>();
    }
}
