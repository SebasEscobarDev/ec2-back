import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'

class Match extends Model { }
Match.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  user_id: DataTypes.UUID,
  match_user_id: DataTypes.UUID,
  type: DataTypes.STRING(10),
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Match',
  tableName: 'Matches',
  underscored: true,
  timestamps: false
})

export default Match
