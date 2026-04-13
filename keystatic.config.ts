import { config, fields, singleton, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'gyori-andris/optika-webpage',
    branchPrefix: 'keystatic/',
  },

  ui: {
    brand: { name: 'Nádor Optika' },
  },

  // ── Singletons: one-off editable sections ─────────────────────────
  singletons: {
    settings: singleton({
      label: 'Site settings',
      path: 'src/content/settings',
      schema: {
        siteName: fields.text({ label: 'Site name' }),
        tagline: fields.text({ label: 'Tagline' }),
        phone: fields.text({ label: 'Phone number' }),
        email: fields.text({ label: 'Email address' }),
        address: fields.text({ label: 'Street address' }),
        city: fields.text({ label: 'City' }),
        googleMapsUrl: fields.url({ label: 'Google Maps URL' }),
      },
    }),

    openingHours: singleton({
      label: 'Opening hours',
      path: 'src/content/opening-hours',
      schema: {
        rows: fields.array(
          fields.object({
            days: fields.text({ label: 'Days (e.g. Hétfő–Péntek)' }),
            hours: fields.text({ label: 'Hours (e.g. 9:00–18:00)' }),
          }),
          { label: 'Opening hours', itemLabel: (props) => props.fields.days.value ?? '' },
        ),
        note: fields.text({ label: 'Note (optional, e.g. holiday closures)', multiline: true }),
      },
    }),
  },

  // ── Collections: repeatable content ───────────────────────────────
  collections: {
    pages: collection({
      label: 'Pages',
      path: 'src/content/pages/**',
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Meta description', multiline: true }),
        body: fields.markdoc({ label: 'Content' }),
      },
    }),

    services: collection({
      label: 'Services',
      path: 'src/content/services/**',
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Service name' } }),
        summary: fields.text({ label: 'Short summary', multiline: true }),
        icon: fields.text({ label: 'Icon name (from icon set)' }),
        body: fields.markdoc({ label: 'Full description' }),
        order: fields.number({ label: 'Display order' }),
      },
    }),

    teamMembers: collection({
      label: 'Team',
      path: 'src/content/team/**',
      slugField: 'name',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        role: fields.text({ label: 'Role / Title' }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        photo: fields.image({
          label: 'Photo',
          directory: 'public/images/team',
          publicPath: '/images/team/',
        }),
      },
    }),

    testimonials: collection({
      label: 'Testimonials',
      path: 'src/content/testimonials/**',
      slugField: 'author',
      schema: {
        author: fields.slug({ name: { label: 'Author name' } }),
        text: fields.text({ label: 'Testimonial text', multiline: true }),
        rating: fields.number({ label: 'Rating (1–5)' }),
      },
    }),
  },
});
