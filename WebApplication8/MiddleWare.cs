using System.Net;
using System.Text.Json;
using WebApplication8.customExceptions;

public class MiddleWare
{
    private readonly ILogger<MiddleWare> _logger;
    private readonly RequestDelegate _next;
    public MiddleWare(ILogger<MiddleWare> logger, RequestDelegate next)
    {
        _logger = logger;
        _next = next;
    }
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            int statusCode = ex switch
            {
                WrongLoginDataException => (int) HttpStatusCode.Unauthorized,
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var message = ex switch
            {
                WrongLoginDataException => ex.Message,
                _ => "Server Error"
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            var response = new
            {
                headerMessage = "something went wrong while processing your request",
                message = ex.Message,
                errorCode = statusCode,
            };

            await context.Response
                .WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
