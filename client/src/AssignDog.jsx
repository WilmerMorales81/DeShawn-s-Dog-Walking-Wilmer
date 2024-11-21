import React, { useEffect, useState } from "react";
import { getDog, assignDogToWalker } from "./apiManager";

export default function AssignDog({ walker, onDogAssigned }) {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    getDog()
      .then((allDogs) => {
        const filteredDogs = allDogs.filter(
          (dog) => dog.cityId === walker.cityId && !dog.walker
        );
        setDogs(filteredDogs);
      })
      .catch((err) => console.error("Error fetching dogs:", err));
  }, [walker]);

  const handleDogClick = (dog) => {
    assignDogToWalker(walker.id, dog.id)
      .then((updatedDog) => {
        alert(`${dog.name} has been assigned to ${walker.name}`);
        onDogAssigned(updatedDog); 
      })
      .catch((err) => alert(`Error: ${err.message}`));
  };

  return (
    <div>
      <h3>Assign a Dog to {walker.name}</h3>
      <ul>
        {dogs.map((dog) => (
          <li key={dog.id} onClick={() => handleDogClick(dog)}>
            {dog.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
