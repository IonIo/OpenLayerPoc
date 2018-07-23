using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Map.BackEnd.Controllers
{
    [Produces("application/json")]
    [Route("api/FileAPI")]
    public class FileAPIController : Controller
    {


    private IHostingEnvironment _hostingEnvironment;


        public FileAPIController(IHostingEnvironment hostingEnvironment)

    {

      _hostingEnvironment = hostingEnvironment;

    }

    [HttpPost("UploadFiles")]
    public async Task<IActionResult> Post(List<IFormFile> files)
    {
      long size = files.Sum(f => f.Length);

      // full path to file in temp location
      var filePath = Path.GetTempFileName();

      foreach (var formFile in files)
      {
        if (formFile.Length > 0)
        {
          using (var stream = new FileStream(filePath, FileMode.Create))
          {
            await formFile.CopyToAsync(stream);
          }
        }
      }

      // process uploaded files
      // Don't rely on or trust the FileName property without validation.

      return Ok(new { count = files.Count, size, filePath });
    }

    [HttpPost]
    [Route("UploadFile")]
    public async Task Upload(IFormFile file)
    {
      string webRootPath = _hostingEnvironment.ContentRootPath;
      string newPath = Path.Combine(webRootPath, "MyStaticFiles");

      if (file == null) throw new Exception("File is null");
      if (file.Length == 0) throw new Exception("File is empty");

      string fullPath = Path.Combine(newPath, file.FileName);

      using (var stream = new FileStream(fullPath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }
    }
  }
}
