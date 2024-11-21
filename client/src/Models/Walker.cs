namespace DeShawnsDogWalking.client.src.Models.Models;

public class Walker
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int? DogId { get; set; }
    public int CityId { get; set; } // Relación original
    public List<City>? Cities { get; set; } // Relación muchos a muchos (opcional)
}
