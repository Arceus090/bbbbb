using BisleriumBlog.Models;

namespace BisleriumBlog.Interface
{
    public interface ICommentService
    {
        Task<Comment> AddComment(string userId, Guid blogId, string commentText);
        Task<IEnumerable<Comment>> GetAllComments();
        Task<IEnumerable<Comment>> GetCommentbyId(string id);
        Task DeleteComment(string id);
        Task<Comment?> UpdateComment(Comment comment);
        Task<IEnumerable<CommentHistory>> GetCommentHistory(Guid blogId);
    }
}
