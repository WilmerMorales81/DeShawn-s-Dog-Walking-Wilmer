namespace DeShawnsDogWalking.client.src.Models.Models;

public class Dog
{
    public int Id {get; set;}
    public string Name {get; set;}
     public int? CityId { get; set; } // Relación con la ciudad
    public int? WalkerId { get; set; }
}