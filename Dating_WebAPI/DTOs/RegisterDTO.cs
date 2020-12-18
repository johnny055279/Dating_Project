using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Dating_WebAPI.DTOs
{
    // DTO指資料傳遞的物件，只定義，並不具備操作行為，用於傳遞訊息給client。
    public class RegisterDTO
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public int SexualId { get; set; }

        [Required]
        public int FavorId { get; set; }
    }
}