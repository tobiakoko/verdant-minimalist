import publication from './publication'
import person from './person'
import blockContent from './blockContent'
import newsArticle from './newsArticle'
import researchPage from './researchPage'
import bookPage from './bookPage'
import contactPage from './contactPage'
import galleryImage from './galleryImage'
import siteSettings from './siteSettings'
import homePage from './homePage'
import legalPage from './legalPage'

export const schemaTypes = [
  // Singleton Pages
  siteSettings,
  homePage,
  researchPage,
  bookPage,
  contactPage,

  // Document Collections
  publication,
  person,
  newsArticle,
  galleryImage,
  legalPage,

  // Content Types
  blockContent,
]
