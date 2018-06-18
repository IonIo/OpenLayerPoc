using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

namespace Map.BackEnd
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
           services.AddMvc();
           services.AddCors();
        }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
          app.UseFileServer(new FileServerOptions
          {
            FileProvider = new PhysicalFileProvider(
            Path.Combine(Directory.GetCurrentDirectory(), "MyStaticFiles")),
            RequestPath = "/StaticFiles",
            EnableDirectoryBrowsing = true
          });

          app.UseCors(builder =>
              builder.WithOrigins("http://localhost:4251")
                .AllowAnyHeader());

      if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
          app.UseMvc(routes =>
          {
            routes.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
          });
      app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hello World!");
            });
        }
    }
}
