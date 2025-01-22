import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import "./App.css";

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
        const promises = response.data.results.map(async (pokemon) => {
          const pokemonDetails = await axios.get(pokemon.url);
          return {
            id: pokemonDetails.data.id,
            name: pokemonDetails.data.name,
            image: pokemonDetails.data.sprites.front_default,
          };
        });
        const results = await Promise.all(promises);
        setPokemonData(results);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };
    fetchPokemon();
  }, []);

  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Pokémon Cards</h1>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <div className="card-container">
        {filteredPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default App;
