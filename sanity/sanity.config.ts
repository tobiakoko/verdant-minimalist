import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes/index'
import {myStructure} from './deskStructure'
import {publicationImporter} from './plugins'

export default defineConfig({
  name: 'default',
  title: 'Lab Website Template Demo',
  basePath: '/studio', // This is important for the embedded studio

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4yfodkib',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({structure: myStructure}),
    visionTool(),
    publicationImporter(),
  ],

  schema: {
    types: schemaTypes,
  },
})
