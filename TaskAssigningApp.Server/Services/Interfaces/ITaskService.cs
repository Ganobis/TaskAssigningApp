using TaskAssigningApp.Server.DTOs;
using TaskAssigningApp.Server.Models.Tasks;
using TaskAssigningApp.Server.Results;

namespace TaskAssigningApp.Server.Services.Interfaces
{
    public interface ITaskService
    {
        Task<List<TaskDto>> GetAssignedTasksAsync(string userId);
        Task<List<TaskDto>> GetUnAssignedTaskAsync();
        Task<AssignTasksRequest> AssignTaskToUserAsync(string userId, List<string> taskIds);
    }
}
