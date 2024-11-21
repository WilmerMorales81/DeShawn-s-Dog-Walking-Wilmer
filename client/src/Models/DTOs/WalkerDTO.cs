namespace DeShawnsDogWalking.client.src.Models.DTOs;

public class WalkerDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int? DogId { get; set; } // O int? si prefieres nullable
    public int CityId { get; set; }
    public string? CityName { get; set; }
    public List<CityDTO>? Cities { get; set; } // Agrega esta propiedad
    
}