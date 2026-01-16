import {defineField, defineType} from 'sanity'
import { customerIdField } from './fields/customerId'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    // Multi-tenant customer ID
    customerIdField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Contact Page Content',
      hidden: true, // For internal CMS use only
    }),
    defineField({
      name: 'piName',
      title: 'Principal Investigator Name',
      type: 'string',
      description: 'e.g., Ioannis Rutherford, Ph.D.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.email().required(),
    }),
    defineField({
      name: 'labAddress',
      title: 'Lab Address',
      type: 'text',
      description: 'The physical address of the lab, including line breaks.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'googleMapsLink',
      title: 'Google Maps Link',
      type: 'url',
      description: 'The URL for the "View on Google Maps" button.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'Google Maps Embed URL',
      type: 'url',
      description: 'From Google Maps, click Share > Embed a map > Copy HTML. Paste the src URL here.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'guidanceText',
      title: 'Guidance for Applicants',
      description: 'The section with information for prospective students and collaborators.',
      type: 'blockContent', // Reusing our rich text editor
    }),
  ],
})

