using System.ComponentModel.DataAnnotations;

namespace BisleriumBlog.Models
{
    public class Blog
    {
        [Key]
        public Guid BlogId { get; set; }
        [Required]
        public string? UserId { get; set; }
        [Required]
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ApplicationUser? User { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<Reaction>? Reactions { get; set; }
        public ICollection<BlogHistory>? Revisions { get; set; }
    }
}
