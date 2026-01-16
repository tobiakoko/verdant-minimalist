import { defineField, defineType } from 'sanity'
import { customerIdField } from './fields/customerId'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'theme', title: 'Theme & Design' },
    { name: 'seo', title: 'SEO & Social' },
    { name: 'legal', title: 'Legal Pages' },
  ],
  fields: [
    // Multi-tenant customer ID
    customerIdField,
    // --- General Settings ---
    defineField({
      name: 'labName',
      title: 'Lab Name',
      type: 'string',
      description: 'The primary name of the lab (e.g., "Rutherford")',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labNameAccent',
      title: 'Lab Name Accent',
      type: 'string',
      description: 'The second part of the name to be styled differently (e.g., "Lab")',
      group: 'general',
    }),
    defineField({
      name: 'labNameDescription',
      title: 'Lab Description',
      type: 'text',
      description: 'A brief description of the research group (shown in footer and meta)',
      group: 'general',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Copyright Text',
      type: 'string',
      description: 'Custom copyright text. Leave blank for default.',
      group: 'general',
    }),
    defineField({
      name: 'heroImage',
      title: 'Homepage Hero Image',
      type: 'image',
      description: 'The main hero image displayed on the homepage.',
      group: 'general',
      options: {
        hotspot: true,
      },
    }),

    // --- Theme Settings ---
    defineField({
      name: 'colorTheme',
      title: 'Color Theme',
      type: 'string',
      description: 'Choose a color scheme for your website. Each theme includes matching light and dark mode colors.',
      group: 'theme',
      initialValue: 'ocean',
      options: {
        list: [
          { title: '🌊 Ocean (Blue) - Professional, trustworthy', value: 'ocean' },
          { title: '🌿 Verdant (Green) - Nature-inspired, calming', value: 'verdant' },
          { title: '🌅 Sunset (Orange) - Warm, energetic', value: 'sunset' },
          { title: '💜 Violet (Purple) - Creative, innovative', value: 'violet' },
          { title: '🌸 Rose (Pink) - Modern, distinctive', value: 'rose' },
          { title: '🔷 Slate (Gray) - Neutral, corporate', value: 'slate' },
          { title: '🥉 Copper (Bronze) - Elegant, sophisticated', value: 'copper' },
          { title: '🌲 Forest (Dark Green) - Deep, scholarly', value: 'forest' },
        ],
        layout: 'dropdown',
      },
    }),

    // --- SEO Settings ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines (50-60 characters recommended)',
      group: 'seo',
      validation: (Rule) => Rule.max(60).warning('SEO titles should be under 60 characters'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Description for search engines (150-160 characters recommended)',
      group: 'seo',
      validation: (Rule) => Rule.max(160).warning('SEO descriptions should be under 160 characters'),
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords for search engines',
      group: 'seo',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'socialImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image shown when sharing on social media (1200x630px recommended)',
      group: 'seo',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter Handle',
      type: 'string',
      description: 'Twitter/X username (e.g., @labname)',
      group: 'seo',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Full LinkedIn page URL',
      group: 'seo',
    }),

    // --- Legal Pages Settings ---
    defineField({
      name: 'showPrivacyPolicy',
      title: 'Show Privacy Policy Link',
      type: 'boolean',
      description: 'Display the Privacy Policy link in the footer',
      group: 'legal',
      initialValue: true,
    }),
    defineField({
      name: 'privacyPolicyUrl',
      title: 'External Privacy Policy URL',
      type: 'url',
      description: 'Optional: Use an external URL instead of the built-in page',
      group: 'legal',
      hidden: ({ document }) => !document?.showPrivacyPolicy,
    }),
    defineField({
      name: 'showTerms',
      title: 'Show Terms & Conditions Link',
      type: 'boolean',
      description: 'Display the Terms & Conditions link in the footer',
      group: 'legal',
      initialValue: true,
    }),
    defineField({
      name: 'termsUrl',
      title: 'External Terms & Conditions URL',
      type: 'url',
      description: 'Optional: Use an external URL instead of the built-in page',
      group: 'legal',
      hidden: ({ document }) => !document?.showTerms,
    }),
  ],
  preview: {
    select: {
      title: 'labName',
      subtitle: 'labNameAccent',
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title || 'Site'} ${subtitle || ''} Settings`,
      }
    },
  },
})
