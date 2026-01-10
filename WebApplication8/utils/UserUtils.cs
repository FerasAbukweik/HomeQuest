using System.Security.Claims;
using WebApplication8.Models.API;

public class UserUtils
{
    public static Guid GetUserId(ClaimsPrincipal user)
    {
        string? userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
        {
            throw new UnauthorizedAccessException("Invalid token");
        }
        return userId;
    }

    public static string GetUserClaim(ClaimsPrincipal user , string claim)
    {
        var userClaim = user.FindFirstValue(claim);
        if (string.IsNullOrEmpty(userClaim))
            throw new UnauthorizedAccessException("Invalid token");
        return userClaim;
    }
}