using BisleriumBlog.DTO;
using BisleriumBlog.Interface;
using BisleriumBlog.Models;
using Microsoft.EntityFrameworkCore;

namespace BisleriumBlog.Services
{
    public class BlogService : IBlogService
    {
        private readonly ApplicationDbContext _dbContext;


        public BlogService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Blog> AddBlog(string userId, string title, string content, string imageUrl)
        {
            var blog = new Blog
            {
                BlogId = Guid.NewGuid(),
                UserId = userId,
                Title = title,
                Content = content,
                ImageUrl = imageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Blogs.Add(blog);
            await _dbContext.SaveChangesAsync();

            return blog;
        }

      

        public async Task DeleteBlog(string id)
        {
            var blog = await _dbContext.Blogs.FindAsync(Guid.Parse(id));
            if (blog != null)
            {
                _dbContext.Blogs.Remove(blog);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Blog>> GetAllBlogs()
        {
            return await _dbContext.Blogs.ToListAsync();
        }

        public async Task<IEnumerable<Blog>> GetBlogbyId(string id)
        {
            var result = await _dbContext.Blogs.Where(s => s.BlogId.ToString() == id).ToListAsync();
            return result;
        }

        public async Task<Blog?> UpdateBlog(Blog blog)
        {
            var selectedBlog = await _dbContext.Blogs.FindAsync(blog.BlogId);
            if (selectedBlog != null)
            {
                var blogHistory = new BlogHistory
                {
                    BlogHistoryId = Guid.NewGuid(),
                    BlogId = selectedBlog.BlogId,
                    Title = selectedBlog.Title,
                    Content = selectedBlog.Content,
                    ImageUrl = selectedBlog.ImageUrl,
                    UpdatedAt = DateTime.UtcNow
                };
                _dbContext.BlogHistories.Add(blogHistory);
                selectedBlog.Title = blog.Title;
                selectedBlog.Content = blog.Content;
                selectedBlog.ImageUrl = blog.ImageUrl;
                selectedBlog.UpdatedAt = DateTime.UtcNow;
                

                _dbContext.Entry(selectedBlog).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                return selectedBlog;
            }
            else
            {
                return null;
            }
        }
        public async Task<IEnumerable<BlogHistory>> GetBlogHistory(Guid blogId)
        {
            // Retrieve blog history entries for the specified blog
            var blogHistories = await _dbContext.BlogHistories
                .Where(h => h.BlogId == blogId)
                .OrderByDescending(h => h.UpdatedAt)
                .ToListAsync();

            return blogHistories;
        }
        public async Task<IEnumerable<BlogWithDetailsDto>> GetAllBlogsWithDetails()
        {
            var blogsWithDetails = await _dbContext.Blogs
                .Include(b => b.User)
                .Include(b => b.Comments)
                    .ThenInclude(c => c.User)
                .Include(b => b.Reactions)
                .Select(b => new BlogWithDetailsDto
                {
                    Blog = b,
                    Username = b.User.UserName,
                    Comments = b.Comments,
                    Reactions = b.Reactions
                })
                .ToListAsync();

            return blogsWithDetails;
        }
        public async Task<IEnumerable<BlogWithDetailsDto>> GetAllBlogsWithDetails(string userId)
        {
            var blogsWithDetails = await _dbContext.Blogs
                .Include(b => b.User)
                .Include(b => b.Comments)
                    .ThenInclude(c => c.User)
                .Include(b => b.Reactions)
                .Where(b => b.UserId == userId)
                .Select(b => new BlogWithDetailsDto
                {
                    Blog = b,
                    Username = b.User.UserName,
                    Comments = b.Comments,
                    Reactions = b.Reactions
                })
                .ToListAsync();

            return blogsWithDetails;
        }

        public async Task<IEnumerable<BlogWithDetailsDto>> GetAllBlogsWithDetails(int page, int pageSize, string sortBy)
        {
            var query = _dbContext.Blogs
                .Include(b => b.User)
                .Include(b => b.Comments)
                    .ThenInclude(c => c.User)
                .Include(b => b.Reactions)
                .AsQueryable();

            switch (sortBy)
            {
                case "random":
                    query = query.OrderBy(_ => Guid.NewGuid());
                    break;
                case "popularity":
                    query = query.OrderByDescending(post => CalculatePopularity(post));
                    break;
                case "recency":
                    query = query.OrderByDescending(post => post.CreatedAt);
                    break;
                default:
                    query = query.OrderByDescending(post => post.CreatedAt);
                    break;
            }

            var paginatedBlogs = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BlogWithDetailsDto
                {
                    Blog = b,
                    Username = b.User.UserName,
                    Comments = b.Comments,
                    Reactions = b.Reactions
                })
                .ToListAsync();

            return paginatedBlogs;
        }

        private object CalculatePopularity(Blog post)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<Blog>> UpdateAllBlogs(IEnumerable<Blog> blogs)
        {
            foreach (var blog in blogs)
            {
                var selectedBlog = await _dbContext.Blogs.FindAsync(blog.BlogId);
                if (selectedBlog != null)
                {
                    var blogHistory = new BlogHistory
                    {
                        BlogHistoryId = Guid.NewGuid(),
                        BlogId = selectedBlog.BlogId,
                        Title = selectedBlog.Title,
                        Content = selectedBlog.Content,
                        ImageUrl = selectedBlog.ImageUrl,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _dbContext.BlogHistories.Add(blogHistory);
                    selectedBlog.Title = blog.Title;
                    selectedBlog.Content = blog.Content;
                    selectedBlog.ImageUrl = blog.ImageUrl;
                    selectedBlog.UpdatedAt = DateTime.UtcNow;

                    _dbContext.Entry(selectedBlog).State = EntityState.Modified;
                }
            }

            await _dbContext.SaveChangesAsync();

            return blogs.ToList();
        }

    }
}
