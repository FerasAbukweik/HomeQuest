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
}