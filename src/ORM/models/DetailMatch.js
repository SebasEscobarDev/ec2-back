import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'

// import Match from './Matches.js'

class DetailMatch extends Model {}
DetailMatch.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  detalle: DataTypes.TEXT,
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'DetailMatch',
  tableName: 'DetalleMatches',
  underscored: true,
  timestamps: false
})

// DetailMatch.hasOne(Match)

export default DetailMatch
