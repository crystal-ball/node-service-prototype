exports.shorthands = undefined

exports.up = pgm => {
  pgm.createExtension('uuid-ossp', { ifNotExists: true })
  pgm.createTable('accounts', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    // TODO: figure out how to lowercase email to ensure uniqueness constraint
    // in schema
    email: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    // Password must be the hashed password, never the actual password
    password: {
      type: 'text',
      notNull: true,
    },
    // Account display name
    name: {
      type: 'varchar(80)',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
}

exports.down = pgm => {}
