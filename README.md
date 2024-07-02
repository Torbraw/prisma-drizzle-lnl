# prisma-drizzle-lnl

Prisma &amp; Drizzle lunch &amp; learn

## List

- Plain SQL queries
- Transactions
- Pagination
- Swagger
- Return only specific fields, retreive fields but not return them

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
