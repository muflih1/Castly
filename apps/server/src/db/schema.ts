import { boolean, inet, integer, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core"
import KSUID from "ksuid"

const ksuid = () => KSUID.randomSync().toJSON()

const KSUID_LENGTH = 26

export const usersTable = pgTable("users", {
  id: varchar({ length: KSUID_LENGTH }).primaryKey().$default(() => ksuid()),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar('password_digest', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export const externalAccountsTable = pgTable('external_accounts', {
  id: varchar({ length: KSUID_LENGTH }).primaryKey().$default(() => ksuid()),
  provider: varchar({ length: 30 }).notNull(),
  providerUserId: varchar('provider_user_id', { length: 255 }),
  userId: varchar('user_id', { length: KSUID_LENGTH }).notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  approvedScope: text('approved_scope'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export const sessionsTable = pgTable('sessions', {
  id: varchar({ length: KSUID_LENGTH }).primaryKey().$default(() => ksuid()),
  userId: varchar('user_id', { length: KSUID_LENGTH }).notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  actorId: varchar('actor_id', { length: KSUID_LENGTH }).references(() => usersTable.id, { onDelete: 'cascade' }),
  userAgent: varchar('user_agent', { length: 255 }),
  ipAddress: inet('ip_address'),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true })
    .notNull()
    .$default(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export const tagsTable = pgTable('tags', {
  id: varchar({ length: KSUID_LENGTH }).primaryKey().$default(() => ksuid()),
  name: varchar({ length: 50 }).notNull().unique(),
  description: text(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export const channelsTable = pgTable('channels', {
  id: varchar({ length: KSUID_LENGTH }).primaryKey().$default(() => ksuid()),
  userId: varchar('user_id', { length: KSUID_LENGTH }).notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  displayName: varchar('display_name', { length: 50 }).notNull(),
  handle: varchar({ length: 30 }).notNull().unique(),
  description: varchar({ length: 1000 }),
  pictureKey: varchar('picture_key', { length: 510 }),
  bannerImageKey: varchar('banner_image_key', { length: 510 }),
  businessEmail: varchar('business_email', { length: 255 }),
  streamKey: varchar('stream_key', { length: 128 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export const channelLinks = pgTable('channel_links', {
  id: varchar({ length: KSUID_LENGTH }).primaryKey().$default(() => ksuid()),
  channelId: varchar('channel_id', { length: KSUID_LENGTH })
    .notNull()
    .references(() => channelsTable.id, { onDelete: 'cascade' }),
  title: varchar({ length: 30 }).notNull(),
  url: varchar({ length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export const gamesTable = pgTable('games', {
  id: varchar({ length: KSUID_LENGTH }).primaryKey().$default(() => ksuid()),
  name: varchar({ length: 100 }),
  description: text(),
  coverImage: varchar('cover_image', { length: 255 }),
  profilePicture: varchar('profile_picture', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export const gameTagsTable = pgTable('game_tags', {
  gameId: varchar('game_id', { length: KSUID_LENGTH }).notNull().references(() => gamesTable.id, { onDelete: 'cascade' }),
  tagId: varchar('tag_id', { length: KSUID_LENGTH }).notNull().references(() => tagsTable.id, { onDelete: 'cascade' })
}, t => [primaryKey({ columns: [t.gameId, t.tagId] })])

export const streamSessionsTable = pgTable('stream_sessions', {
  id: varchar({ length: KSUID_LENGTH }).primaryKey().$default(() => ksuid()),
  sessionTitle: varchar('session_title', { length: 140 }).notNull(),
  channelId: varchar('channel_id', { length: KSUID_LENGTH })
    .notNull()
    .references(() => channelsTable.id, { onDelete: 'cascade' }),
  sourceKey: varchar('source_key', { length: 510 }),
  isLive: boolean('is_live').default(false).notNull(),
  gameId: varchar('game_id', { length: KSUID_LENGTH }).notNull().references(() => gamesTable.id, { onDelete: 'cascade' }),
  durationSeconds: integer('duration_seconds'),
  startTime: timestamp('start_time', { withTimezone: true }),
  endedTime: timestamp('end_time', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export const streamSessionTagsTable = pgTable('stream_session_tags', {
  streamSessionId: varchar('stream_session_id', { length: KSUID_LENGTH })
    .notNull()
    .references(() => streamSessionsTable.id, { onDelete: 'cascade' }),
  tagId: varchar('tag_id', { length: KSUID_LENGTH })
    .notNull()
    .references(() => tagsTable.id, { onDelete: 'cascade' })
}, t => [primaryKey({ columns: [t.streamSessionId, t.tagId] })])