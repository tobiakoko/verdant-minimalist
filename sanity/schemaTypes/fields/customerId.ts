import { defineField } from 'sanity'

/**
 * Reusable customerId field for multi-tenant support
 * This field is hidden from users and set automatically via the Sanity studio config
 */
export const customerIdField = defineField({
  name: 'customerId',
  title: 'Customer ID',
  type: 'string',
  description: 'Identifier for multi-tenant filtering (auto-set, do not modify)',
  hidden: true,
  readOnly: true,
})
