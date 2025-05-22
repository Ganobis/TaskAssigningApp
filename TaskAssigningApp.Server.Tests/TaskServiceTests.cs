using TaskAssigningApp.Server.Models.Enums;
using TaskAssigningApp.Server.Services.Implementations;

namespace TaskAssigningApp.Server.Tests
{
    public class TaskServiceTests
    {
        [Fact]
        public async Task GetAssignedTasksAsync_ReturnsTasks_ForGivenUserId()
        {
            // Arrange
            var service = new TaskService();
            var user = MoqData.MoqData.Users.First();
            var task = MoqData.MoqData.Tasks.First();
            task.AssignedToUserId = user.Id;

            // Act
            var result = await service.GetAssignedTasksAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Contains(result, t => t.AssignedToUserId == user.Id);
        }

        [Fact]
        public async Task GetUnAssignedTaskAsync_ReturnsOnlyUnassignedTasks()
        {
            // Arrange
            var service = new TaskService();

            var unassignedTask = MoqData.MoqData.Tasks.FirstOrDefault(t => t.AssignedToUserId != null);
            if (unassignedTask != null)
                unassignedTask.AssignedToUserId = null;

            // Act
            var result = await service.GetUnAssignedTaskAsync();

            // Assert
            Assert.NotNull(result);
            Assert.All(result, task => Assert.Null(task.AssignedToUserId));
        }

        [Fact]
        public async Task AssignTaskToUserAsync_ShouldReturnFail_WhenUserNotExists()
        {
            // Arrange
            var service = new TaskService();
            var fakeUserId = "non-existing-id";
            var taskId = MoqData.MoqData.Tasks.First().Id;

            // Act
            var result = await service.AssignTaskToUserAsync(fakeUserId, new List<string> { taskId });

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("User don't exist.", result.ErrorMessage);
        }

        [Fact]
        public async Task AssignTaskToUserAsync_ShouldReturnFail_WhenTaskAlreadyAssigned()
        {
            // Arrange
            var service = new TaskService();
            var user = MoqData.MoqData.Users.First();
            var task = MoqData.MoqData.Tasks.First();
            task.AssignedToUserId = "someone-else";

            // Act
            var result = await service.AssignTaskToUserAsync(user.Id, new List<string> { task.Id });

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("One of tasks is already assign", result.ErrorMessage);
        }

        [Fact]
        public async Task AssignTaskToUserAsync_ShouldReturnFail_WhenTaskTypeNotAllowed()
        {
            // Arrange
            var service = new TaskService();
            var user = MoqData.MoqData.Users.First(u => u.Type == UserType.Programmer);
            var invalidTask = MoqData.MoqData.Tasks.First(t => t.GetTaskType() == TaskType.Maintenance);
            invalidTask.AssignedToUserId = null;

            // Act
            var result = await service.AssignTaskToUserAsync(user.Id, new List<string> { invalidTask.Id });

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Contains("cannot assign task of type", result.ErrorMessage);
        }

        [Fact]
        public async Task AssignTaskToUserAsync_ShouldReturnFail_WhenTooManyTasksAssigned()
        {
            // Arrange
            var service = new TaskService();
            var user = MoqData.MoqData.Users[1];
            var newTasks = MoqData.MoqData.Tasks.Where(t => t.AssignedToUserId == null).Take(11).ToList();

            // Act
            var result = await service.AssignTaskToUserAsync(user.Id, newTasks.Select(t => t.Id).ToList());

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("Cannot assign more than 10 tasks in one request.", result.ErrorMessage);
        }

        [Fact]
        public async Task AssignTaskToUserAsync_ShouldReturnSuccess_WhenAssignmentValid()
        {
            // Arrange
            var service = new TaskService();
            var user = MoqData.MoqData.Users.First(u => u.Type == UserType.Programmer);
            var validTasks = MoqData.MoqData.Tasks
                .Where(t => t.AssignedToUserId == null && t.GetTaskType() == TaskType.Implementation)
                .Take(4)
                .ToList();

            validTasks[0].Difficulty = 2;
            validTasks[1].Difficulty = 3;
            validTasks[2].Difficulty = 4;
            validTasks[3].Difficulty = 3;

            // Act
            var result = await service.AssignTaskToUserAsync(user.Id, validTasks.Select(t => t.Id).ToList());

            // Assert
            Assert.True(result.IsSuccess);
        }
    }
}

