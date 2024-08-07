# prisma-drizzle-lnl

Prisma &amp; Drizzle lunch &amp; learn

## What's included

Swagger does not works with types, so it's not included in this project. You can always create models manually or use a generator to create models from the types/schema

### Global (for both Prisma & Drizzle)

- Docker compose with mysql database
- [Bruno](https://www.usebruno.com/) schema for the API `bruno.json`
- Table User, UserInfo, Role & Permission (all types of relationships)
- Logger to log time spent on each request
- Exception filter with custom error response
- Custom decorators for validation with [valibot](https://valibot.dev/) schemas
- Inherit types from schemas
- Satifies schemas types with DB types
- Auto logging of queries
- Seeder to seed the database with data
- Migrations
- CRUD operations
- Transactions `findAll()`
- Raw query `findAllWithMaturity()`
- Cte query `findAllWithPermissionsCount()`
- Exclude fields from response `findOne()`
- Add fields to response `findOne()`
- "Cascade" delete `delete()`

### Prisma

- Automatically omit password field from User
- Generic search in `findAll()` with schemas validation `PrismaSearchQuerySchema`
  - Includes pagination
  - Includes sorting (keys are not validated)
  - Includes search (not validated JSON string, follow prisma where clause and must be encoded)

### Drizzle

- Omit password field from User
- `findAll()` only include paginations, too hard to make it work with generic search/sorting, probably feasible with a lot of work
- Both core and relational queries

## Prisma

- [Documentation](https://www.prisma.io/docs/)
- `npx prisma format` will format the schema file
- `npx prisma studio` will open the studio to see the data in the database
- `npx prisma db seed` will seed the database with the data in the seed file specified in package.json
- `npx prisma generate` will generate the client in `node_modules/@prisma/client` and can be imported in the code for type safety
- `npx prisma migrate dev` will create a migration and apply it to the database, you pass the `--name` flag to give a name to the migration (or it will be prompted). Will also generate the client
- `npx prisma migrate deploy` will apply the migration to the database without creating a migration file (qa, staging, production)
- `npx prisma migrate reset` will reset the database, apply all migrations and seed data
- `npx prisma db push` will apply the schema to the database without migration, useful for prototyping locally before using migrations [docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema)
- No automatic down migrations. How to do down migrations [docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/generating-down-migrations)

### General comments

- Lots of community generators [here](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#community-generators)
- Really mature with lots of feature/documentation, but some keys one are still mising (like cte queries)
- Hard to do stuffs outside of the "basic" workflow (need to use raw queries)
- Really easy to do simple "CRUD" operations
- Schema definition is simple but lacks "raw" sql options

## Drizzle

- [Documentation](https://orm.drizzle.team/docs/overview)
- `npx drizzle-kit studio` will open the studio to see the data in the database
- No build-in seed command, use .ts file to seed the database (`npm run drizzle:seed` in this project)
- `npx drizzle-kit generate` will generate migrations based on the schema file
- `npx drizzle-kit migrate` will apply the migrations to the database
- `npx drizzle-kit drop` will drop the selected migration (CLI prompt to select)
- `npx drizzle-kit push` will apply the schema to the database without migration, useful for prototyping locally before using migrations
- There is not reset command
- There is no down migrations but it is in the [work](https://github.com/drizzle-team/drizzle-orm/issues/2352)
- Drizzle has a config file `drizzle.config.ts` to configure some options

### General comments

- A plugin exist to create validation schemas from the database schema, but the one for valibot is not up to date [pr](https://github.com/drizzle-team/drizzle-orm/pull/2481)
- Migrations are not the best, clearly designed for `push` workflow (for exemple, if a migration fails midway, you need to manually revert and apply the migrations), update is in the [work](https://github.com/drizzle-team/drizzle-orm/discussions/2624)
- Schema definitions is verbose but similar to SQL
- Core queries (sql likes)
  - More control over the queries, but more verbose
  - Easy to do stuff outside of the "basic" workflow
  - More verbose to do "CRUD" operations
  - Typing is exceptional, but doing generic things while keeping typesafety is harder/impossible
  - They're is a way to return information from the query, but not supported in mysql
- Relationnal queries (v2 on the [way](https://github.com/drizzle-team/drizzle-orm/discussions/2316))
  - Only for querying, not for creating/updating
  - Schema relations are applications level only, not enforced by the database
  - Aggregations are not supported in 'extras' fields for now
  - No way to do CTE queries

## How to run locally

- `npm i` to install dependencies
- `docker-compose up` to start the database
- `npm run prisma:generate` to generate the Prisma client
- `npm run prisma:migrate-deploy` to apply the migrations
- `npm run prisma:seed` to seed the database
- `npm run drizzle:migrate` to apply the Drizzle migrations
- `npm run drizzle:seed` to seed the database
- `npm run dev` to start the server

You can import the bruno file to have api endpoints
