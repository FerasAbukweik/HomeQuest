using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net;
using System.Security.Claims;
using WebApplication8.Data;
using WebApplication8.DTOs.infinitScrollDTOs;
using WebApplication8.DTOs.PropertyListing;
using WebApplication8.DTOs.PropertyListingDTOs;
using WebApplication8.Models.API;

namespace WebApplication8.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertysListingsController : ControllerBase
    {
        private readonly HomeQuestContext _Data;

        public PropertysListingsController(HomeQuestContext data)
        {
            _Data = data;
        }

        [Authorize]
        [HttpPost("Add")]
        public async Task<ActionResult> Add([FromBody] AddPropertyListingDTO newProperty)
        {
            var toAddProperty = new PropertyListing
            {
                id = Guid.NewGuid(),
                title = newProperty.title,
                description = newProperty.description,
                address = newProperty.address,
                imagesUrls = newProperty.imageUrls,
                price = newProperty.price,
                state = newProperty.propertyState + (int)PropertyStateEnum.pending,
                createdAt = DateTime.UtcNow,
                propertyType = newProperty.propertyType,
                userId = UserUtils.GetUserId(User)
            };

            _Data.PropertiesListings.Add(toAddProperty);
            await _Data.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpPut("Edit")]
        public async Task<ActionResult> Edit([FromBody] EditPropertyListingDTO editData)
        {
            if(EnumUtils.isSelected(editData.propertyState , (int)PropertyStateEnum.Rejected))
            {
                return Unauthorized("users cannt change property state to rejected");
            }
            var userId = UserUtils.GetUserId(User);
            var existingProperty = await _Data.PropertiesListings
                .FirstOrDefaultAsync(d => d.id == editData.id && d.userId == userId);

            if (existingProperty == null)
            {
                return NotFound(new { message = "Property listing not found or you do not have permission to edit it." });
            }

            existingProperty.title = editData.title ?? existingProperty.title;
            existingProperty.description = editData.description ?? existingProperty.description;
            existingProperty.address = editData.address ?? existingProperty.address;
            existingProperty.imagesUrls = editData.imageUrls ?? existingProperty.imagesUrls;
            existingProperty.price = editData.price ?? existingProperty.price;
            existingProperty.propertyType = editData.propertyType;
            existingProperty.state = editData.propertyState;

            await _Data.SaveChangesAsync();
            return Ok();
        }


        [Authorize]
        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var userId = UserUtils.GetUserId(User);

            var toDeleteProperty = await _Data.PropertiesListings
                .FirstOrDefaultAsync(d => d.id == id && d.userId == userId);

            if (toDeleteProperty == null)
            {
                return NotFound(new { message = "Property listing not found or you do not have permission to delete it." });
            }

            _Data.PropertiesListings.Remove(toDeleteProperty);
            await _Data.SaveChangesAsync();
            return Ok(new { message = "Property deleted successfully" });
        }

        [AllowAnonymous]
        [HttpPost("FilterGuestProperties")]
        public async Task<ActionResult<GuestPropertyCardInfinitScrollResponseDTO>> FilterGuestProperties(
            [FromBody] FilterPropertiesWithInfinitScrollDataDTO  data)
        {
            var query = _Data.PropertiesListings
                .Where(p =>
                    (
                       (p.state & (int)PropertyStateEnum.active) == (int)PropertyStateEnum.active &&
                       (p.state & (int)PropertyStateEnum.pending) != (int)PropertyStateEnum.pending) &&
                        p.state != (int)PropertyStateEnum.Sold &&
                        p.state != (int)PropertyStateEnum.Rejected
                    );


            if (data.filterData.propertyState != 0)
                query = query.Where(q => (data.filterData.propertyState & q.state) == q.state);

            if (data.filterData.propertyType != 0)
                query = query.Where(q => (data.filterData.propertyType & q.propertyType) == q.propertyType);

            if (data.filterData.minPrice != null)
                query = query.Where(p => p.price >= data.filterData.minPrice);

            if (data.filterData.maxPrice != null)
                query = query.Where(p => p.price <= data.filterData.maxPrice);

            if (data.filterData.createdFrom != null)
                query = query.Where(p => p.createdAt >= data.filterData.createdFrom);

            if (data.filterData.createdTo != null)
                query = query.Where(p => p.createdAt <= data.filterData.createdTo);

            if (data.filterData.sortByDate != null && data.filterData.sortByDate == true)
                query = query.OrderByDescending(d => d.createdAt);

            if (data.filterData.title != null)
                query = query.Where(d => d.title.ToUpper().Contains(data.filterData.title.ToUpper()));

            long totalPropertys = await query.CountAsync();
            int alreadyTaken = data.infinitScrollData.alreadyTaken;
            int take = data.infinitScrollData.sectionSize;
            var currSectionPropertys = await query
                .Skip(alreadyTaken)
                .Take(take)
                .Select(d => new GuestPropertyCardDataDTO
                {
                    id = d.id,
                    title = d.title,
                    address = d.address,
                    price = d.price,
                    imageUrl = d.imagesUrls.FirstOrDefault() ?? "noImage"
                })
                .ToListAsync();
            int currentTaken = currSectionPropertys.Count();

            var response = new GuestPropertyCardInfinitScrollResponseDTO
            {
                propertiesListings = currSectionPropertys,
                currTaken = alreadyTaken + currentTaken,
                isMoreAvaiable = (alreadyTaken + currentTaken) < totalPropertys,
            };

            return Ok(response);
        }

        [Authorize]
        [HttpPost("FitlerUserProperties")]
        public async Task<ActionResult<UserPropertiesInfnitscrollResponseDTO>> FitlerUserProperties(
           [FromBody] FilterPropertiesWithInfinitScrollDataDTO data)
        {
            var query = _Data.PropertiesListings.AsQueryable();

            if (data.filterData.propertyState != 0)
                query = query.Where(q => q.state != 0 && ((data.filterData.propertyState & q.state) == q.state));

            if (data.filterData.propertyType != 0)
                query = query.Where(q => q.state != 0 && ((data.filterData.propertyType & q.propertyType) == q.propertyType));

            if (data.filterData.minPrice != null)
                query = query.Where(p => p.price >= data.filterData.minPrice);

            if (data.filterData.maxPrice != null)
                query = query.Where(p => p.price <= data.filterData.maxPrice);

            if (data.filterData.createdFrom != null)
                query = query.Where(p => p.createdAt >= data.filterData.createdFrom);

            if (data.filterData.createdTo != null)
                query = query.Where(p => p.createdAt <= data.filterData.createdTo);

            if (data.filterData.sortByDate != null && data.filterData.sortByDate == true)
                query = query.OrderByDescending(d => d.createdAt);

            if (data.filterData.title != null)
                query = query.Where(d => d.title.ToUpper().Contains(data.filterData.title.ToUpper()));

            long totalPropertys = await query.CountAsync();
            int alreadyTaken = data.infinitScrollData.alreadyTaken;
            int take = data.infinitScrollData.sectionSize;
            var currSectionPropertys = await query
                .Skip(alreadyTaken)
                .Take(take)
                .Select(d => new UserPropertyCardDataDTO
                {
                    id = d.id,
                    title = d.title,
                    address = d.address,
                    price = d.price,
                    imageUrl = d.imagesUrls.FirstOrDefault() ?? "noImage",
                    state = d.state,
                })
                .ToListAsync();
            int currentTaken = currSectionPropertys.Count();

            var response = new UserPropertiesInfnitscrollResponseDTO
            {
                propertiesListings = currSectionPropertys,
                currTaken = alreadyTaken + currentTaken,
                isMoreAvaiable = (alreadyTaken + currentTaken) < totalPropertys,
            };

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("GetPropertyDetails/{id}")]
        public async Task<ActionResult<PropertyDTO>> GetPropertyDetails(Guid id)
        {
            var Property = await _Data.PropertiesListings
                .Where(p => p.id == id)
                .Select(p=> new
                {
                    id = p.id,
                    title = p.title,
                    description = p.description,
                    address = p.address,
                    imagesUrls = p.imagesUrls,
                    price = p.price,
                    state = p.state,
                    createdAt = p.createdAt,
                    propertyType = p.propertyType,
                    userId = p.userId,
                }).FirstOrDefaultAsync();

            if (Property == null)
                return NotFound("Property Not Found");
            if (EnumUtils.isSelected(Property.state, (int)PropertyStateEnum.pending))
                return BadRequest("admins didn't approve this property yet");
            if (EnumUtils.isSelected(Property.state , (int)PropertyStateEnum.Rejected))
                return BadRequest("property was rejected");


            var watchingUserIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(watchingUserIdString, out var watchingUserId))
            {
                var alreadyViewed = await _Data.PropertyViews
                .AnyAsync(pv => pv.propertyLisingId == id && pv.userId == watchingUserId);

                if (!alreadyViewed)
                {

                    var newView = new PropertyView
                    {
                        id = Guid.NewGuid(),
                        propertyLisingId = id,
                        userId = watchingUserId,
                    };

                    _Data.PropertyViews.Add(newView);
                    await _Data.SaveChangesAsync();
                }
            }

            var response = new PropertyDTO
            {
                id = Property.id,
                title = Property.title,
                description = Property.description,
                address = Property.address,
                imagesUrls = Property.imagesUrls,
                price = Property.price,
                state = Property.state,
                createdAt = Property.createdAt,
                propertyType = Property.propertyType,
                userId = Property.userId
            };

            return Ok(response);
        }


        [Authorize]
        [HttpPut("toggleState/{id}")]
        public async Task<ActionResult> toggleState(Guid id , SetActiveDTO data)
        {
            var property = await _Data.PropertiesListings
                .Where(p => p.id == id)
                .FirstOrDefaultAsync();

            var userId = UserUtils.GetUserId(User);
            var userRole = UserUtils.GetUserClaim(User , ClaimTypes.Role);

            if (property == null)
                return NotFound("No Property Was Found");
            if (EnumUtils.isSelected((int)property.state, (int)PropertyStateEnum.pending))
                return BadRequest("Property Ain't Approved From Admins");
            if (property.userId != userId && int.Parse(userRole) != (int)UserRoles.Admin)
                return Unauthorized("Unauthorized");


            property.state =  data.newState;
            await _Data.SaveChangesAsync();


            return NoContent();
        }
    }
}