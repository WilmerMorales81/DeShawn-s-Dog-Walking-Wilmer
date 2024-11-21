export const getGreeting = async () => {
  const res = await fetch("/api/hello");
  return res.json();
};

export const getDog = async () => {
  const res = await fetch("/api/dogs");
  const data = await res.json();
  return data;
};

export const getWalker = async () => {
  const res = await fetch("/api/walkers");
  const data = await res.json();
  return data;
};

export const addDog = async (dog) => {
  const newDog = {
    name: dog.name, // Asegúrate de que 'dog' tenga esta propiedad
    cityId: dog.cityId, // Incluye la ciudad si es necesaria
  };

  const res = await fetch("/api/dogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDog),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add dog");
  }

  return res.json();
};

export const deleteDog = async (dogId) => {
  const res = await fetch(`/api/dogs/${dogId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to delete dog");
  }

  return res.json(); // Si el backend retorna una respuesta
};

export const getWalkers = async () => {
  const res = await fetch("/api/walkers");
  return res.json();
};

export const getCity = async () => {
  const res = await fetch("/api/cities");
  return res.json();
};

export const assignDogToWalker = async (walkerId, dogId) => {
  const res = await fetch(`/api/walkers/${walkerId}/assignDog/${dogId}`, {
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};

export const addCity = async (city) => {
  const newCity = {
    name: city.name,
  };

  const res = await fetch("/api/cities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCity),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add city");
  }

  return res.json();
};

export const updateWalkerCities = async (walkerId, cityIds) => {
  const res = await fetch(`/api/walkers/${walkerId}/cities`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cityIds),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to update walker cities");
  }

  return res.json();
};

export const deleteWalker = async (walkerId) => {
  const res = await fetch(`/api/walkers/${walkerId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to delete walker");
  }

  return res.text(); // Retorna el mensaje de éxito
};

