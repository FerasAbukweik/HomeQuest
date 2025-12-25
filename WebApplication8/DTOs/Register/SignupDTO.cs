namespace WebApplication8.DTOs.RegisterDTOs
{
    public class SignupDTO
    {
        public required string userName { get; set; }
        public required string password { get; set; }
        public required string email { get; set; }
        public required string phoneNumber { get; set; }
        public required string firstName { get; set; }
        public required string lastName { get; set; }
    }
}
