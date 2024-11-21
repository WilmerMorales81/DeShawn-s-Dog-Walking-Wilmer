import { useEffect, useState } from "react";
import { getGreeting, getDog, getWalker, addDog, deleteDog } from "./apiManager";
import "./index.css";

export default function Home() {
  const [greeting, setGreeting] = useState({
    message: "Not Connected to the API",
  });
  const [dogs, setDogs] = useState([]);
  const [walkers, setWalkers] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
  const [newDog, setNewDog] = useState({ name: "" }); // Estado para los datos del formulario

  useEffect(() => {
    // Obtener los datos iniciales
    getGreeting()
      .then(setGreeting)
      .catch(() => console.log("API not connected"));

    getDog()
      .then(setDogs)
      .catch(() => console.log("API not connected"));

    getWalker()
      .then(setWalkers)
      .catch(() => console.log("API not connected"));
  }, []);

  const handleDogClick = (dog) => {
    const walker = walkers.find((w) => w.dogId === dog.id);
    const walkerName = walker ? walker.name : "No walker assigned";
    setSelectedDog({ ...dog, walkerName });
  };

  const handleRemoveDog = (dogId) => {
    if (confirm("Are you sure you want to remove this dog?")) {
      deleteDog(dogId)
        .then(() => {
          setDogs((prevDogs) => prevDogs.filter((dog) => dog.id !== dogId));
          setSelectedDog(null); // Deseleccionar el perro si está en los detalles
        })
        .catch((error) => {
          console.error("Failed to delete dog:", error);
          alert("Failed to delete dog. Please try again.");
        });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Enviar el nuevo perro al backend
    addDog(newDog)
      .then((addedDog) => {
        // Actualizar la lista de perros con el nuevo perro
        setDogs((prevDogs) => [...prevDogs, addedDog]);
        setShowForm(false); // Ocultar el formulario tras agregar
        setNewDog({ name: "" }); // Limpiar el formulario

        // Mostrar automáticamente los detalles del nuevo perro
        handleDogClick(addedDog);
      })
      .catch((error) => {
        console.error("Error al agregar perro:", error);
      });
  };

  return (
    <div>
      <p>{greeting.message}</p>
      <h3>Dogs List</h3>
      <ul>
        {dogs.map((dog) => (
          <li key={dog.id}>
            <span onClick={() => handleDogClick(dog)}>{dog.name}</span>
            <button onClick={() => handleRemoveDog(dog.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Dog"}
      </button>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="add-dog-form">
          <h4>Add a New Dog</h4>
          <label>
            Dog Name:
            <input
              type="text"
              value={newDog.name}
              onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}

      {selectedDog && (
        <div className="walkerDog">
          <h4>Dog Details</h4>
          <p>
            <strong>Dog Name:</strong> {selectedDog.name}
          </p>
          <p>
            <strong>Walker:</strong> {selectedDog.walkerName}
          </p>
        </div>
      )}
    </div>
  );
}
