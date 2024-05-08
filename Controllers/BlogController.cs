using BisleriumBlog.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static BisleriumBlog.DTO.Request;
using System.Security.Claims;
using BisleriumBlog.DTO;
using BisleriumBlog.Models;
using BisleriumBlog.Services;

namespace BisleriumBlog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        public readonly IBlogService _blogService;
        private readonly IWebHostEnvironment _hostingEnvironment;
       

        public BlogController(IBlogService postService, IWebHostEnvironment hostingEnvironment)
        {
            _blogService = postService;
            _hostingEnvironment = hostingEnvironment;
          
        }
        [HttpPost, Route("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("No image uploaded.");
            }

            // Check WebRootPath for debugging purposes
            if (string.IsNullOrEmpty(_hostingEnvironment.WebRootPath))
            {
                return StatusCode(500, "Hosting environment is not properly configured. WebRootPath is null.");
            }

            // Create the directory if it doesn't exist
            string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
            if (string.IsNullOrEmpty(uploadsFolder))
            {
                return StatusCode(500, "The uploads folder path is null or empty.");
            }

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Create a unique file name
            string fileName = $"{Guid.NewGuid()}_{image.FileName}";
            string filePath = Path.Combine(uploadsFolder, fileName);

            if (string.IsNullOrEmpty(filePath))
            {
                return StatusCode(500, "File path is null or empty.");
            }

            // Copy the file to the specified location
            try
            {
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while copying the file: {ex.Message}");
            }

            // Update the URL to reflect your server configuration
            string imageUrl = $"https://localhost:7279/uploads/{fileName}";

            return Ok(new { ImageUrl = imageUrl });
        }


        [HttpPost, Route("blog/add")]
        [Authorize]
        
        public async Task<IActionResult> AddPost([FromBody] BlogRequestModel model)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User id claim not found in token.");
                }

                var post = await _blogService.AddBlog(userId, model.Title, model.Content, model.ImageUrl);
                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet, Route("blog/get-all")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllPost()
        {
            return Ok(await _blogService.GetAllBlogs());
        }

        [HttpGet, Route("post/get-by-id")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetPostByID(string id)
        {
            var result = await _blogService.GetBlogbyId(id);
            return Ok(result);
        }

        [HttpDelete, Route("blog/delete")]
        [Authorize]
      
        public async Task<IActionResult> DeletePostByID(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var posts = await _blogService.GetBlogbyId(id);
            var post = posts.FirstOrDefault(); // Get the first post in case of multiple results

            if (post == null)
            {
                return NotFound();
            }

            if (User.IsInRole("Admin") || post.UserId == userId)
            {
                await _blogService.DeleteBlog(id);
                return Ok();
            }

            return Forbid("Sorry, you are not authorized to delete this resource.");
        }

        [HttpPut, Route("blog/update")]
       
        public async Task<IActionResult> UpdatePostByID(Guid postId, [FromBody] BlogRequestModel model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Retrieve the post by ID from the database
            var existingPost = await _blogService.GetBlogbyId(postId.ToString());

            if (existingPost == null || !existingPost.Any())
            {
                return NotFound();
            }

            // Get the first post from the list
            var post = existingPost.First();

            // Check if the user is authorized to update the post
            if (post.UserId == userId || User.IsInRole("Admin"))
            {
                post.Title = model.Title;
                post.Content = model.Content;
                post.ImageUrl = model.ImageUrl;
                post.UpdatedAt = DateTime.UtcNow;

                // Update the post in the database
                var updatedPost = await _blogService.UpdateBlog(post);

                if (updatedPost != null)
                {
                    return Ok(updatedPost);
                }
                else
                {
                    return StatusCode(500, "Failed to update Blog.");
                }
            }

            // Return Forbidden if user is not authorized to update the post
            return Forbid();
        }
        [HttpGet, Route("blog/history/{id}")]
        [AllowAnonymous] // Adjust authorization as needed
        public async Task<IActionResult> GetBlogHistory(Guid id)
        {
            try
            {
                var blogHistory = await _blogService.GetBlogHistory(id);

                if (blogHistory == null || !blogHistory.Any())
                {
                    return NotFound();
                }

                return Ok(blogHistory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("all-with-details")]
        public async Task<IActionResult> GetAllBlogsWithDetails()
        {
            try
            {
                var blogsWithDetails = await _blogService.GetAllBlogsWithDetails();
                return Ok(blogsWithDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("all-with-details/{userId}")]
        public async Task<IActionResult> GetAllBlogsWithDetails(string userId)
        {
            try
            {
                var blogsWithDetails = await _blogService.GetAllBlogsWithDetails(userId);
                return Ok(blogsWithDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("paginated")]
        public async Task<IActionResult> GetPaginatedBlogs([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string sortBy = "recency")
        {
            try
            {
                var blogsWithDetails = await _blogService.GetAllBlogsWithDetails(page, pageSize, sortBy);
                return Ok(blogsWithDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet, Route("blog/history/all")]
        [AllowAnonymous] // Adjust authorization as needed
        public async Task<IActionResult> GetAllBlogHistory()
        {
            try
            {
                // Retrieve all blog history entries
                var allBlogHistory = new List<BlogHistory>();
                var allBlogs = await _blogService.GetAllBlogs();

                foreach (var blog in allBlogs)
                {
                    var blogHistory = await _blogService.GetBlogHistory(blog.BlogId);
                    allBlogHistory.AddRange(blogHistory);
                }

                if (allBlogHistory == null || !allBlogHistory.Any())
                {
                    return NotFound();
                }

                return Ok(allBlogHistory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
