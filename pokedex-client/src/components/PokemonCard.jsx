// components/PokemonCard.jsx
import React from 'react'; // useEffect ve axios'a artık gerek yok!

// Gelen 'pokemon' prop'u artık detayların TA KENDİSİ.
export default function PokemonCard({ pokemon }) {
  // Veri zaten dışarıdan dolu geldiği için 'loading' durumuna da gerek kalmadı.
  // Direk verileri ekrana basıyoruz.

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Pokemon ID Numarası */}
      <span className="text-gray-400 text-sm font-bold w-full text-right">
        #{pokemon.id.toString().padStart(3, '0')}
      </span>

      {/* Resim */}
      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        className="w-32 h-32 object-contain mb-4 drop-shadow-lg"
      />
      
      <h2 className="text-xl font-semibold capitalize text-gray-800 mb-3">
        {pokemon.name}
      </h2>

      {/* Pokemon Türleri */}
      <div className="flex gap-2">
        {pokemon.types.map((typeInfo, index) => (
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