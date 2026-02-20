// hooks/usePokemons.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePokemons = (currentUrl, searchQuery) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError(false);
      try {
        if (searchQuery) {
          // Arama varsa sadece o pokemonu çek
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
          setPokemons([{ 
            name: response.data.name, 
            url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}/` 
          }]);
          setNextUrl(null);
          setPrevUrl(null);
        } else {
          // Arama yoksa mevcut sayfadaki listeyi çek
          const response = await axios.get(currentUrl);
          setNextUrl(response.data.next);
          setPrevUrl(response.data.previous);
          setPokemons(response.data.results);
        }
      } catch (err) {
        // Hata durumunu konsola yazdırmak iyi bir alışkanlıktır
        console.error("Veri çekilirken hata oluştu:", err.message);
        setError(true);
        setPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [currentUrl, searchQuery]);

  // App.jsx'in ihtiyacı olan her şeyi dışarı fırlatıyoruz
  return { pokemons, loading, error, nextUrl, prevUrl };
};