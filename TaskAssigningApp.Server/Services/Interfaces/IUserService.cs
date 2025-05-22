using TaskAssigningApp.Server.DTOs;

namespace TaskAssigningApp.Server.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllUsersAsync();
    }
}
