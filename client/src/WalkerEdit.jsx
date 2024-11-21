import { useState } from "react";
import { updateWalkerCities } from "./apiManager"; // Asegúrate de tener este método en el API Manager

export default function WalkerEdit({ walker, cities, onUpdate, onCancel }) {
  const [name, setName] = useState(walker.name);
  const [selectedCities, setSelectedCities] = useState(
    walker.cities?.map((c) => c.id) || []
  );

  // Manejar selección de ciudades
  const handleCityToggle = (cityId) => {
    setSelectedCities((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId) // Quitar ciudad si ya está seleccionada
        : [...prev, cityId] // Agregar ciudad si no está seleccionada
    );
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Actualizar las ciudades del walker
      await updateWalkerCities(walker.id, selectedCities);
      alert("Walker cities updated successfully");

      // Notificar al componente padre que se realizó la actualización
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to update walker:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Walker</h3>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <fieldset>
        <legend>Cities:</legend>
        {cities.map((city) => (
          <label key={city.id}>
            <input
              type="checkbox"
              checked={selectedCities.includes(city.id)}
              onChange={() => handleCityToggle(city.id)}
            />
            {city.name}
          </label>
        ))}
      </fieldset>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
