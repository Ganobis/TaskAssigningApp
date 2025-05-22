namespace TaskAssigningApp.Server.DTOs
{
    public class TaskDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public int Difficulty { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public string? AssignedToUserId { get; set; }

        //DeploymentTask
        public DateTime Deadline { get; set; }
        //ImplementationTask
        public string Description { get; set; }
        //MaintenanceTask
        public string Services { get; set; }
        public string Servers { get; set; }


    }
}
