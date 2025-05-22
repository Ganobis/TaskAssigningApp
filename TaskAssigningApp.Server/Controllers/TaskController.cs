using Microsoft.AspNetCore.Mvc;
using TaskAssigningApp.Server.Services.Interfaces;

namespace TaskAssigningApp.Server.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TaskController(ITaskService taskService) : ControllerBase
    {
        [HttpGet("assigned/{userId}")]
        public async Task<IActionResult> GetAssignedTasks(string userId)
        {
            var tasks = await taskService.GetAssignedTasksAsync(userId);
            return Ok(tasks);
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableTasks()
        {
            var tasks = await taskService.GetUnAssignedTaskAsync();
            return Ok(tasks);
        }

        [HttpPost("assign/{userId}")]
        public async Task<IActionResult> AssignTasks(string userId, [FromBody] List<string> taskIds)
        {
            var result = await taskService.AssignTaskToUserAsync(userId, taskIds);
            if (result.IsSuccess)
            {
                return Ok();
            }
            return BadRequest(result);
        }
    }
}
