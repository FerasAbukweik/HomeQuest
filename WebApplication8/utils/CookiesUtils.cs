using Azure;

public class CookiesUtils
{
    public static void SaveToHTTPOnlyCookie(HttpResponse response , string key, string toSave, DateTime expireDate)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = expireDate,
        };
        response.Cookies.Append(key, toSave, cookieOptions);
    }
}