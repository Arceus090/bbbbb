using BisleriumBlog.Interface;
using BisleriumBlog.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static BisleriumBlog.DTO.Request;
using System.Security.Claims;
using BisleriumBlog.DTO;

namespace BisleriumBlog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReactionController : ControllerBase
    {
        private readonly IReactionService _voteService;
        public ReactionController(IReactionService voteService)
        {
            _voteService = voteService;
        }

        [HttpPost, Route("vote/create")]
        [Authorize]
        public async Task<IActionResult> CreateVote([FromBody] ReactionRequestModel model)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User id claim not found in token.");
                }

                var vote = await _voteService.CreateReaction(userId, model.BlogId, model.CommentId, model.ReactionType);
                return Ok(vote);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete, Route("vote/remove")]
        [Authorize]
        public async Task<IActionResult> RemoveVote(Guid voteId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User id claim not found in token.");
                }

                // Check if the user is authorized to remove the vote
                var vote = await _voteService.GetReactionById(voteId); // Assuming there is a method to retrieve the vote by its ID
                if (vote != null && vote.UserId == userId)
                {
                    await _voteService.RemoveReaction(userId, voteId);
                    return Ok("Vote removed successfully.");
                }
                else
                {
                    return Forbid("You are not authorized to remove this vote.");
                }
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut, Route("vote/update")]
        [Authorize]
        public async Task<IActionResult> UpdateVoteType(Guid voteId, ReactionType newVoteType)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User id claim not found in token.");
                }

                // Check if the user is authorized to update the vote type
                var vote = await _voteService.GetReactionById(voteId); // Assuming there is a method to retrieve the vote by its ID
                if (vote != null && vote.UserId == userId)
                {
                    await _voteService.UpdateReactionType(userId, voteId, newVoteType);
                    return Ok("Vote type updated successfully.");
                }
                else
                {
                    return Forbid("You are not authorized to update this vote type.");
                }
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
