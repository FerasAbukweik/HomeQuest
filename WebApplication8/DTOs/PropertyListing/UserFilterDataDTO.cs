namespace WebApplication8.DTOs.PropertyListing
{
    public class UserFilterDataDTO : GuestFilterDataDTO
    {
        public Boolean? isActive { get; set; }
        public Boolean? isPending { get; set; }
    }
}
