using BisleriumBlog.Interface;
using BisleriumBlog.Models;
using Microsoft.EntityFrameworkCore;

namespace BisleriumBlog.Services
{
    public class ReactionService:IReactionService
    {
        private readonly ApplicationDbContext _dbContext;
        public ReactionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Reaction> CreateReaction(string userId, Guid? blogId, Guid? commentId, ReactionType reactionType)
        {
            var vote = new Reaction
            {
                ReactionId = Guid.NewGuid(),
                UserId = userId,
                BlogId = blogId,
                CommentId = commentId,
                
                ReactionType = reactionType,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                _dbContext.Reactions.Add(vote);
                await _dbContext.SaveChangesAsync();
                return vote;
            }
            catch (DbUpdateException ex)
            {
                // Handle unique constraint violation
                if (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlException && sqlException.Number == 2601)
                {
                    // Unique constraint violation
                    throw new InvalidOperationException("You have already voted on this post, comment, or reply.");
                }
                throw;
            }
        }

        public async Task RemoveReaction(string userId, Guid reactionId)
        {
            var reaction = await _dbContext.Reactions.FirstOrDefaultAsync(v => v.ReactionId == reactionId && v.UserId == userId);

            if (reaction != null)
            {
                _dbContext.Reactions.Remove(reaction);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("Vote not found or you are not authorized to remove this reaction.");
            }
        }

        public async Task UpdateReactionType(string userId, Guid reactionId, ReactionType newReactionType)
        {
            var reaction = await _dbContext.Reactions.FirstOrDefaultAsync(v => v.ReactionId == reactionId && v.UserId == userId);

            if (reaction != null)
            {
                reaction.ReactionType = newReactionType;
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("Reaction not found or you are not authorized to update this reaction.");
            }
        }
        // Implementation of the missing method from the interface
        public async Task<Reaction> GetReactionById(Guid reactionId)
        {
            return await _dbContext.Reactions.FindAsync(reactionId);
        }
    }
}
