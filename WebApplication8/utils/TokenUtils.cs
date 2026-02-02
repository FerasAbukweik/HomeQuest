using WebApplication8.DTOs.AuthDTOs;
using WebApplication8.Models.Token;

public class TokenUtils
{
    public const string RefreshToken = "RefreshToken";
    public const string AccessToken = "AccessToken";
    public const string TokensRefreshed = "TokensRefreshed";

    public static void saveTokens(HttpResponse response , TokenResponseDTO tokens)
    {
        CookiesUtils.SaveToHTTPOnlyCookie(response, TokenUtils.RefreshToken, tokens.refreshToken, DateTime.UtcNow.AddDays(30));
        CookiesUtils.SaveToHTTPOnlyCookie(response, TokenUtils.AccessToken, tokens.accessToken, DateTime.UtcNow.AddMinutes(15));
    }
}