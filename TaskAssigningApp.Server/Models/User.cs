using TaskAssigningApp.Server.Models.Enums;
using TaskAssigningApp.Server.Models.Tasks;

namespace TaskAssigningApp.Server.Models
{
    public class User
    {
        public string Id { get; private set; } = Guid.NewGuid().ToString();
        public required string Name { get; set; }
        public UserType Type { get; set; }

        public bool CanAssignedTasks(BaseTask task)
        {
            return Type switch
            {
                UserType.DevOps => true,
                UserType.Programmer => task.GetTaskType() == TaskType.Implementation,
                _ => false
            };
        }
    }
}
