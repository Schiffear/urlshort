# Nitro App

This project is the base of a Nitro app.

## Installation

To get started, first install the dependencies:

```bash
npm install
```

Then, make sure Docker is installed on your machine. If you are on MacOS, [OrbStack](https://orbstack.dev/) is a great alternative to Docker Desktop. It's lighter, faster. Once it's installed, make sure it's running.

Check your Postgres configuration in the `compose.yaml` file. Some of the values are hardcoded, it's not relevant to configure them through environment variables,
but feel free to adapt those to your needs.

Once you're ready, you can run this command to start your Postgres database:

```bash
docker compose up -d # -d = detached mode, it frees your terminal
```

Some useful commands:

```bash
# Check the status of the containers of the current project
docker compose ps

# To stop the services
docker compose down

# To see the logs
docker compose logs -f

# To delete the containers of the current project:
docker rm -f $(docker compose ps -aq)

# To run the containers again, after you updated your compose file:
docker compose up -d --force-recreate # This forces the recreation of the containers if you maybe changed your database name
```

Now, if `.env` does not exist yet, you can create it by copying the `.env.example` file. The `.env.example` file is a template for the `.env` file, and can be safely
commited to the repository (as opposed to `.env`, don't commit this one !!). It's purpose is to provide a template for the `.env` file, so tha
the developer can easily create it and fill it.

```bash
cp .env.example .env
```

Fill the `.env` file with the correct values. The `DATABASE_URL` is the most important one, if you are using the default configuration, the value should be `postgres://postgres:postgres@localhost:5445/url-shortener`.

Generate your Github OAuth App credentials [here](https://github.com/settings/developers). You'll need to provide in your `.env` file the following values:
- `NITRO_GITHUB_CLIENT_ID`
- `NITRO_GITHUB_CLIENT_SECRET`
- `NITRO_GITHUB_REDIRECT_URI`

Those will be automatically added to your [runtime config](https://nitro.unjs.io/guide/configuration#runtime-configuration)

## Using Drizzle

Drizzle is an ORM (Object-Relational Mapping) that helps you interact with your database. It's a powerful tool that abstracts the SQL queries and allows
you to interact with your database. It helps you generate your migrations and run them, and also allows you to focus on your business logic instead of writing SQL queries.

### Migrations

To create a migration, you can run the following command:

```bash
npx drizzle-kit generate
```

This command will generate a migration file. It is not directly applied to the schema, because you should always check what it is doing before applying it.

To apply the migration, you can run the following command:

```bash
npx drizzle-kit migrate
```

### Running queries

Nothings better than reading a documentation to understand how to use a library. You can find the documentation of
Drizzle [here](https://orm.drizzle.team/docs/overview). It's a great place to start.

But let me give you some examples

```ts
import { gt } from 'drizzle-orm'

// useDrizzle is auto-imported by Nitro !
const db = useDrizzle()

// Select query

// tables is auto-imported by Nitro thanks to our utils directory !
const links = await db
    .select()
    .from(tables.links) // This uses the schema object to work with
    .where(gt(tables.links.maxVisits, 0)) // This is a condition, `gt` means "greater than". This query returns every link that expire after n visits

// You can also use the `query` feature
const links = await db.query.links.findMany({
    where: gt(tables.links.maxVisits, 0),
    // Also works like this:
    // first argument `columns` represents the columns of the table we are querying (links)
    // Second argument are the helpers, like `gt`, `eq`, etc. You can press `ctrl + space` to see the available helpers.
    // This is useful when you don't want to import those comparators from drizzle-orm
    where(columns, { gt }) {
      return gt(columns.maxVisits, 0)
    }
})

// Insert query
const newLinks = await db
    .insert()
    .into(tables.links) // We use the schema to tell in which table we want to insert the data
    .values({
        slug: 'rick-roll',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    })
    .returning() // Without this, the query will not return the inserted row ! Note that it always returns an array, because it can insert multiple rows at once

console.log(newLinks) // This is an array, if you know you are inserting only one row, you can access it with `newLinks[0]`
// You can also destructure it like this:
const [newLink] = await db.insert() /*... */ .returning()
console.log(newLink) // This is the same as newLinks[0]
```

Everything is typed, so you can use your IDE to help you with the queries. If you have any questions, feel free to ask ! If something is underlined in red, it means you probably messed up somewhere !
