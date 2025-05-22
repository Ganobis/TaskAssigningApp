using TaskAssigningApp.Server.Models.Enums;
using TaskAssigningApp.Server.Models.Interfaces;
using TaskStatus = TaskAssigningApp.Server.Models.Enums.TaskStatus;

namespace TaskAssigningApp.Server.Models.Tasks
{
    public abstract class BaseTask : ITask
    {
        public string Id { get; private set; } = Guid.NewGuid().ToString();
        public required string Title { get; set; }
        public int Difficulty { get; set; }
        public TaskStatus Status { get; set; }
        public string? AssignedToUserId { get; set; }

        public abstract TaskType GetTaskType();
    }
}
