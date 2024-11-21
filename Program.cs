using DeShawnsDogWalking.client.src.Models.DTOs;
using DeShawnsDogWalking.client.src.Models.Models;
using Microsoft.AspNetCore.Authorization.Infrastructure;

List<Dog> dogs = new List<Dog>
{
    new Dog
    {
        Id = 1,
        Name = "Fluffy",
        CityId = 1,
        WalkerId = null
    },
    new Dog
    {
        Id = 2,
        Name = "Max",
        CityId = 2,
        WalkerId = null
    }
};

List<Walker> walkers = new List<Walker>
{
    new Walker
    {
        Id = 1,
        Name = "Pedro",
        DogId = 1,
        CityId = 1
    },
    new Walker
    {
        Id = 2,
        Name = "Sara",
        DogId = 2,
        CityId = 2 
    }
};

List<City> cities = new List<City>
{
    new City
    {
        Id = 1,
        Name = "Chicago"
    },
    new City
    {
        Id = 2,
        Name = "Kansas"
    }
};

List<WalkerCity> walkerCities = new List<WalkerCity>
{
    new WalkerCity
    {
        WalkerId = 1,
        CityId = 1 
    }

};


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/api/hello", () =>
{
    return new { Message = "Welcome to DeShawn's Dog Walking" };
});


app.MapGet("/api/dogs", () =>
{
    return dogs.Select(d =>
    {
        var walker = walkers.FirstOrDefault(w => w.Id == d.WalkerId);
        return new DogDTO
        {
            Id = d.Id,
            Name = d.Name,
            CityId = d.CityId ?? 0,
            Walker = walker != null 
                ? new WalkerDTO 
                  { 
                      Id = walker.Id, 
                      Name = walker.Name 
                  } 
                : null
        };
    });
});





app.MapGet("/api/cities", () =>
{
    return cities.Select(c => new CityDTO
    {
        Id = c.Id,
        Name = c.Name
    });
});

app.MapGet("/api/walkers", (int? cityId) =>
{
    var filteredWalkers = cityId.HasValue
        ? walkers.Where(w => w.CityId == cityId.Value).ToList()
        : walkers;

    return filteredWalkers.Select(w => new WalkerDTO
    {
        Id = w.Id,
        Name = w.Name,
        DogId = w.DogId ?? 0, // Usar valor por defecto en caso de que DogId sea null
        CityId = w.CityId,
        CityName = cities.FirstOrDefault(c => c.Id == w.CityId)?.Name
    });
});


app.MapGet("/api/walkers/{walkerId}/availableDogs", (int walkerId) =>
{
    var walker = walkers.FirstOrDefault(w => w.Id == walkerId);
    if (walker == null)
    {
        return Results.NotFound("Walker not found.");
    }

    var availableDogs = dogs
        .Where(d => d.CityId == walker.CityId && d.WalkerId == null) // Filtrar perros sin asignar
        .Select(d => new DogDTO
        {
            Id = d.Id,
            Name = d.Name,
            Walker = null // Ningún caminador asignado aún
        })
        .ToList();

    return Results.Ok(availableDogs);
});

app.MapPost("/api/dogs", (DogDTO newDog) =>
{
    if (string.IsNullOrWhiteSpace(newDog.Name))
    {
        return Results.BadRequest("Dog name is required.");
    }

    // Generar un nuevo ID para el perro
    var newId = dogs.Any() ? dogs.Max(d => d.Id) + 1 : 1;

    // Crear el nuevo perro
    var dog = new Dog
    {
        Id = newId,
        Name = newDog.Name,
        CityId = newDog.CityId
    };

    // Agregar a la lista
    dogs.Add(dog);

    // Retornar el nuevo perro como DogDTO
    return Results.Created($"/api/dogs/{newId}", new DogDTO
    {
        Id = dog.Id,
        Name = dog.Name,
        CityId = dog.CityId ?? 0,
        Walker = null // Sin walker asignado aún
    });
});



