import React from 'react';
import Title from '../components/title';
import { MapPin, Car, Building2 } from 'lucide-react';

const PourquoiPostuler = () => {
  return (
    <section
      className="pt-32 pb-16 px-6 text-white relative"
      style={{
        backgroundColor: '#094363',
        clipPath: 'polygon(0 8%, 100% 0%, 100% 100%, 0% 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <Title title="Pourquoi postuler chez nous ?" 
         textColor="#FFFFFF" 
         barColor="#FFFFFF" />
         
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 - Proximité */}
          <div className="group cursor-pointer">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full border border-white/20 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-400/20 mb-6 group-hover:bg-green-400 transition-all duration-300">
                  <MapPin className="w-8 h-8 text-green-400 group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-800 transition-all duration-300">
                  Proximité
                </h3>
                <p className="text-white/90 group-hover:text-gray-600 transition-all duration-300 leading-relaxed">
                  Nos missions sont réparties sur l'ensemble du territoire, proches de chez vous.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 - Processus simple */}
          <div className="group cursor-pointer">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full border border-white/20 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-400/20 mb-6 group-hover:bg-green-400 transition-all duration-300">
                  <Car className="w-8 h-8 text-green-400 group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-800 transition-all duration-300">
                  Processus simple
                </h3>
                <p className="text-white/90 group-hover:text-gray-600 transition-all duration-300 leading-relaxed">
                  Candidature rapide, suivi transparent, réponses claires et délai court de traitement.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 - Ambiance */}
          <div className="group cursor-pointer">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full border border-white/20 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-400/20 mb-6 group-hover:bg-green-400 transition-all duration-300">
                  <Building2 className="w-8 h-8 text-green-400 group-hover:text-white transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-800 transition-all duration-300">
                  Ambiance pro & humaine
                </h3>
                <p className="text-white/90 group-hover:text-gray-600 transition-all duration-300 leading-relaxed">
                  Rejoignez un environnement où la bienveillance est au cœur de chaque collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PourquoiPostuler;