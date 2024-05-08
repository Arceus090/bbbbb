using BisleriumBlog.Interface;
using BisleriumBlog.Models;
using Microsoft.EntityFrameworkCore;

namespace BisleriumBlog.Services
{
    public class CommentService : ICommentService
    {
        private readonly ApplicationDbContext _dbContext;

        public CommentService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Comment> AddComment(string userId, Guid postId, string commentText)
        {
            var comment = new Comment
            {
                CommentId = Guid.NewGuid(),
                UserId = userId,
                BlogId = postId,
                CommentText = commentText,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Comments.Add(comment);
            await _dbContext.SaveChangesAsync();

            return comment;
        }
        public async Task<IEnumerable<Comment>> GetAllComments()
        {
            return await _dbContext.Comments.ToListAsync();
        }
        public async Task<IEnumerable<Comment>> GetCommentbyId(string id)
        {
            var result = await _dbContext.Comments.Where(s => s.CommentId.ToString() == id).ToListAsync();
            return result;
        }
        public async Task DeleteComment(string id)
        {
            var comment = await _dbContext.Comments.FindAsync(Guid.Parse(id));
            if (comment != null)
            {
                _dbContext.Comments.Remove(comment);
                await _dbContext.SaveChangesAsync();
            }
        }
        public async Task<Comment?> UpdateComment(Comment comment)
        {
            var selectedComment = await _dbContext.Comments.FindAsync(comment.CommentId);
            if (selectedComment != null)
            {
                var commentHistory = new CommentHistory
                {
                    CommentHistoryId = Guid.NewGuid(),
                    CommentId = selectedComment.CommentId,
                    CommentText = selectedComment.CommentText,
                
                    UpdatedAt = DateTime.UtcNow
                };
                _dbContext.CommentHistories.Add(commentHistory);
                selectedComment.CommentText = comment.CommentText;
                selectedComment.UpdatedAt = DateTime.UtcNow;

                _dbContext.Entry(selectedComment).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                return selectedComment;
            }
            else
            {
                return null;
            }
        }
        public async Task<IEnumerable<CommentHistory>> GetCommentHistory(Guid commentId)
        {
            // Retrieve blog history entries for the specified blog
            var commentHistories = await _dbContext.CommentHistories
                .Where(h => h.CommentId == commentId)
                .OrderByDescending(h => h.UpdatedAt)
                .ToListAsync();

            return commentHistories;
        }
    }
}
