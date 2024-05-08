using BisleriumBlog.DTO;
using BisleriumBlog.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BisleriumBlog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _dashboardService;

        public AdminDashboardController(IAdminDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet, Route("dashboard/c")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetDashboardCounts()
        {
            try
            {
                var counts = await _dashboardService.GetDashboardCounts();
                return Ok(counts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet, Route("dashboard/tc")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetDashboardCountsOnChoosenTime(DateTime startDate, DateTime endDate)
        {
            try
            {
                var dashboardCounts = await _dashboardService.GetDashboardCountsOnChoosenTime(startDate, endDate);
                return Ok(dashboardCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet, Route("dashboard/pp")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetPopularPostsAllTime()
        {
            try
            {
                var popularPosts = await _dashboardService.GetMostPopularBlogsAllTime();
                return Ok(popularPosts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet, Route("dashboard/ppmonth")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetPopularPostsAllTimeChosenMonth(int month)
        {
            try
            {
                var popularPosts = await _dashboardService.GetMostPopularBlogsChosenMonth(month);
                return Ok(popularPosts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet, Route("dashboard/pb")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetPopularBloggers()
        {
            try
            {
                // Call the service method to get the 10 most popular bloggers
                var popularBloggers = await _dashboardService.GetMostPopularBloggersAllTime();
                return Ok(popularBloggers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet, Route("dashboard/pbmonth")]
        public async Task<IActionResult> GetPopularBloggers(int month)
        {
            try
            {
                // Call the service method to get the most popular bloggers for the chosen month
                var popularBloggers = await _dashboardService.GetMostPopularBloggersChosenMonth(month);
                return Ok(popularBloggers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
