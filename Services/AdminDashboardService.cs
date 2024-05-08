using BisleriumBlog.DTO;
using BisleriumBlog.Interface;
using BisleriumBlog.Models;
using Microsoft.EntityFrameworkCore;

namespace BisleriumBlog.Services
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly ApplicationDbContext _dbContext;

        public AdminDashboardService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<AdminDashboard> GetDashboardCounts()
        {
            var userCount = await _dbContext.Users.CountAsync();
            var blogCount = await _dbContext.Blogs.CountAsync();
            var totalCommentCount = await _dbContext.Comments.CountAsync();
            var upvoteCount = await _dbContext.Reactions.CountAsync(v => v.ReactionType == ReactionType.Upvote);
            var downvoteCount = await _dbContext.Reactions.CountAsync(v => v.ReactionType == ReactionType.Downvote);

            return new AdminDashboard
            {
                UserCount = userCount,
                BlogCount = blogCount,
                TotalCommentCount = totalCommentCount,
                UpvoteCount = upvoteCount,
                DownvoteCount = downvoteCount
            };
        }

        public async Task<AdminDashboard> GetDashboardCountsOnChoosenTime(DateTime startDate, DateTime endDate)
        {
            var userCount = await _dbContext.Users.Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate).CountAsync();
            var blogCount = await _dbContext.Blogs.Where(p => p.CreatedAt >= startDate && p.CreatedAt <= endDate).CountAsync();
            var totalCommentCount = await _dbContext.Comments.Where(c => c.CreatedAt >= startDate && c.CreatedAt <= endDate).CountAsync() ;
            var upvoteCount = await _dbContext.Reactions.Where(v => v.CreatedAt >= startDate && v.CreatedAt <= endDate && v.ReactionType == ReactionType.Upvote).CountAsync();
            var downvoteCount = await _dbContext.Reactions.Where(v => v.CreatedAt >= startDate && v.CreatedAt <= endDate && v.ReactionType == ReactionType.Downvote).CountAsync();

            return new AdminDashboard
            {
                UserCount = userCount,
                BlogCount = blogCount,
                TotalCommentCount = totalCommentCount,
                UpvoteCount = upvoteCount,
                DownvoteCount = downvoteCount
            };
        }

        public int CalculatePopularity(Blog post)
        {
            // Calculate the upvotes and downvotes for the given post
            int upvotes = _dbContext.Reactions.Count(v => v.BlogId == post.BlogId && v.ReactionType == ReactionType.Upvote);
            int downvotes = _dbContext.Reactions.Count(v => v.BlogId == post.BlogId && v.ReactionType == ReactionType.Downvote);
            int commentsCount = post.Comments != null ? post.Comments.Count : 0;

            // Calculate and return the popularity score for the given post
            int popularity = (upvotes * 2) + (downvotes * -1) + commentsCount;
            return popularity;
        }

        public async Task<List<Blog>> GetMostPopularBlogsAllTime()
        {
            var posts = await _dbContext.Blogs
                .Include(p => p.Comments)
                .ToListAsync();

            // Order posts by popularity using LINQ without modifying the Post class
            var popularBlogs = posts.OrderByDescending(p => CalculatePopularity(p)).Take(10).ToList();

            return popularBlogs;
        }

        public async Task<List<Blog>> GetMostPopularBlogsChosenMonth(int month)
        {
            var blogs = await _dbContext.Blogs
                .Include(p => p.Comments)
                .ToListAsync();

            // Filter blogs based on the chosen month
            blogs = blogs.Where(p => p.CreatedAt?.Month == month).ToList();

            // Order blogs by popularity using LINQ without modifying the Post class
            var popularBlogs = blogs.OrderByDescending(p => CalculatePopularity(p)).Take(10).ToList();

            return popularBlogs;
        }

        public async Task<List<ApplicationUser>> GetMostPopularBloggersAllTime()
        {
            var blogs = await _dbContext.Blogs
                .Include(p => p.User)
                .ToListAsync();

            var bloggers = blogs.GroupBy(p => p.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    PopularityScore = g.Sum(p => CalculatePopularity(p))
                })
                .OrderByDescending(g => g.PopularityScore)
                .Take(10)
                .ToList();

            var popularBloggers = await _dbContext.Users
                .Where(u => bloggers.Select(b => b.UserId).Contains(u.Id))
                .ToListAsync();

            return popularBloggers;
        }

        public async Task<List<ApplicationUser>> GetMostPopularBloggersChosenMonth(int month)
        {
            var startDate = new DateTime(DateTime.Now.Year, month, 1);
            var endDate = startDate.AddMonths(1).Date;

            var blogs = await _dbContext.Blogs
                .Include(p => p.User)
                .Where(p => p.CreatedAt >= startDate && p.CreatedAt <= endDate)
                .ToListAsync();

            var bloggers = blogs.GroupBy(p => p.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    PopularityScore = g.Sum(p => CalculatePopularity(p))
                })
                .OrderByDescending(g => g.PopularityScore)
                .Take(10)
                .ToList();

            var popularBloggers = await _dbContext.Users
                .Where(u => bloggers.Select(b => b.UserId).Contains(u.Id))
                .ToListAsync();

            return popularBloggers;
        }
    }
}
