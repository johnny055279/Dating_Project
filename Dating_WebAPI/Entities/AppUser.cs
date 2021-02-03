using Dating_WebAPI.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Dating_WebAPI.Entities
{
    public class AppUser
    {
        [Key]
        public int UserId { get; set; }

        public string Gender { get; set; }
        public string UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Email { get; set; }
        public string NickName { get; set; }
        public DateTime Birthday { get; set; }
        public DateTime AccountCreateTime { get; set; } = DateTime.Now;
        public DateTime LastLoginTime { get; set; } = DateTime.Now;
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Introduction { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<UserLike> LikeByUser { get; set; }
        public ICollection<UserLike> LikedUsers { get; set; }
    }
}