import { DataTypes } from 'sequelize'
import banco from '../config/database.js'

const Post = banco.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'usuario_id'
  }
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: false
})

export default Post
