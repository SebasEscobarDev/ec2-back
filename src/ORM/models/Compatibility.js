import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/connection.js'

class Compatibility extends Model { }
Compatibility.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    perfil_user_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    score: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'Compatibility',
    tableName: 'Compatibilidades',
    underscored: true,
    timestamps: false
})

export default Compatibility
