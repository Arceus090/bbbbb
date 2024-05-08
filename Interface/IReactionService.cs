using BisleriumBlog.Models;
using System.Threading.Tasks;

namespace BisleriumBlog.Interface
{
    public interface IReactionService
    {
        Task<Reaction> CreateReaction(string userId, Guid? blogId, Guid? commentId, ReactionType reactionType);
        Task RemoveReaction(string userId, Guid reactionId);
        Task UpdateReactionType(string userId, Guid reactionId, ReactionType newReactionType);
        Task<Reaction> GetReactionById(Guid reactionId);
    }
}
