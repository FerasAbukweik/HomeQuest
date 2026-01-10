using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WebApplication8.customExceptions;
using WebApplication8.Data;
using WebApplication8.DTOs.AuthDTOs;
using WebApplication8.Models.API;
using WebApplication8.Models.Token;

namespace WebApplication8.Services.Auth
{
    public class AuthServices : IAuthServices
    {
        private readonly HomeQuestContext _Data;
        private readonly IConfiguration _Configuration;
        public AuthServices(HomeQuestContext Data , IConfiguration configuration)
        {
            _Data = Data;
            _Configuration = configuration;
        }
        public async Task<TokenResponseDTO> LoginAsync(HttpRequest request , loginDTO loginData)
        {
            var user = await _Data.Users.FirstOrDefaultAsync(u => u.email == loginData.email);
            if(user == null || !BCrypt.Net.BCrypt.Verify(loginData.password , user.passwordHash))
            {
                throw new WrongLoginDataException("Wrong email or password");
            }

            var currUserRefreshCookie = request.Cookies[TokenUtils.RefreshToken];
            if (!string.IsNullOrEmpty(currUserRefreshCookie))
            {
                var toRemove = _Data.RefreshTokens.FirstOrDefault(t => t.refreshToken == currUserRefreshCookie);
                if (toRemove != null)
                {
                    _Data.RefreshTokens.Remove(toRemove);
                    await _Data.SaveChangesAsync();
                }
            }

            return await calcTokens(user);
        }

        private async Task<TokenResponseDTO> calcTokens(User user)
        {
            return new TokenResponseDTO
            {
                accessToken = GenerateAccessToken(user),
                refreshToken = await GenerateRefreshToken(user.id)
            };
        }

        public async Task<TokenResponseDTO> RefreshTokensAsync(string refreshToken)
        {
            if(string.IsNullOrEmpty(refreshToken))
                throw new Exception("refresh token cannt be Null or Empty");

            var refreshTokenEntity = await _Data.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.refreshToken == refreshToken);

            if(refreshTokenEntity == null)
                throw new Exception("invalid refresh token");

            if(refreshTokenEntity.expiryDate < DateTime.UtcNow)
            {
                _Data.RefreshTokens.Remove(refreshTokenEntity);
                await _Data.SaveChangesAsync();
                throw new Exception("invalid refresh token");
            }

            var user = refreshTokenEntity.User;
            _Data.RefreshTokens.Remove(refreshTokenEntity);
            await _Data.SaveChangesAsync();

            return await calcTokens(user);
        }


        private async Task<string> GenerateRefreshToken(Guid userId)
        {
            byte[] bytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }
            string newRefreshToken = Convert.ToBase64String(bytes);
            RefreshToken newRefreshTokenEntity = new RefreshToken
            {
                id = Guid.NewGuid(),
                refreshToken = newRefreshToken,
                expiryDate = DateTime.UtcNow.AddDays(30),
                createdDate = DateTime.UtcNow,
                userId = userId
            };
            _Data.RefreshTokens.Add(newRefreshTokenEntity);
            await _Data.SaveChangesAsync();
            return newRefreshToken;
        }

        private string GenerateAccessToken(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name , user.userName),
                new Claim(ClaimTypes.NameIdentifier , user.id.ToString()),
                new Claim(ClaimTypes.Role , user.role.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_Configuration.GetValue<string>("JWTsettings:Key")!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenSettings = new JwtSecurityToken(
                claims: claims,
                signingCredentials: creds,
                expires: DateTime.UtcNow.AddMinutes(15),
                issuer: _Configuration.GetValue<string>("JWTsettings:Issuer"),
                audience: _Configuration.GetValue<string>("JWTsettings:Audience")
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenSettings);
        }

        public async Task LogoutAsync(string refreshToken)
        {
            if (refreshToken == null) return;
            var toRemoveRefreshToken = _Data.RefreshTokens.FirstOrDefault(r => r.refreshToken == refreshToken);
            if(toRemoveRefreshToken != null)
            {
                _Data.RefreshTokens.Remove(toRemoveRefreshToken);
                await _Data.SaveChangesAsync();
            }
        }
    }
}