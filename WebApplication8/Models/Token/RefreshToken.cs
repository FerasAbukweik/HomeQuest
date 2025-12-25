using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication8.Models.API;

namespace WebApplication8.Models.Token
{
    public class RefreshToken
    {
        [Key]
        public Guid id { get; set; }
        public required string refreshToken { get; set; }
        public required DateTime expiryDate { get; set; }
        public required DateTime createdDate { get; set; }
        [ForeignKey("User")]
        public Guid userId { get; set; }
        public User User { get; set; }
    }
}
