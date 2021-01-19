using AutoMapper;
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
        private readonly IMapper _mapper;

        public AccountController(DataContext dataContext, ITokenServices tokenServices, IMapper mapper)
        {
            this._dataContext = dataContext;
            this._tokenServices = tokenServices;
            this._mapper = mapper;
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
                var user = _mapper.Map<AppUser>(registerDTO);

                // 用完即dispose
                using HMACSHA512 hmac = new HMACSHA512();

                user.UserName = registerDTO.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
                user.PasswordSalt = hmac.Key;

                _dataContext.Add(user);
                await _dataContext.SaveChangesAsync();

                return new UserDTO
                {
                    UserName = user.UserName,
                    Token = _tokenServices.CreateToken(user),
                    NickName = user.NickName
                };
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            // 如果沒有Include Photos，則在return PhotoUrl的時候會因為找不到路徑而報Null Exception。
            AppUser user = await _dataContext.Users.Include(n => n.Photos).SingleOrDefaultAsync(n => n.UserName == loginDTO.UserName);

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
                    Token = _tokenServices.CreateToken(user),
                    // 記得要先Include Photo不然找不到。
                    PhotoUrl = user.Photos.FirstOrDefault(n => n.IsMain)?.Url,
                    NickName = user.NickName
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