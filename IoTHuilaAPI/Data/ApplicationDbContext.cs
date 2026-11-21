using Microsoft.EntityFrameworkCore;
using IoTHuilaAPI.Models;

namespace IoTHuilaAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Lectura> Lecturas { get; set; }
    }
}