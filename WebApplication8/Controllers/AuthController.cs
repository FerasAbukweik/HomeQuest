using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication8.Data;
using WebApplication8.DTOs.AuthDTOs;
using WebApplication8.Services.Auth;

namespace WebApplication8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly HomeQuestContext _data;
        private readonly IAuthServices _authService;

        public AuthController(HomeQuestContext data, IAuthServices authService)
        {
            _data = data;
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login([FromBody] loginDTO loginData)
        {
            var tokens = await _authService.LoginAsync(Request ,Response, loginData);
            return Ok();
        }

        [Authorize]
        [HttpPost("Logout")]
        public async Task<ActionResult> Logout()
        {
            var refreshToken = Request.Cookies[TokenUtils.RefreshToken];
            if (refreshToken != null)
                await _authService.LogoutAsync(refreshToken);
            CookiesUtils.SaveToHTTPOnlyCookie(Response, TokenUtils.RefreshToken, "", DateTime.UtcNow);
            CookiesUtils.SaveToHTTPOnlyCookie(Response, TokenUtils.AccessToken, "", DateTime.UtcNow);
            return NoContent();
        }
    }
}