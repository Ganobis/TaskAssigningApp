namespace TaskAssigningApp.Server.Results
{
    public class AssignTasksRequest
    {
        public bool IsSuccess { get; private set; }
        public string ErrorMessage { get; private set; } = string.Empty;

        public static AssignTasksRequest Success() => new() { IsSuccess = true };
        public static AssignTasksRequest Fail(string message) => new() { IsSuccess = false, ErrorMessage = message};
    }
}
