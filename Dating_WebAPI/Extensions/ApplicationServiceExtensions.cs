using AutoMapper;
using Dating_WebAPI.Data;
using Dating_WebAPI.Helpers;
using Dating_WebAPI.Interfaces;
using Dating_WebAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating_WebAPI.Extensions
{
    public static class ApplicationServiceExtensions
    {
        // this 用於擴展方法中，用來指定該方法作用於哪個類型，
        // 擴展方法應為靜態
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            //設定LifeTime只存在一個request，在同一個Requset中，不論是在哪邊被注入，都是同樣的實例。
            services.AddScoped<ITokenServices, TokenServices>();

            //加入UserRepository
            services.AddScoped<IUserRepository, UseRepository>();

            //加入AutoMapper，參數內帶入Profiles的位址，這裡我們只創建一個Profiles
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            services.AddDbContext<DataContext>(option =>
            {
                option.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}