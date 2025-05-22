using TaskAssigningApp.Server.Services.Implementations;

namespace TaskAssigningApp.Server.Tests
{
    public class UserServiceTests
    {
        [Fact]
        public async Task GetAllUsersAsync_ReturnsAllUsers()
        {
            // Arrange
            var service = new UserService();

            // Act
            var result = await service.GetAllUsersAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(5, result.Count);
        }
    }
}