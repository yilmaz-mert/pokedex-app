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
          // ARAMA DURUMU: Zaten tüm detaylar tek istekte geliyor
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
          setPokemons([response.data]); // Sadece isim/url değil, tüm veriyi dizi içinde kaydediyoruz
          setNextUrl(null);
          setPrevUrl(null);
        } else {
          // LİSTE DURUMU: 20'lik listeyi çekiyoruz
          const response = await axios.get(currentUrl);
          setNextUrl(response.data.next);
          setPrevUrl(response.data.previous);

          // N+1 ÇÖZÜMÜ: Gelen 20 linke paralel (aynı anda) istek atıyoruz
          const detailedPokemons = await Promise.all(
            response.data.results.map(async (pokemon) => {
              const res = await axios.get(pokemon.url);
              return res.data; // Her bir pokemonun tüm detayları
            })
          );
          
          setPokemons(detailedPokemons); // Detaylı listeyi state'e kaydediyoruz
        }
      } catch (err) {
        console.error("Veri çekilirken hata:", err.message);
        setError(true);
        setPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [currentUrl, searchQuery]);

  return { pokemons, loading, error, nextUrl, prevUrl };
};