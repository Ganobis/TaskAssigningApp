using TaskAssigningApp.Server.Models.Enums;
using TaskStatus = TaskAssigningApp.Server.Models.Enums.TaskStatus;

namespace TaskAssigningApp.Server.Models.Interfaces
{
    public interface ITask
    {
        string Id { get; }
        string Title { get; set; }
        int Difficulty { get; set; }
        TaskStatus Status { get; set; }
        string? AssignedToUserId { get; set; }

        TaskType GetTaskType();
    }
}
