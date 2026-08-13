import { DataTypes } from 'sequelize'
import banco from '../config/database.js'

const Curtida = banco.define('Curtida', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'post_id'
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'usuario_id'
  }
}, {
  tableName: 'curtidas',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['post_id', 'usuario_id']
    }
  ]
})

export default Curtida
