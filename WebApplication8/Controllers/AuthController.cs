using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication8.Data;
using WebApplication8.DTOs.AuthDTOs;
using WebApplication8.DTOs.RegisterDTOs;
using WebApplication8.Models.API;
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
            var tokens = await _authService.LoginAsync(Request , loginData);
            CookiesUtils.SaveToHTTPOnlyCookie(Response , TokenUtils.RefreshToken ,tokens.refreshToken , DateTime.UtcNow.AddDays(30));
            CookiesUtils.SaveToHTTPOnlyCookie(Response , TokenUtils.AccessToken ,tokens.accessToken, DateTime.UtcNow.AddMinutes(15));
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("RefreshTokens")]
        public async Task<ActionResult<string>> RefreshTokens()
        {
            var refreshToken = Request.Cookies[TokenUtils.RefreshToken];
            if(refreshToken == null)
                return Unauthorized("no refresh token stored in http only cookies");
            var tokens = await _authService.RefreshTokensAsync(refreshToken);
            CookiesUtils.SaveToHTTPOnlyCookie(Response , TokenUtils.RefreshToken, tokens.refreshToken, DateTime.UtcNow.AddDays(30));
            CookiesUtils.SaveToHTTPOnlyCookie(Response , TokenUtils.AccessToken, tokens.accessToken, DateTime.UtcNow.AddMinutes(15));
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