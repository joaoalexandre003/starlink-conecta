import { DataTypes } from 'sequelize'
import banco from '../config/database.js'

const Vaga = banco.define('Vaga', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dataLimite: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_limite'
  }
}, {
  tableName: 'vagas',
  timestamps: false
})

export default Vaga
