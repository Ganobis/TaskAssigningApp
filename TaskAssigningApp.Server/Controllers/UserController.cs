using Microsoft.AspNetCore.Mvc;
using TaskAssigningApp.Server.Services.Interfaces;

namespace TaskAssigningApp.Server.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController(IUserService userService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await userService.GetAllUsersAsync();
            return Ok(result);
        }
    }
}
