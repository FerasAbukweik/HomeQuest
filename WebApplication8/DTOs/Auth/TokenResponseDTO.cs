namespace WebApplication8.DTOs.AuthDTOs
{
    public class TokenResponseDTO
    {
        public required string accessToken { get; set; }
        public required string refreshToken { get; set; }
    }
}
