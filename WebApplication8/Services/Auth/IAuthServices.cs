using WebApplication8.DTOs.AuthDTOs;

namespace WebApplication8.Services.Auth
{
    public interface IAuthServices
    {
        Task<TokenResponseDTO> LoginAsync( HttpRequest request,HttpResponse response, loginDTO loginData);
        Task<TokenResponseDTO> RefreshTokensAsync(string refreshToken);
        Task LogoutAsync(string refreshToken); 
    }
}
