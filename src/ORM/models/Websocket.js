import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'

class Websocket extends Model { }
Websocket.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
  },
  socket_id: {
    type: DataTypes.STRING,
  },
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Websocket',
  tableName: 'websockets',
  underscored: true,
  timestamps: false
})

export default Websocket
