using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using WebApplication8.Models.API;
using WebApplication8.Models.Token;

namespace WebApplication8.Data
{
    public class HomeQuestContext(DbContextOptions<HomeQuestContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(u => u.refreshTokens)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.userId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.propertiesListings)
                .WithOne(d => d.User)
                .HasForeignKey(d => d.userId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PropertyView>()
                .HasOne(pv => pv.User)
                .WithMany(u => u.PropertiesViews)
                .HasForeignKey(pv => pv.userId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<PropertyView>()
                .HasOne(pv => pv.PropertyListing)
                .WithMany(pl => pl.PropertiesViews)
                .HasForeignKey(pv => pv.propertyLisingId)
                .OnDelete(DeleteBehavior.NoAction);
        }
        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<PropertyListing> PropertiesListings => Set<PropertyListing>();
        public DbSet<PropertyView> PropertyViews => Set<PropertyView>();
    }
}
