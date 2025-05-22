using TaskAssigningApp.Server.DTOs;
using TaskAssigningApp.Server.Models;
using TaskAssigningApp.Server.Models.Tasks;
using TaskAssigningApp.Server.Results;
using TaskAssigningApp.Server.Services.Interfaces;

namespace TaskAssigningApp.Server.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly List<User> _users = MoqData.MoqData.Users;
        private readonly List<BaseTask> _tasks = MoqData.MoqData.Tasks;
        public Task<List<TaskDto>> GetAssignedTasksAsync(string userId)
        {
            return Task.FromResult(_tasks
                .Where(t => userId == t.AssignedToUserId)
                .Take(10)
                .OrderByDescending(t => t.Difficulty)
                .Select(mapToDto)
                .ToList());
        }

        public Task<List<TaskDto>> GetUnAssignedTaskAsync()
        {
            return Task.FromResult(_tasks
                .Where(t => t.AssignedToUserId == null)
                .Take(10)
                .OrderByDescending(t => t.Difficulty)
                .Select(mapToDto)
                .ToList());
        }

        public Task<AssignTasksRequest> AssignTaskToUserAsync(string userId, List<string> taskIds)
        {
            var user = _users.FirstOrDefault(u => userId == u.Id);
            if (user == null)
            {
                return Task.FromResult(AssignTasksRequest.Fail("User don't exist."));
            }

            var selectedTasks = _tasks.Where(t => taskIds.Contains(t.Id)).ToList();

            if (selectedTasks.Count(t => t.AssignedToUserId != null) > 0)
            {
                return Task.FromResult(AssignTasksRequest.Fail("One of tasks is already assign"));
            }

            var wrongAssignTasksType = selectedTasks
                .Where(t => !user.CanAssignedTasks(t))
                .Select(t => t.GetTaskType())
                .Distinct()
                .ToList();
            if (wrongAssignTasksType.Any())
            {
                var typesString = string.Join(",", wrongAssignTasksType);
                return Task.FromResult(AssignTasksRequest.Fail($"This user type: {user.Type} cannot assign task of type: {typesString}"));
            }

            if (taskIds.Count > 10)
            {
                return Task.FromResult(AssignTasksRequest.Fail("Cannot assign more than 10 tasks in one request."));
            }

            var userTasks = _tasks.Where(t => t.AssignedToUserId == userId).ToList();
            if (userTasks.Count() + taskIds.Count > 11)
            {
                return Task.FromResult(AssignTasksRequest.Fail("Cannot assign more than 11 tasks to one user."));
            }

            var combinedTasks = selectedTasks.Concat(userTasks).ToList();
            var hardTasks = combinedTasks.Count(t => t.Difficulty > 3);
            int hardPercent = (hardTasks * 100) / combinedTasks.Count();
            if (hardPercent > 30 || hardPercent < 10)
            {
                return Task.FromResult(AssignTasksRequest.Fail("User must have 10-30% tasks with difficulty 4 or 5."));
            }

            var easyTasks = combinedTasks.Count(t => t.Difficulty < 3);
            int easyPercent = (easyTasks * 100) / combinedTasks.Count();
            if (easyPercent > 50)
            {
                return Task.FromResult(AssignTasksRequest.Fail("User have too many task with difficulty 1 or 2. Max is 50%."));
            }

            foreach (var baseTask in selectedTasks)
            {
                baseTask.AssignedToUserId = userId;
            }

            return Task.FromResult(AssignTasksRequest.Success());
        }

        private TaskDto mapToDto(BaseTask task)
        {
            var dto = new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Difficulty = task.Difficulty,
                Status = task.Status.ToString(),
                Type = task.GetTaskType().ToString(),
                AssignedToUserId = task.AssignedToUserId
            };
            switch (task)
            {
                case DeploymentTask deployment:
                    dto.Deadline = deployment.Deadline;
                    dto.Description = deployment.Description;
                    break;
                case ImplementationTask implementation:
                    dto.Description = implementation.Description;
                    break;
                case MaintananceTask maintenance:
                    dto.Servers = maintenance.Servers;
                    dto.Services = maintenance.Services;
                    break;
            }
            return dto;
        }
    }
}
