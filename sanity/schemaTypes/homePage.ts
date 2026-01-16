import { defineField, defineType } from 'sanity'
import { customerIdField } from './fields/customerId'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'research', title: 'Research Areas' },
    { name: 'stats', title: 'Statistics' },
  ],
  fields: [
    // Multi-tenant customer ID
    customerIdField,
    // Internal title for CMS organization
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Home Page Content',
      hidden: true,
    }),

    // --- Hero Section ---
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Small text above the main heading (e.g., "#1 Research Lab in the Field")',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Main heading text (e.g., "Empowering innovation with the knowledge of")',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroHeadingAccent',
      title: 'Hero Heading Accent Word',
      type: 'string',
      description: 'The highlighted word in the heading (e.g., "Matter")',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'Supporting text below the main heading',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Button Text',
      type: 'string',
      description: 'Text for the primary call-to-action button',
      initialValue: 'Explore Our Work',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaLink',
      title: 'Hero CTA Button Link',
      type: 'string',
      description: 'Link for the primary CTA (e.g., "/research")',
      initialValue: '/research',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Main image for the hero section',
      group: 'hero',
    }),

    // --- Research Areas ---
    defineField({
      name: 'researchAreasTitle',
      title: 'Research Areas Section Title',
      type: 'string',
      initialValue: 'Research Focus Areas',
      group: 'research',
    }),
    defineField({
      name: 'researchAreas',
      title: 'Research Areas',
      type: 'array',
      group: 'research',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon key: microscope, atom, dna, brain, flask, chart',
              options: {
                list: [
                  { title: 'Microscope', value: 'microscope' },
                  { title: 'Atom', value: 'atom' },
                  { title: 'DNA', value: 'dna' },
                  { title: 'Brain', value: 'brain' },
                  { title: 'Flask', value: 'flask' },
                  { title: 'Chart', value: 'chart' },
                ],
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // --- Statistics ---
    defineField({
      name: 'statsEnabled',
      title: 'Show Statistics Section',
      type: 'boolean',
      initialValue: true,
      group: 'stats',
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The number or value to display (e.g., "150+", "$12M")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Description of the stat (e.g., "Publications")',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'value',
              subtitle: 'label',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    select: {
      title: 'heroHeading',
      media: 'heroImage',
    },
    prepare({ title, media }) {
      return {
        title: 'Home Page',
        subtitle: title,
        media,
      }
    },
  },
})
