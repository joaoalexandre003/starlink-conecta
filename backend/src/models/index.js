import Usuario from './Usuario.js'
import Post from './Post.js'
import Curtida from './Curtida.js'
import Vaga from './Vaga.js'

Usuario.hasMany(Post, {
  foreignKey: { name: 'usuarioId', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Post.belongsTo(Usuario, {
  foreignKey: { name: 'usuarioId', allowNull: false },
  as: 'autor',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

Post.hasMany(Curtida, {
  foreignKey: { name: 'postId', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Curtida.belongsTo(Post, {
  foreignKey: { name: 'postId', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

Usuario.hasMany(Curtida, {
  foreignKey: { name: 'usuarioId', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Curtida.belongsTo(Usuario, {
  foreignKey: { name: 'usuarioId', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

export { Usuario, Post, Curtida, Vaga }
