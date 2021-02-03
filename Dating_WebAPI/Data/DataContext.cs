using Dating_WebAPI.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating_WebAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // 名字要跟DataBase裡面一樣，不然會抓不到!!
        public DbSet<AppUser> Users { get; set; }

        public DbSet<UserLike> Likes { get; set; }

        // 覆寫DbContext的function，以自訂建立Model的參數條件
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 不加這一段Migration會出錯。
            base.OnModelCreating(modelBuilder);

            // 建立複合式主鍵
            modelBuilder.Entity<UserLike>().HasKey(key => new { key.SourceUserId, key.LikeUserId });

            // 建立資料表關聯性，這裡為多對多。
            modelBuilder.Entity<UserLike>().HasOne(n => n.SourceUser).WithMany(n => n.LikedUsers).HasForeignKey(n => n.SourceUserId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}