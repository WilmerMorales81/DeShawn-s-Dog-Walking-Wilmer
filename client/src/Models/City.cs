namespace DeShawnsDogWalking.client.src.Models.Models;

public class City
{
    public int Id {get; set;}
    public string Name {get; set;}
    public List<Walker>? Walkers { get; set; } // Relación muchos a muchos (opcional)

}