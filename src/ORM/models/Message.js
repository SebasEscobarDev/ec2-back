import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'

class Message extends Model { }
Message.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  from_user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  to_user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  message: DataTypes.TEXT,
  like: DataTypes.BOOLEAN,
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'mensajes',
  underscored: true,
  timestamps: false
})

export default Message
