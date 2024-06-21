import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'
// import Match from './Match.js'
// import Mensaje from './Mensaje.js'

class Couple extends Model { }
Couple.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nacimiento_hora: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  nacimiento_dia: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nacimiento_mes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nacimiento_ano: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  genero_identifica: {
    type: DataTypes.STRING,
    allowNull: true
  },
  foto: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  acerca: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Couple',
  tableName: 'Parejas',
  underscored: true,
  timestamps: false
})

// User.hasMany(Match, { as: 'matches', foreignKey: 'user_id', otherKey: 'match_user_id' })
// Match.belongsTo(User, { as: 'user', foreignKey: 'user_id' })

export default Couple
