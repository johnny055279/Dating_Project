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

        public string UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Email { get; set; }
        public int SexualId { get; set; }
        public int FavorId { get; set; }
        public Sexual Sexual { get; set; }
        public Favor Favor { get; set; }
    }
}