# prisma-drizzle-lnl

Prisma &amp; Drizzle lunch &amp; learn

## What's included

### Global (for both Prisma & Drizzle)

- Docker compose with mysql database
- Table User, UserInfo, Role & Permission (all types of relationships)
- Automatically omit password field from User
- Logger to log time spent on each request
- Exception filter with custom error response
- Custom decorators for validation with [valibot](https://valibot.dev/) schemas
- Inherit types from schemas
- Seeder to seed the database with data
- Migrations
- CRUD operations
- Raw queries `findAllWithMaturity()`
- Transactions `findAll()`
- Exclude fields from response `findOne()`
- Add fields to response `findOne()`
- Generic Pagination `findAll()` & `getPrismaArgsFromQuery()` fully typesafe
- Generic Sorting `findAll()` & `getPrismaArgsFromQuery()` almost fully typesafe

### Prisma

- Auto logging of Prisma queries<
- Satifies schemas types with Prisma types

## Prisma

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

## Drizzle

## L&L

- See validations
- See studio
- See seeding
- See schemas differences
- See queries differences (transactions, raw queries, pagination, relations, etc)

## TODO

- Filtering
- Search
- Swagger
- Drizzle
