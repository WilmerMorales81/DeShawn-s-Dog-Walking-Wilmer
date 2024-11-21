import { useState, useEffect } from "react";
import { getCity, addCity } from "./apiManager";

export default function Cities() {
  const [cities, setCities] = useState([]); // Lista de ciudades
  const [newCity, setNewCity] = useState({ name: "" }); // Nueva ciudad
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario

  useEffect(() => {
    // Obtener la lista de ciudades del backend
    getCity()
      .then(setCities)
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Enviar la nueva ciudad al backend
    addCity(newCity)
      .then((addedCity) => {
        // Actualizar la lista de ciudades con la nueva ciudad
        setCities((prevCities) => [...prevCities, addedCity]);
        setShowForm(false); // Ocultar el formulario tras agregar
        setNewCity({ name: "" }); // Limpiar el formulario
      })
      .catch((error) => {
        console.error("Error adding city:", error);
      });
  };

  return (
    <div>
      <h3>City List</h3>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add City"}
      </button>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="add-city-form">
          <h4>Add a New City</h4>
          <label>
            City Name:
            <input
              type="text"
              value={newCity.name}
              onChange={(e) => setNewCity({ name: e.target.value })}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}

      <ul>
        {cities.map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    </div>
  );
}
