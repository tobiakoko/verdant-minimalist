import { defineField, defineType } from 'sanity'

import { StructureBuilder } from 'sanity/structure'

export const myStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Our singleton "Research Page"
      S.listItem()
        .title('Research Page')
        .id('researchPage')
        .child(
          S.document()
            .schemaType('researchPage')
            .documentId('researchPageContent')
        ),

      // Our new singleton "Book Page"
      S.listItem()
        .title('Book Page')
        .id('bookPage')
        .child(
          S.document()
            .schemaType('bookPage')
            .documentId('bookPageContent') // Give it a unique, static ID
        ),

      // Our new singleton "Book Page"
      S.listItem()
        .title('Contact Page')
        .id('contactPage')
        .child(
          S.document()
            .schemaType('contactPage')
            .documentId('contactPageContent') // Give it a unique, static ID
        ),


      S.divider(),

      // The rest of our document types, filtered to exclude the singletons
      ...S.documentTypeListItems().filter(
        (listItem) => !['researchPage', 'bookPage', 'contactPage'].includes(listItem.getId() || '')
      ),
    ])



export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'labName',
      title: 'Lab Name',
      type: 'string',
      description: 'The primary name of the lab (e.g., "Rutherford Lab").'
    }),
    defineField({
      name: 'labNameAccent',
      title: 'Lab Name Accent',
      type: 'string',
      description: 'The second part of the name to be colored differently (e.g., "Lab").'
    }),
    defineField({
      name: 'labNameDescription',
      title: 'Lab Description Text',
      type: 'string',
      description: 'A brief description of the research group that shows up in the footer.'
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Copyright Text',
      type: 'string',
    }),
  ],
})