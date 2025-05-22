using TaskAssigningApp.Server.Models.Enums;

namespace TaskAssigningApp.Server.Models.Tasks
{
    public class DeploymentTask : BaseTask
    {
        public DateTime Deadline;
        public string Description { get; set; } = String.Empty;

        public override TaskType GetTaskType() => TaskType.Deployment;
    }
}
