namespace BisleriumBlog.Models
{
    public class CommentHistory
    {
        public Guid CommentHistoryId { get; set; }

        public Guid CommentId { get; set; }
        public string? CommentText { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Comment? Comments { get; set; }
    }
}
