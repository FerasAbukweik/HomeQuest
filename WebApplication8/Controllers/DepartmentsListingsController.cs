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
        [HttpPost("AddProperty")]
        public async Task<ActionResult> AddProperty([FromBody] AddPropertyListingDTO newProperty)
        {
            var toAddProperty = new PropertyListing
            {
                id = Guid.NewGuid(),
                title = newProperty.title,
                description = newProperty.description,
                address = newProperty.address,
                imagesUrls = newProperty.imageUrls,
                price = newProperty.price,
                state = newProperty.propertyState,
                isActive = false,
                createdAt = DateTime.UtcNow,
                propertyType = newProperty.propertyType,
                userId = UserUtils.GetUserId(User)
            };

            _Data.PropertiesListings.Add(toAddProperty);
            await _Data.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPut("Edit")]
        public async Task<ActionResult> Edit([FromBody] EditPropertyListingDTO editData)
        {
            if(editData.propertyState == PropertyStateEnum.Rejected)
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
            existingProperty.isActive = editData.isActive ?? existingProperty.isActive;
            existingProperty.propertyType = editData.propertyType ?? existingProperty.propertyType;
            existingProperty.state = editData.propertyState ?? existingProperty.state;

            await _Data.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet("Filter")]
        public async Task<ActionResult<PropertyCardInfinitScrollResponseDTO>> Filter([FromQuery] FilterUserPropertiesDTO data)
        {
            var userId = UserUtils.GetUserId(User);

            var selectedStates = Enum.GetValues(typeof(PropertyStateEnum))
                                     .Cast<PropertyStateEnum>()
                                     .Where(s => EnumUtils.isSelected((int)data.filterData.propertyState, (int)s))
                                     .ToList();

            var selectedTypes = Enum.GetValues(typeof(PropertyTypesEnum))
                                    .Cast<PropertyTypesEnum>()
                                    .Where(t => EnumUtils.isSelected((int)data.filterData.propertyType, (int)t))
                                    .ToList();


            var query = _Data.PropertiesListings.AsQueryable();

            query = query.Where(q => q.userId == userId);

            if (selectedStates.Any())
                query = query.Where(q => selectedStates.Contains(q.state));

            if (selectedTypes.Any())
                query = query.Where(q => selectedTypes.Contains(q.propertyType));

            if (data.filterData.minPrice != null)
                query = query.Where(p => p.price >= data.filterData.minPrice);

            if (data.filterData.maxPrice != null)
                query = query.Where(p => p.price <= data.filterData.maxPrice);

            if (data.filterData.isActive != null)
                query = query.Where(p => p.isActive == data.filterData.isActive);

            if (data.filterData.createdFrom != null)
                query = query.Where(p => p.createdAt >= data.filterData.createdFrom);

            if (data.filterData.createdTo != null)
                query = query.Where(p => p.createdAt <= data.filterData.createdTo);

            if (data.filterData.sortByDate!=null && data.filterData.sortByDate == true)
                query = query.OrderByDescending(d => d.createdAt);

            if (data.filterData.isPending != null)
                query = query.Where(q=>q.isPending == data.filterData.isPending);

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
                    imageUrl = d.imagesUrls[0] ?? "noImage"
                })
                .ToListAsync();
            int currentTaken = currSectionPropertys.Count();

            var response = new PropertyCardInfinitScrollResponseDTO
            {
                propertiesListings = currSectionPropertys,
                currTaken = currentTaken + alreadyTaken,
                isMoreAvaiable = (alreadyTaken + currentTaken) < totalPropertys,
            };

            return Ok(response);
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
        [HttpPost("GetGuestPropertys")]
        public async Task<ActionResult<PropertyCardInfinitScrollResponseDTO>> FilterGuestPropertys(
            [FromBody] FilterGuestPropertiesDTO  data)
        {
            var query = _Data.PropertiesListings
                .Where(p =>
                    //p.isActive == true &&
                    //p.isPending == false &&
                    p.state != PropertyStateEnum.Sold &&
                    p.state != PropertyStateEnum.Rejected
                );

            var selectedStates = Enum.GetValues(typeof(PropertyStateEnum))
                                     .Cast<PropertyStateEnum>()
                                     .Where(s => EnumUtils.isSelected((int)data.filterData.propertyState, (int)s))
                                     .ToList();

            var selectedTypes = Enum.GetValues(typeof(PropertyTypesEnum))
                                    .Cast<PropertyTypesEnum>()
                                    .Where(t => EnumUtils.isSelected((int)data.filterData.propertyType, (int)t))
                                    .ToList();

            if (selectedStates.Any())
                query = query.Where(q => selectedStates.Contains(q.state));

            if (selectedTypes.Any())
                query = query.Where(q => selectedTypes.Contains(q.propertyType));

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
                    imageUrl = d.imagesUrls[0] ?? "noImage"
                })
                .ToListAsync();
            int currentTaken = currSectionPropertys.Count();

            var response = new PropertyCardInfinitScrollResponseDTO
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
                    isPending = p.isPending,
                }).FirstOrDefaultAsync();

            if (Property == null)
                return NotFound("Property Not Found");
            if(Property.isPending == true)
                return BadRequest("admins didn't approve this property yet");
            if (Property.state == PropertyStateEnum.Rejected)
                return BadRequest("property was rejected");


            var watchingUser = UserUtils.GetUserId(User);

            var alreadyViewed = await _Data.PropertyViews
            .AnyAsync(pv => pv.propertyLisingId == id && pv.userId == watchingUser);

            if (!alreadyViewed)
            {

                var newView = new PropertyView
                {
                    id = Guid.NewGuid(),
                    propertyLisingId = id,
                    userId = watchingUser,
                };

                _Data.PropertyViews.Add(newView);
                await _Data.SaveChangesAsync();
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
    }
}