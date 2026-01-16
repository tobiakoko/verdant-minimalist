import {defineField, defineType} from 'sanity'
import { customerIdField } from './fields/customerId'

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    // Multi-tenant customer ID
    customerIdField,
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Position',
      type: 'string',
      description: 'E.g., Principal Investigator, PhD Candidate, Postdoc',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Allows for better image cropping in the studio
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Principal Investigator', value: 'PI'},
          {title: 'Current Member', value: 'Current'},
          {title: 'Past Member (Alumni)', value: 'Past'},
        ],
        layout: 'radio', // Makes it a radio button selector
      },
      initialValue: 'Current',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'currentPosition',
      title: 'Current Position (for Alumni)',
      type: 'string',
      description: 'E.g., Assistant Professor, Stanford University',
      // This field will only show up if the status is 'Past'
      hidden: ({document}) => document?.status !== 'Past',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
