# Deployment Notes

## Required production environment variables

Set these in your hosting provider's Environment Variables panel. Do not paste secrets into public/client code.

### Database

Best option:

```env
DATABASE_URL=postgresql://postgres:<DB_PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require
```

Alternative fallback supported by the app:

```env
SUPABASE_URL=https://<PROJECT_REF>.supabase.co
SUPABASE_DB_PASSWORD=<SUPABASE_DATABASE_PASSWORD>
```

The app will automatically build the PostgreSQL URL from these fallback values.

### Supabase API keys

```env
SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SECRET_KEY=<secret-key>
SUPABASE_JWKS_URL=https://<PROJECT_REF>.supabase.co/auth/v1/.well-known/jwks.json
```

### Admin

```env
ADMIN_PASSWORD=<strong-password>
```

### Cashfree

```env
CASHFREE_APP_ID=<app-id>
CASHFREE_SECRET_KEY=<secret-key>
CASHFREE_ENV=sandbox
```

Use `CASHFREE_ENV=production` only after replacing sandbox keys with production keys.

## Common deploy failure reason

Supabase `SUPABASE_URL` is not the same as the PostgreSQL database URL. Drizzle/PostgreSQL needs a PostgreSQL connection string in `DATABASE_URL`, or this app needs `SUPABASE_URL` plus `SUPABASE_DB_PASSWORD` to build it automatically.

## Apply database schema

After environment variables are set, run:

```bash
npx drizzle-kit push
```

This creates the required tables: services, bookings, callbacks, testimonials.