// Endpoint para asignar un perro a un walker
app.MapPost("/api/walkers/{walkerId}/assignDog/{dogId}", (int walkerId, int dogId) =>
{
    var walker = walkers.FirstOrDefault(w => w.Id == walkerId);
    if (walker == null)
    {
        return Results.NotFound($"Walker with ID {walkerId} not found.");
    }

    var dog = dogs.FirstOrDefault(d => d.Id == dogId);
    if (dog == null)
    {
        return Results.NotFound($"Dog with ID {dogId} not found.");
    }

    if (dog.WalkerId != null)
    {
        return Results.BadRequest($"Dog {dog.Name} is already assigned to walker ID {dog.WalkerId}.");
    }

    // Asignar el perro al walker
    dog.WalkerId = walkerId;

    return Results.Ok(new DogDTO
    {
        Id = dog.Id,
        Name = dog.Name,
        Walker = new WalkerDTO
        {
            Id = walker.Id,
            Name = walker.Name
        }
    });
});

app.MapPost("/api/cities", (CityDTO newCity) =>
{
    if (string.IsNullOrWhiteSpace(newCity.Name))
    {
        return Results.BadRequest("City name is required.");
    }

    // Generar un nuevo ID para la ciudad
    var newId = cities.Any() ? cities.Max(c => c.Id) + 1 : 1;

    // Crear la nueva ciudad
    var city = new City
    {
        Id = newId,
        Name = newCity.Name
    };

    // Agregarla a la lista
    cities.Add(city);

    // Retornar la nueva ciudad como CityDTO
    return Results.Created($"/api/cities/{newId}", new CityDTO
    {
        Id = city.Id,
        Name = city.Name
    });
});

app.MapPut("/api/walkers/{walkerId}/cities", (int walkerId, List<int> cityIds) =>
{
    var walker = walkers.FirstOrDefault(w => w.Id == walkerId);
    if (walker == null)
    {
        return Results.NotFound($"Walker with ID {walkerId} not found.");
    }

    // Remover las relaciones existentes para este walker
    walkerCities.RemoveAll(wc => wc.WalkerId == walkerId);

    // Agregar nuevas relaciones
    foreach (var cityId in cityIds)
    {
        if (cities.Any(c => c.Id == cityId)) // Validar que la ciudad existe
        {
            walkerCities.Add(new WalkerCity
            {
                WalkerId = walkerId,
                CityId = cityId
            });
        }
    }

    // Actualizar la propiedad Cities del walker (si es necesario usarla)
    walker.Cities = walkerCities
        .Where(wc => wc.WalkerId == walkerId)
        .Select(wc => cities.First(c => c.Id == wc.CityId))
        .ToList();

    // Retornar un DTO actualizado
    return Results.Ok(new WalkerDTO
    {
        Id = walker.Id,
        Name = walker.Name,
        DogId = walker.DogId ?? 0,
        CityId = walker.CityId,
        CityName = cities.FirstOrDefault(c => c.Id == walker.CityId)?.Name,
        Cities = walker.Cities?.Select(c => new CityDTO
        {
            Id = c.Id,
            Name = c.Name
        }).ToList()
    });
});

app.MapPut("/api/walkers/{walkerId}", (int walkerId, Walker updatedWalker) =>
{
    var walker = walkers.FirstOrDefault(w => w.Id == walkerId);
    if (walker == null)
    {
        return Results.NotFound($"Walker with ID {walkerId} not found.");
    }

    walker.Name = updatedWalker.Name;
    walker.DogId = updatedWalker.DogId;

    return Results.Ok(walker);
});

app.MapDelete("/api/dogs/{dogId}", (int dogId) =>
{
    var dog = dogs.FirstOrDefault(d => d.Id == dogId);
    if (dog == null)
    {
        return Results.NotFound($"Dog with ID {dogId} not found.");
    }

    // Remover el perro de la lista
    dogs.Remove(dog);

    return Results.Ok($"Dog with ID {dogId} was successfully deleted.");
});

// Endpoint para eliminar un walker
app.MapDelete("/api/walkers/{walkerId}", (int walkerId) =>
{
    var walker = walkers.FirstOrDefault(w => w.Id == walkerId);
    if (walker == null)
    {
        return Results.NotFound($"Walker with ID {walkerId} not found.");
    }

    // Desasignar los perros que estaban asociados con este walker
    foreach (var dog in dogs.Where(d => d.WalkerId == walkerId))
    {
        dog.WalkerId = null; // Remover la asignación
    }

    // Remover al walker de la lista
    walkers.Remove(walker);

    return Results.Ok($"Walker with ID {walkerId} was successfully deleted, and associated dogs were unassigned.");
});












app.Run();

