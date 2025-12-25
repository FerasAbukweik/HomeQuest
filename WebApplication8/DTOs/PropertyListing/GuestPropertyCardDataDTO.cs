namespace WebApplication8.DTOs.PropertyListing
{
    public class GuestPropertyCardDataDTO
    {
        public Guid id { get; set; }
        public string imageUrl { get; set; }
        public decimal price { get; set; }
        public string address { get; set; }
        public string title { get; set; }
    }
}
