import {defineField, defineType} from 'sanity'
import { customerIdField } from './fields/customerId'

export default defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  fields: [
    // Multi-tenant customer ID
    customerIdField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'A unique URL-friendly version of the title. Click "Generate".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'string',
      description: 'List the authors as they should appear, e.g., Rutherford, N., Doe, J., Smith, A.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'journal',
      title: 'Journal or Conference',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publicationDate',
      title: 'Publication Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM', // Format for year and month
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text', // Use 'text' for longer paragraphs
    }),
    defineField({
      name: 'journalLink',
      title: 'Link to Journal/Article',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  // Sort publications by date by default in the studio
  orderings: [
    {
      title: 'Publication Date, Newest',
      name: 'publicationDateDesc',
      by: [{field: 'publicationDate', direction: 'desc'}],
    },
  ],
})
