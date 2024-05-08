using BisleriumBlog.DTO;
using BisleriumBlog.Models;
using Microsoft.Extensions.Hosting;

namespace BisleriumBlog.Interface
{
    public interface IBlogService
    {
        Task<Blog> AddBlog(string userId, string title, string content, string imageUrl);
        Task<IEnumerable<Blog>> GetAllBlogs();
        Task<Blog?> UpdateBlog(Blog blog);
        Task DeleteBlog(string id);
        Task<IEnumerable<Blog>> GetBlogbyId(string id);
        Task<IEnumerable<BlogHistory>> GetBlogHistory(Guid blogId);
        Task<IEnumerable<BlogWithDetailsDto>> GetAllBlogsWithDetails();
        Task<IEnumerable<BlogWithDetailsDto>> GetAllBlogsWithDetails(string userId);
        Task<IEnumerable<BlogWithDetailsDto>> GetAllBlogsWithDetails(int page, int pageSize, string sortBy);
        Task<IEnumerable<Blog>> UpdateAllBlogs(IEnumerable<Blog> blogs);



    }
}
