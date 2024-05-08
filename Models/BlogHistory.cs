namespace BisleriumBlog.Models
{
    public class BlogHistory
    {
        public Guid BlogHistoryId { get; set; }

        public Guid BlogId { get; set; }

        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Blog? Blog { get; set; }
    }
}
