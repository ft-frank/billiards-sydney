# Sydney Billiards Finder

Find the best pool halls and billiards venues in Sydney.

## Tech Stack
- Next.js 14
- TypeScript
- Supabase
- Mapbox
- Tailwind CSS

## Features (update as you build)
- [ ] Interactive map of venues
- [ ] Venue details and pricing
- [ ] User reviews

## Running Locally
(add setup instructions as you go)

## venues table
- id (uuid, primary key, auto-generated)
- name (text) - "Crown Billiards"
- address (text) - "123 George St, Sydney"
- suburb (text) - "Sydney CBD"
- latitude (float) - -33.8688
- longitude (float) - 151.2093
- table_count (int) - 8
- hourly_rate (decimal) - 25.00
- phone (text, optional) - "02 1234 5678"
- website (text, optional) - "https://..."
- description (text) - "Classic billiards hall with..."
- amenities (text[]) - ["Bar", "Food", "Parking"]
- opening_hours (jsonb, optional) - {"mon": "10am-10pm", ...}
- created_at (timestamp)
- image_url (text) - "https://xyz.supabase.co/storage/v1/object/public/venues/crown.jpg"