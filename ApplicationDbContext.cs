using BisleriumBlog.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BisleriumBlog
{

        public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
        {
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
            {

            }
          
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //One to Many Relationship between User and Blog
            builder.Entity<Blog>()
                .HasOne(p => p.User)
                .WithMany(p => p.Blogs)
                .HasForeignKey(p => p.UserId)
                .IsRequired();

            // One-to-Many Relationship between Blog and Comment
            builder.Entity<Comment>()
                .HasOne(c => c.Blog)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.BlogId)
                .IsRequired();

            // One-to-Many Relationship between User and Comment
            builder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .IsRequired();

          

            // Many-to-One Relationship between User and Reaction
            builder.Entity<Reaction>()
                .HasOne(v => v.User)
                .WithMany(u => u.Reactions)
                .HasForeignKey(v => v.UserId)
                .IsRequired();

            // Many-to-One Relationship between Blog and Reaction
            builder.Entity<Reaction>()
                .HasOne(v => v.Blog)
                .WithMany(p => p.Reactions)
                .HasForeignKey(v => v.BlogId);

            // Many-to-One Relationship between Comment and rEACTION
            builder.Entity<Reaction>()
                .HasOne(v => v.Comment)
                .WithMany(c => c.Reactions)
                .HasForeignKey(v => v.CommentId);

            

            // Enum for VoteType
            builder.Entity<Reaction>()
                .Property(v => v.ReactionType)
                .HasConversion<string>();

            // Ensure unique constraint for (UserId, PostId), (UserId, CommentId), (UserId, ReplyId)
            builder.Entity<Reaction>()
                .HasIndex(v => new { v.UserId, v.BlogId })
                .IsUnique();

            builder.Entity<Reaction>()
                .HasIndex(v => new { v.UserId, v.CommentId })
                .IsUnique();

           
        }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Comment> Comments { get; set; }
       
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<BlogHistory> BlogHistories { get; set; }
        public DbSet<CommentHistory> CommentHistories { get; set; }
    }
}
    

