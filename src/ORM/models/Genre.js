import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'

class Genre extends Model { }
Genre.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  genero_es: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genero_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genero_pt: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Genre',
  tableName: 'Generos',
  underscored: true,
  timestamps: false
})

export default Genre
