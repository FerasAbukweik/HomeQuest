namespace WebApplication8.customExceptions
{
    public class WrongLoginDataException : Exception
    {
        public WrongLoginDataException(string message) : base(message) { }
    }
}
