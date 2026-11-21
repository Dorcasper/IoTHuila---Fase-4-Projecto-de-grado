using Microsoft.AspNetCore.Mvc;
using IoTHuilaAPI.Data;
using IoTHuilaAPI.Models;

namespace IoTHuilaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LecturasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LecturasController(
            ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
public IActionResult ObtenerLecturas()
{
    var lecturas = _context.Lecturas
        .OrderByDescending(x => x.Id)
        .Take(10)
        .OrderBy(x => x.Id)
        .ToList();

    return Ok(lecturas);
}

        [HttpPost]
        public IActionResult CrearLectura(
            [FromBody] Lectura lectura)
        {
            lectura.FechaRegistro =
                DateTime.Now;

            _context.Lecturas.Add(lectura);

            _context.SaveChanges();

            return Ok(lectura);
        }
    
    [HttpDelete]
public IActionResult LimpiarHistorial()
{
    _context.Lecturas.RemoveRange(
        _context.Lecturas
    );

    _context.SaveChanges();

    return Ok("Historial eliminado");
}
}}
