'use strict'

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('users', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'varchar(1000)',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
}

exports.down = () => {}
