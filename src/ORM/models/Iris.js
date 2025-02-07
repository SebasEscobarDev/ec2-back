import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'

class Iris extends Model { }
Iris.init({
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  racional: DataTypes.TEXT,
  emocional: DataTypes.TEXT,
  mental: DataTypes.TEXT,
  amar: DataTypes.TEXT,
  autoconocimiento: DataTypes.TEXT,
  espiritual: DataTypes.TEXT,
  responsabilidad: DataTypes.TEXT,
  autonomia: DataTypes.TEXT,
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Iris',
  tableName: 'irises',
  underscored: true,
  timestamps: false
})

export default Iris
