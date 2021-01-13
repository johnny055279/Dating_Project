using Dating_WebAPI.DTOs;
using Dating_WebAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Dating_WebAPI.Controllers
{
    [Authorize]
    public class UsersController : BaseApIController
    {
        private readonly IUserRepository _userRepository;
        private readonly AutoMapper.IMapper _mapper;

        public UsersController(IUserRepository userRepository, AutoMapper.IMapper mapper)
        {
            this._userRepository = userRepository;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();

            // 不加Ok會有形別上的錯誤。
            return Ok(users);
        }

        //api/users/username
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        // Updating並不需要從Client傳送Object過來，因為Client已經有所有的Data聯繫Entity
        // 這裡是告訴API什麼東西被Update了
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            // 抓Token的資料作比對。
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUserNameAsync(userName);

            // Map可以直接幫助我們讓DTO與Entity做對應，不然就要寫user.City = memberUpdateDTO.City....等。
            _mapper.Map(memberUpdateDTO, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("資料更新錯誤");
        }
    }
}