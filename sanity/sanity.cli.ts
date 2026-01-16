import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '4yfodkib', // Replace with your project's ID
    dataset: 'production'         // Or your dataset name (usually 'production')
  }

  //  deployment: {
  //   appId: 'dh8lasizq0wv8xtst4jx9v0a',
  // },
})