using System.ComponentModel.DataAnnotations;
using WebApplication8.Models.Token;

namespace WebApplication8.Models.API
{
    public class User
    {
        [Key]
        public Guid id { get; set; }
        [Required(ErrorMessage = "userName is Required")]
        public string? userName { get; set; }
        [Required(ErrorMessage = "passwordHash is Required")]
        public string? passwordHash { get; set; }
        [Required(ErrorMessage = "email is Required")]
        public string? email { get; set; }
        [Required(ErrorMessage = "phoneNumber is Required")]
        public string? phoneNumber { get; set; }
        [Required(ErrorMessage = "firstName is Required")]
        public string? firstName { get; set; }
        [Required(ErrorMessage = "lastName is Required")]
        public string? lastName { get; set; }
        [Required(ErrorMessage = "role is Required")]
        public UserRoles role { get; set; } = UserRoles.User;
        public List<RefreshToken> refreshTokens { get; set; } = new List<RefreshToken>();
        public List<PropertyListing> propertiesListings { get; set; } = new List<PropertyListing>();
        public List<PropertyView> PropertiesViews { get; set; } = new List<PropertyView>();
    }
}
