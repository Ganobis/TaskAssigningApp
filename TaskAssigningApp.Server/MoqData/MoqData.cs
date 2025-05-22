using TaskAssigningApp.Server.Models.Tasks;
using TaskAssigningApp.Server.Models;
using TaskAssigningApp.Server.Models.Enums;
using TaskStatus = TaskAssigningApp.Server.Models.Enums.TaskStatus;

namespace TaskAssigningApp.Server.MoqData
{
    public static class MoqData
    {
        public static List<BaseTask> Tasks = new()
        {
            new ImplementationTask { Title = "Feature login system", Difficulty = 5, Status = TaskStatus.ToDo, Description = "Implement full login/logout/auth system" },
            new ImplementationTask { Title = "Create settings page", Difficulty = 4, Status = TaskStatus.ToDo, Description = "Settings page with form validation and API connection" },
            new ImplementationTask { Title = "Improve performance", Difficulty = 3, Status = TaskStatus.Done, Description = "Refactor algorithm to reduce complexity" },
            new ImplementationTask { Title = "Refactor legacy module", Difficulty = 2, Status = TaskStatus.ToDo, Description = "Split old class into separate components" },
            new ImplementationTask { Title = "Fix UI bug in dashboard", Difficulty = 1, Status = TaskStatus.ToDo, Description = "Align layout and correct CSS" },

            new DeploymentTask { Title = "Deploy version 2.0", Difficulty = 5, Status = TaskStatus.ToDo, Deadline = DateTime.Today.AddDays(2), Description = "Major backend release with new endpoints" },
            new DeploymentTask { Title = "Hotfix release", Difficulty = 3, Status = TaskStatus.ToDo, Deadline = DateTime.Today.AddDays(1), Description = "Fix for crash in reports module" },
            new DeploymentTask { Title = "Nightly deploy", Difficulty = 1, Status = TaskStatus.ToDo, Deadline = DateTime.Today.AddDays(3), Description = "Minor build" },

            new MaintananceTask { Title = "Update server packages", Difficulty = 4, Status = TaskStatus.ToDo, Services = "Web API, Auth", Servers = "Prod-01, Prod-02" },
            new MaintananceTask { Title = "Disk space cleanup", Difficulty = 2, Status = TaskStatus.ToDo, Services = "Monitoring", Servers = "Logs-01" },
            new MaintananceTask { Title = "SSL certificate renewal", Difficulty = 3, Status = TaskStatus.ToDo, Services = "Frontend", Servers = "SSL-Gateway" },
            new MaintananceTask { Title = "Log rotation config", Difficulty = 1, Status = TaskStatus.ToDo, Services = "Logging", Servers = "Dev-Log" },

            new DeploymentTask { Title = "Blue/Green switch", Difficulty = 4, Status = TaskStatus.ToDo, Deadline = DateTime.Today.AddDays(2), Description = "Switch live traffic" },
            new MaintananceTask { Title = "Patch vulnerability CVE-2024-1234", Difficulty = 5, Status = TaskStatus.ToDo, Services = "Firewall, DB", Servers = "Secure-01, Secure-02" },
            new ImplementationTask { Title = "API input validation", Difficulty = 2, Status = TaskStatus.ToDo, Description = "Ensure all endpoints validate input data properly" }
        }; 
        public static List<User> Users = new()
        {
            new User { Name = "Alicja", Type = UserType.Programmer },
            new User { Name = "Bartek", Type = UserType.DevOps },
            new User { Name = "Celina", Type = UserType.Programmer },
            new User { Name = "Darek", Type = UserType.DevOps },
            new User { Name = "Ewa", Type = UserType.Programmer },
        };
    }
}
