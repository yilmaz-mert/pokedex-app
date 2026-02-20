import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PokemonCard({ pokemon }) {
  const [details, setDetails] = useState(null);

  // Kart ekrana basıldığında, o Pokemon'un detay URL'sine istek atıyoruz
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(pokemon.url);
        setDetails(response.data);
      } catch (error) {
        console.error("Pokemon detayları çekilemedi:", error);
      }
    };

    fetchDetails();
  }, [pokemon.url]);

  // Detaylar henüz gelmediyse kartın yerinde ufak bir yükleniyor yazısı göster
  if (!details) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 h-56 flex items-center justify-center">
        <span className="text-gray-400 animate-pulse">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Pokemon ID Numarası */}
      <span className="text-gray-400 text-sm font-bold w-full text-right">
        #{details.id.toString().padStart(3, '0')}
      </span>

      {/* Resim (Artık API'nin kendi içindeki yüksek çözünürlüklü resmi kullanıyoruz) */}
      <img
        src={details.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        className="w-32 h-32 object-contain mb-4 drop-shadow-lg"
      />
      
      <h2 className="text-xl font-semibold capitalize text-gray-800 mb-3">
        {pokemon.name}
      </h2>

      {/* Pokemon Türleri (Tipleri) - Rozet olarak listeliyoruz */}
      <div className="flex gap-2">
        {details.types.map((typeInfo, index) => (
          <span 
            key={index} 
            className="px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold rounded-full capitalize"
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}