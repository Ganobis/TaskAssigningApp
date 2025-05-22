using TaskAssigningApp.Server.Models.Enums;
using TaskAssigningApp.Server.Models.Interfaces;

namespace TaskAssigningApp.Server.Models.Tasks
{
    public class ImplementationTask : BaseTask
    {
        public string Description { get; set; } = string.Empty;

        public override TaskType GetTaskType() => TaskType.Implementation;
    }
}
