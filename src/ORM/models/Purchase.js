import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'

class Purchase extends Model { }
Purchase.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  valor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Purchase',
  tableName: 'compras',
  underscored: true,
  timestamps: false
})

export default Purchase
