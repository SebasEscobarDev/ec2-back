'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('generos', [
      { genero_es: 'Hombre', genero_en: 'Man', genero_pt: 'Homem' },
      { genero_es: 'Mujer', genero_en: 'Woman', genero_pt: 'Mulher' },
      { genero_es: 'Hombre Transgénero', genero_en: 'Man transgender', genero_pt: 'Homem Transgênero' },
      { genero_es: 'Mujer Transgénero', genero_en: 'Woman transgender', genero_pt: 'Mulher Transgênero' },
      { genero_es: 'Travesti', genero_en: 'Travesti', genero_pt: 'Travesti' },
      { genero_es: 'No-Binario', genero_en: 'Non-Binary', genero_pt: 'Não Binário' },
      { genero_es: 'Andrógino', genero_en: 'Androgynous', genero_pt: 'Andrógino' },
      { genero_es: 'Género Neutro', genero_en: 'Neutral Gender', genero_pt: 'Gênero Neutro' },
      { genero_es: 'Queer', genero_en: 'Queer', genero_pt: 'Queer' },
      { genero_es: 'No Conforme', genero_en: 'Non-Conforming', genero_pt: 'Não Conforme' },
      { genero_es: 'Género Variante', genero_en: 'Gener Variant', genero_pt: 'Variante de Gênero' },
      { genero_es: 'Agénero', genero_en: 'Agender', genero_pt: 'Agênero' },
      { genero_es: 'Género Cuestionado', genero_en: 'Questioned', genero_pt: 'Questionado' },
      { genero_es: 'Biogénero', genero_en: 'Biogender', genero_pt: 'Biogênero' },
      { genero_es: 'Género Fluido', genero_en: 'Fluid Gender', genero_pt: 'Gênero Fluido' },
      { genero_es: 'Pangénero', genero_en: 'Pangender', genero_pt: 'Pangênero' },
      { genero_es: 'Otros', genero_en: 'Others', genero_pt: 'Outros' }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('generos', null, {});
  }
};
