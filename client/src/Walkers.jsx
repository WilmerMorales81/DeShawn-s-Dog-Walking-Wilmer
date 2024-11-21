import { useEffect, useState } from "react";
import { getWalkers, getCity } from "./apiManager";
import AssignDog from "./AssignDog";
import WalkerEdit from "./walkerEdit";
import "./App.css";

export default function Walkers() {
  const [walkers, setWalkers] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedWalker, setSelectedWalker] = useState(null); // Para Add Dog
  const [walkerToEdit, setWalkerToEdit] = useState(null); // Para editar walker

  useEffect(() => {
    getWalkers().then(setWalkers);
    getCity().then(setCities);
  }, []);

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);

    if (cityId) {
      fetch(`/api/walkers?cityId=${cityId}`)
        .then((res) => res.json())
        .then(setWalkers);
    } else {
      getWalkers().then(setWalkers);
    }
  };

  const handleDeleteWalker = (walkerId) => {
    if (window.confirm("Are you sure you want to delete this walker?")) {
      fetch(`/api/walkers/${walkerId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setWalkers(walkers.filter((walker) => walker.id !== walkerId));
            alert("Walker deleted successfully.");
          } else {
            alert("Failed to delete walker.");
          }
        })
        .catch((error) => alert("Error deleting walker: " + error));
    }
  };

  if (walkerToEdit) {
    // Renderizar WalkerEdit si hay un walker seleccionado para editar
    return (
      <WalkerEdit
        walker={walkerToEdit}
        cities={cities}
        onUpdate={() => {
          setWalkerToEdit(null); // Vuelve a la lista después de actualizar
          getWalkers().then(setWalkers); // Refresca la lista
        }}
        onCancel={() => setWalkerToEdit(null)} // Cancelar edición
      />
    );
  }

  return (
    <div>
      <h3>Walkers List</h3>
      <label>
        Filter by City:
        <select value={selectedCity} onChange={handleCityChange}>
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </label>
      <ul>
        <section className="list-container">
          {walkers.map((walker) => (
            <li className="walkerList" key={walker.id}>
              {walker.name}{" "}
              <button onClick={() => setSelectedWalker(walker)}>Add Dog</button>{" "}
              <button onClick={() => setWalkerToEdit(walker)}>Update</button>{" "}
              <button onClick={() => handleDeleteWalker(walker.id)}>Remove</button>
            </li>
          ))}
        </section>
      </ul>

      {selectedWalker && (
        <AssignDog
          walker={selectedWalker}
          onDogAssigned={() => setSelectedWalker(null)}
        />
      )}
    </div>
  );
}
