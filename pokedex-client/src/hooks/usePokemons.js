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
    // 1. Controller'ı oluşturuyoruz
    const controller = new AbortController();

    const fetchPokemons = async () => {
      setLoading(true);
      setError(false);
      try {
        if (searchQuery) {
          // 2. Axios'a "Eğer bu sinyal abort edilirse, isteği anında kes" diyoruz
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`,
            { signal: controller.signal } 
          );
          setPokemons([response.data]);
          setNextUrl(null);
          setPrevUrl(null);
        } else {
          const response = await axios.get(currentUrl, { signal: controller.signal });
          setNextUrl(response.data.next);
          setPrevUrl(response.data.previous);

          const detailedPokemons = await Promise.all(
            response.data.results.map(async (pokemon) => {
              // Promise.all içindeki iç isteklere de sinyali vermeliyiz!
              const res = await axios.get(pokemon.url, { signal: controller.signal });
              return res.data;
            })
          );
          
          setPokemons(detailedPokemons);
        }
      } catch (err) {
        // 3. Hata Yönetimi: İstek BİZİM tarafımızdan mı iptal edildi, yoksa gerçekten hata mı var?
        if (axios.isCancel(err)) {
          console.log("Önceki istek başarıyla iptal edildi, yarış durumu engellendi!");
        } else {
          console.error("Veri çekilirken hata:", err.message);
          setError(true);
          setPokemons([]);
        }
      } finally {
        // Loading'i kapatıyoruz.
        setLoading(false);
      }
    };

    fetchPokemons();

    // 4. CLEANUP: Bu useEffect yeniden çalışmadan hemen önce (veya bileşen ekrandan silinmeden önce) çalışır.
    // Eğer hala havada uçan bir API isteği varsa, onu vurup düşürür!
    return () => {
      controller.abort();
    };
  }, [currentUrl, searchQuery]);

  return { pokemons, loading, error, nextUrl, prevUrl };
};