using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System;
using WebApplication8.Data;
using WebApplication8.DTOs.AuthDTOs;
using WebApplication8.DTOs.PropertyListing;
using WebApplication8.DTOs.RegisterDTOs;
using WebApplication8.Models.API;
using WebApplication8.Services.Auth;

namespace WebApplication8.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly HomeQuestContext _data;
        private readonly IAuthServices _authServices;
        public UsersController(HomeQuestContext data , IAuthServices authServices)
        {
            _data = data;
            _authServices = authServices;
        }

        [AllowAnonymous]
        [HttpPost("AddUser")]
        public async Task<ActionResult> AddUser([FromBody] SignupDTO signupData)
        {
            var existingUser = await _data.Users
                .FirstOrDefaultAsync(u =>
                (u.userName == signupData.userName || u.phoneNumber == signupData.phoneNumber || u.email == signupData.email));

            if (existingUser != null)
            {
                if (existingUser.userName == signupData.userName)
                    return BadRequest(new { message = "Username already used" });

                if (existingUser.phoneNumber == signupData.phoneNumber)
                    return BadRequest(new { message = "Phone number already used" });

                if (existingUser.email == signupData.email)
                    return BadRequest(new { message = "email already used" });
            }

            var newUser = new User
            {
                id = Guid.NewGuid(),
                userName = signupData.userName,
                phoneNumber = signupData.phoneNumber,
                email = signupData.email ?? string.Empty,
                passwordHash = BCrypt.Net.BCrypt.HashPassword(signupData.password),
                firstName = signupData.firstName,
                lastName = signupData.lastName,
            };

            _data.Users.Add(newUser);
            await _data.SaveChangesAsync();

            var loginData = new loginDTO
            {
                email = signupData?.email ?? "",
                password = signupData?.password ?? "",
            };

            var tokens = await _authServices.LoginAsync(Request ,Response, loginData);

            return Ok();
        }

        [Authorize]
        [HttpGet("DashBoardData")]
        public async Task<ActionResult<UserDashBoardData>> DashBoardData()
        {
            var userId = UserUtils.GetUserId(User);
            var lastMonthData = DateTime.UtcNow.AddMonths(-1);

            var dashBoardData = await _data.Users
                .Where(u => u.id == userId)
                .Select(u => new UserDashBoardData
                {
                    propertiesCardData = u.propertiesListings
                    .Select(p => new UserPropertyCardDataDTO
                    {
                        address = p.address,
                        id = p.id,
                        imageUrl = p.imagesUrls.FirstOrDefault() ?? "",
                        state = p.state,
                        price = p.price,
                        title = p.title,
                    }).ToList(),
                    numberOfActiveListings = u.propertiesListings.Count(p => (p.state & (int)PropertyStateEnum.active) == (int)PropertyStateEnum.active),
                    numOfActiveListingsLastMonth = u.propertiesListings
                    .Count(p => (
                        (p.state & (int)PropertyStateEnum.active) == (int)PropertyStateEnum.active &&
                        p.latestActiveDate >= lastMonthData
                    )),
                    totalViews = u.PropertiesViews.Count(),
                    totalViewsLastMonth = u.PropertiesViews.Count(pv=>pv.viewedAt >= lastMonthData)
                }).FirstOrDefaultAsync();


            if (dashBoardData == null)
                return NotFound("User not found");

            return Ok(dashBoardData);
        }

    }
}
