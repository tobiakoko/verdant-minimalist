import {defineField, defineType} from 'sanity'
import { customerIdField } from './fields/customerId'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    // Multi-tenant customer ID
    customerIdField,
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // This allows for better cropping
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption / Description',
      type: 'string',
      description: 'A short description of the picture (e.g., "Lab retreat, Fall 2025").',
    }),
    defineField({
      name: 'altText',
      title: 'Alternative Text',
      type: 'string',
      description: 'A descriptive text for screen readers. Important for accessibility.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Date Created, Newest',
      name: 'dateCreatedDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
