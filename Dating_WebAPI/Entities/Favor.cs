using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Dating_WebAPI.Entities
{
    public class Favor
    {
        [Key]
        public int FavorId { get; set; }

        public string FavorType { get; set; }

        public List<AppUser> AppUsers { get; set; }
    }
}