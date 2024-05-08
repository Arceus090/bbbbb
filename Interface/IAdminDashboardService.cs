using BisleriumBlog.DTO;
using BisleriumBlog.Models;

namespace BisleriumBlog.Interface
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboard> GetDashboardCounts();
        Task<AdminDashboard> GetDashboardCountsOnChoosenTime(DateTime startDate, DateTime endDate);
        Task<List<Blog>> GetMostPopularBlogsAllTime();
        Task<List<Blog>> GetMostPopularBlogsChosenMonth(int month);
        Task<List<ApplicationUser>> GetMostPopularBloggersAllTime();
        Task<List<ApplicationUser>> GetMostPopularBloggersChosenMonth(int month);
    }
}
