import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'
// import Match from './Match.js'

// import Mensaje from './Mensaje.js'

class Notify extends Model { }
Notify.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  from_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Notify',
  tableName: 'Notificaciones',
  underscored: true,
  timestamps: false
})

// User.hasMany(Match, { as: 'matches', foreignKey: 'user_id', otherKey: 'match_user_id' })
// Match.belongsTo(User, { as: 'user', foreignKey: 'user_id' })

export default Notify
