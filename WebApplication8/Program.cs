using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using WebApplication8;
using WebApplication8.Data;
using WebApplication8.Models.Token;
using WebApplication8.Services.Auth;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<HomeQuestContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration.GetValue<string>("JWTsettings:Issuer"),
            ValidateAudience = true,
            ValidAudience = builder.Configuration.GetValue<string>("JWTsettings:Audience"),
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("JWTsettings:Key")!))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = async context =>
            {
                var authService = context.HttpContext.RequestServices.GetRequiredService<IAuthServices>();

                if (context.Request.Cookies.TryGetValue(TokenUtils.AccessToken, out var token))
                {
                    context.Token = token;
                }
                else if (context.Request.Cookies.TryGetValue(TokenUtils.RefreshToken, out var refreshToken))
                {
                    var tokens = await authService.RefreshTokensAsync(refreshToken);
                    TokenUtils.saveTokens(context.Response, tokens);
                    context.Token = tokens.accessToken;
                }
            }
        };
    });


builder.Services.AddScoped<IAuthServices, AuthServices>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthentication();

app.UseAuthorization();

app.UseMiddleware<MiddleWare>();

app.MapControllers();

app.Run();
