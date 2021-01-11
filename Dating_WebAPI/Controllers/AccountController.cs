using Dating_WebAPI.Data;
using Dating_WebAPI.DTOs;
using Dating_WebAPI.Entities;
using Dating_WebAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Dating_WebAPI.Controllers
{
    public class AccountController : BaseApIController
    {
        private readonly DataContext _dataContext;
        private readonly ITokenServices _tokenServices;

        public AccountController(DataContext dataContext, ITokenServices tokenServices)
        {
            this._dataContext = dataContext;
            this._tokenServices = tokenServices;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await UserExists(registerDTO.Email) || await UserExists(registerDTO.UserName))
            {
                // return http 400 and show message
                return BadRequest("Email or UserName is taken!");
            }
            else
            {
                // 用完即dispose
                using HMACSHA512 hmac = new HMACSHA512();

                AppUser user = new AppUser
                {
                    UserName = registerDTO.UserName,
                    Email = registerDTO.Email,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                    PasswordSalt = hmac.Key
                };
                _dataContext.Add(user);
                await _dataContext.SaveChangesAsync();

                return new UserDTO
                {
                    UserName = user.UserName,
                    Token = _tokenServices.CreateToken(user)
                };
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            AppUser user = await _dataContext.Users.SingleOrDefaultAsync(n => n.UserName == loginDTO.UserName);

            if (user == null)
            {
                return Unauthorized("Invalid username");
            }
            else
            {
                using HMACSHA512 hmac = new HMACSHA512(user.PasswordSalt);

                byte[] computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

                for (int i = 0; i < computeHash.Length; i++)
                {
                    if (computeHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
                }

                return new UserDTO
                {
                    UserName = user.UserName,
                    Token = _tokenServices.CreateToken(user)
                };
            }
        }

        private async Task<bool> UserExists(string data)
        {
            bool emailExists = await _dataContext.Users.AnyAsync(n => n.Email.ToLower() == data.ToLower());
            bool userNameExists = await _dataContext.Users.AnyAsync(n => n.UserName.ToLower() == data.ToLower());
            // 判斷帳號是否存在
            return emailExists || userNameExists;
        }
    }
}