using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;

namespace BisleriumBlog.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime? CreatedAt { get; set; }
        public ICollection<Blog>? Blogs { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<Reaction>? Reactions { get; set; }
        
    }
}
