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
    }
}