# prisma-drizzle-lnl (WIP)

Prisma &amp; Drizzle lunch &amp; learn

## What's included

### Global (for both Prisma & Drizzle)

- Docker compose with mysql database
- [Bruno](https://www.usebruno.com/) schema for the API #TODO
- Table User, UserInfo, Role & Permission (all types of relationships)
- Automatically omit password field from User
- Logger to log time spent on each request
- Exception filter with custom error response
- Custom decorators for validation with [valibot](https://valibot.dev/) schemas
- Inherit types from schemas
- Seeder to seed the database with data
- Migrations
- CRUD operations
- Transactions `findAll()`
- Raw query `findAllWithMaturity()`
- Cte query `findAllWithPermissionsCount()`
- Exclude fields from response `findOne()`
- Add fields to response `findOne()`

### Prisma

- Hard to do stuffs outside of the "basic" workflow (need to use raw queries)
- Auto logging of Prisma queries
- Satifies schemas types with Prisma types
- Generic search in `findAll()` with schemas validation `PrismaSearchQuerySchema`
  - Includes pagination
  - Includes sorting (keys are not validated)
  - Includes search (not validated JSON string, follow prisma where clause and must be encoded)

### Drizzle

- Migrations are not the best, clearly designed for `push` workflow (for exemple, if a migration fails midway, you need to manually revert and apply the migrations)
- Auto logging of Drizzle queries

## Prisma specific

- `npx prisma studio` will open the studio to see the data in the database
- `npx prisma format` will format the schema file
- `npx prisma generate` will generate the client in `node_modules/@prisma/client` and can be imported in the code for type safety
- `npx prisma db seed` will seed the database with the data in the seed file specified in package.json
- `npx prisma migrate dev` will create a migration and apply it to the database, you pass the `--name` flag to give a name to the migration (or it will be prompted). Will also generate the client
- `npx prisma migrate deploy` will apply the migration to the database without creating a migration file (qa, staging, production)
- `npx prisma migrate reset` will reset the database and apply all migrations and seed data
- `npx prisma db push` will apply the schema to the database without migration, useful for prototyping locally before using migrations [docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema)
- How to do down migrations [docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/generating-down-migrations)
- Lots of community generators [here](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#community-generators)

## Drizzle specific

- `npx drizzle-kit studio` will open the studio to see the data in the database
- No build-in seed command, use .ts file to seed the database (`npm run drizzle:seed` in this project)
- `npx drizzle-kit generate` will generate migrations based on the schema file
- `npx drizzle-kit migrate` will apply the migrations to the database
- `npx drizzle-kit drop` will drop the selected migration (CLI prompt to select)
- `npx drizzle-kit push` will apply the schema to the database without migration, useful for prototyping locally before using migrations
- There is not reset command
- There is no down migrations but it is in the [work](https://github.com/drizzle-team/drizzle-orm/issues/2352)
- Drizzle has a config file `drizzle.config.ts`, [ref](https://orm.drizzle.team/kit-docs/config-reference)

## Lunch & Learn Agenda

- Swagger does not works with types, so it's not included in this project. You can always create models manually or use a generator to create models from the types/schema
- See exceptions/logs
- See validations
- See studio
- See seeding
- See schemas differences
- See queries differences (transactions, raw queries, pagination, relations, etc)
- See generic search (Prisma not made for this, better to use typesafe query builder)

## How to run locally

- `npm i` to install dependencies
- `docker-compose up` to start the database
- `npm run prisma:generate` to generate the Prisma client
- `npm run prisma:migrate-deploy` to apply the migrations
- `npm run prisma:seed` to seed the database
- `npm run drizzle:generate` to generate the Drizzle migrations
- `npm run drizzle:migrate` to apply the Drizzle migrations
- `npm run dev` to start the server

You can import the bruno file to have api endpoints
