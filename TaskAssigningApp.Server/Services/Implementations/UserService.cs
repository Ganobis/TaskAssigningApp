using TaskAssigningApp.Server.DTOs;
using TaskAssigningApp.Server.Models;
using TaskAssigningApp.Server.Models.Enums;
using TaskAssigningApp.Server.Services.Interfaces;

namespace TaskAssigningApp.Server.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly List<User> _users = MoqData.MoqData.Users;
        public Task<List<UserDto>> GetAllUsersAsync()
        {
            return Task.FromResult(_users
                .Select(u => 
                    new UserDto
                    {
                        Id = u.Id, 
                        Type = u.Type.ToString(), 
                        Name = u.Name
                    }).ToList());
        }
    }
}
