import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'
import Match from './Match.js'
import Compatibility from './Compatibility.js'

// import Mensaje from './Mensaje.js'

class User extends Model { }
User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 255]
    }
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
  nacimiento_ciudad: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genero_mostrar: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  genero_identifica: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  genero_interes: {
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
  enfermedad_ojos: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo_luz: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lugar_toma_foto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rango_edad: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  app: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  creado_el: DataTypes.STRING,
  actualizado_el: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Usuarios',
  underscored: true,
  timestamps: false
})

User.hasMany(Match, { as: 'matches', foreignKey: 'match_user_id' })
Match.belongsTo(User, { as: 'user', foreignKey: 'user_id' })

User.hasMany(Compatibility, { as: 'compatibilities', foreignKey: 'perfil_user_id' })
Compatibility.belongsTo(User, { as: 'user', foreignKey: 'user_id' })


export default User
