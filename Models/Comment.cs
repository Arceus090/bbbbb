using System.ComponentModel.DataAnnotations;

namespace BisleriumBlog.Models
{
    public class Comment
    {
        [Key]
        public Guid CommentId { get; set; }
        [Required]
        public string? UserId { get; set; }
        [Required]
        public Guid BlogId { get; set; }
        [Required]
        public string? CommentText { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ApplicationUser? User { get; set; }
        public Blog? Blog { get; set; }
      
        public ICollection<Reaction>? Reactions { get; set; }
    }
}
