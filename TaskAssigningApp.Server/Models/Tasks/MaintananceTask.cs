using TaskAssigningApp.Server.Models.Enums;
using TaskAssigningApp.Server.Models.Interfaces;

namespace TaskAssigningApp.Server.Models.Tasks
{
    public class MaintananceTask : BaseTask
    {
        public string Services { get; set; } = string.Empty;
        public string Servers { get; set; } = string.Empty;

        public override TaskType GetTaskType() => TaskType.Maintenance;
    }
}
