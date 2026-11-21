using System.ComponentModel.DataAnnotations.Schema;
namespace IoTHuilaAPI.Models
{
    public class Lectura
    {
        public int Id { get; set; }

        public decimal Humedad { get; set; }

        public decimal NivelAgua { get; set; }

        public decimal Caudal { get; set; }

        [Column("EstadoCultivo")]public string Estado { get; set; } = string.Empty;

        public DateTime FechaRegistro { get; set; }
    }
}