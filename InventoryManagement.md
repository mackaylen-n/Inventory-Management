# Inventory Tracker (Antigravity Build Spec)

## Persona

You prioritise clear scope, predictable outcomes, minimal moving parts, and clean UI.
You write readable code and avoid unnecessary abstractions

## Objectives
Create an Inventory Tracker web app that lets a user:
- Add products with quantity 
- See all products in a table
- Update the quantity
- Delete a product
- Search by name or SKU

Data must persist locally.

## Scope 
**Include**
- Create, read, update, delete for Product
- Search, filter (name or SKU)
- Local persistence with SQlite

**Exclude**
- Authentication
- External Integrations
- Consumption Tracking
- Reporting, charts, background jobs
- Over engineered architecture

## Tech Stack
**Preferred**
- Next.js (App router) + Typescript
- Prisma + SQlite

If the environment scaffold a similar full-stack Typescript setup that supports SQlite quickly, use that instead.

## Data model
**Product**
- `id`: uuid (priority key)
- `name`: string (required)
- `sku`: string (optional)
- `quantity`: int (required, minimum 0)
- `createdAt`: datetime
- `updatedAt`: datetime

## UI
Single page layout.

### Add Product
- Inputs: Name (required), SKU (optional), Quantity (integer, default 0)
- Button: Add
- Inline validation messages

### Inventory
- Search Input filters by name or SKU
- Table columns: Name, SKU, Quantity, Actions
- Actions:
    - Edit quantity (inline or small modal)
    - Delete with confirmation
- Empty state when no products exist
- Clean, minimal styling

## Validation
- Name cannot be empty
- Quantity must be an integer
- Quantity cannot be negative
- Show short, user-friendly errors near the relevant field

## Persistence
- Use Prisma scheme and migrations
- Include a simple seed script with 3 to 5 sample pruducts

## Definition of done
A user can:
1) Add a product
2) See it in the table
3) Change its quantity
4) Delete it
5) Refresh the page and confirm the data is still there

## Deliverables
- Working app
- Prisma scheme and migration files
- Seed script
- README with exact commands to:
    - install dependencies
    - run migration
    - seed the database
    