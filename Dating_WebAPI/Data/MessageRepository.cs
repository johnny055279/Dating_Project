using AutoMapper;
using AutoMapper.QueryableExtensions;
using Dating_WebAPI.DTOs;
using Dating_WebAPI.Entities;
using Dating_WebAPI.Helpers;
using Dating_WebAPI.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating_WebAPI.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }

        public void AddMessage(Message message)
        {
            _dataContext.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _dataContext.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _dataContext.Messages
            .Include(n=>n.Sender)
            .Include(n=>n.Recipient)
            .SingleOrDefaultAsync(n => n.Id == id);
        }

        public async Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _dataContext.Messages.OrderByDescending(n => n.MessageSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(n => n.Recipient.UserName == messageParams.Username && n.RecipientDeleted == false),
                "Outbox" => query.Where(n => n.Sender.UserName == messageParams.Username && n.SenderDeleted == false),
                _ => query.Where(n => n.Recipient.UserName == messageParams.Username && n.DateRead == null && n.RecipientDeleted == false)
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            // messageParams繼承了PaginationParams，所以可以使用其屬性。
            return await PageList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        async Task<IEnumerable<MessageDto>> IMessageRepository.GetMessageThread(string currentUserName, string recipientUserName)
        {
            // 獲取傳輸訊息的雙方資訊
            var messages = await _dataContext.Messages
                .Include(n => n.Sender).ThenInclude(n => n.Photos)
                .Include(n => n.Recipient).ThenInclude(n => n.Photos)
                .Where(n => n.Recipient.UserName == currentUserName && n.Sender.UserName == recipientUserName && n.RecipientDeleted == false
                         || n.Recipient.UserName == recipientUserName && n.Sender.UserName == currentUserName && n.SenderDeleted == false
            ).OrderBy(n => n.MessageSent).ToListAsync();

            // 獲取任何未讀取的資訊(利用多對多產生的欄位null決定)
            var unReadMessage = messages.Where(n => n.DateRead == null && n.Recipient.UserName == currentUserName).ToList();

            // 賦予時間標記為已讀
            if (unReadMessage.Any())
            {
                foreach (var message in unReadMessage)
                {
                    message.DateRead = DateTime.Now;
                }

                await _dataContext.SaveChangesAsync();
            }

            // 準備將資訊丟回Controller
            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        async Task<bool> IMessageRepository.SaveAllAsync()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}