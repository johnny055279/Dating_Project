using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Dating_WebAPI.Entities
{
    public class Sexual
    {
        [Key]
        public int SexualId { get; set; }

        public string SexualType { get; set; }
        public List<AppUser> AppUsers { get; set; }
    }
}