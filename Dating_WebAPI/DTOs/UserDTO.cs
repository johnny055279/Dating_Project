﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating_WebAPI.DTOs
{
    // 專門記錄Token用
    public class UserDTO
    {
        public string UserName { get; set; }
        public string Token { get; set; }
    }
}