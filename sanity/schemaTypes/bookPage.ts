import {defineField, defineType} from 'sanity'
import { customerIdField } from './fields/customerId'

export default defineType({
  name: 'bookPage',
  title: 'Book Page',
  type: 'document',
  fields: [
    // Multi-tenant customer ID
    customerIdField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Book Page Content',
      hidden: true,
    }),
    defineField({
      name: 'bookTitle',
      title: 'Book Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookCover',
      title: 'Book Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amazonLink',
      title: 'Amazon Purchase Link',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cambridgeLink',
      title: 'Cambridge Press Purchase Link',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description (Frontmatter)',
      type: 'text', // Simple long-form text is sufficient here
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'bookTitle',
      media: 'bookCover',
    },
  },
})
