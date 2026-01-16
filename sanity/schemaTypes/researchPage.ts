import {defineField, defineType} from 'sanity'
import { customerIdField } from './fields/customerId'

export default defineType({
  name: 'researchPage',
  title: 'Research Page',
  type: 'document',
  fields: [
    // Multi-tenant customer ID
    customerIdField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Research Page Content',
      hidden: true,
    }),
    defineField({
      name: 'pageContent',
      title: 'Page Content',
      description: 'The entire content for the Research page. Use headings (H2, H3) to structure the different sections.',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
  ],
  // REMOVED the deprecated __experimental_actions property
  preview: {
    select: {
      title: 'title',
    },
  },
})

