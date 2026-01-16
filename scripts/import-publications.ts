/**
 * Prosophia Publication Import Tool
 *
 * This script imports publications into Sanity from:
 * 1. BibTeX files (exported from Google Scholar, Zotero, Mendeley, etc.)
 * 2. Semantic Scholar API (search by author name or ID)
 *
 * Usage:
 *   npx ts-node scripts/import-publications.ts --bibtex ./publications.bib
 *   npx ts-node scripts/import-publications.ts --semantic-scholar "Author Name"
 *   npx ts-node scripts/import-publications.ts --semantic-scholar-id "AUTHOR_ID"
 *
 * Prerequisites:
 *   npm install @sanity/client bibtex-parse-js slugify
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// CONFIGURATION
// =============================================================================

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN, // Needs write access
  apiVersion: '2024-01-01',
  useCdn: false,
});

// =============================================================================
// TYPES
// =============================================================================

interface ParsedPublication {
  title: string;
  authors: string;
  journal: string;
  year: string;
  month?: string;
  abstract?: string;
  doi?: string;
  url?: string;
}

interface SanityPublication {
  _type: 'publication';
  title: string;
  slug: { _type: 'slug'; current: string };
  authors: string;
  journal: string;
  publicationDate: string;
  abstract?: string;
  journalLink: string;
}

// =============================================================================
// BIBTEX PARSER
// =============================================================================

/**
 * Simple BibTeX parser
 * Handles common entry types: article, inproceedings, book, misc
 */
function parseBibTeX(bibtexContent: string): ParsedPublication[] {
  const publications: ParsedPublication[] = [];

  // Match BibTeX entries
  const entryRegex = /@(\w+)\s*\{([^,]+),([^@]*)\}/g;
  let match;

  while ((match = entryRegex.exec(bibtexContent)) !== null) {
    const entryType = match[1].toLowerCase();
    const fields = match[3];

    // Parse fields
    const fieldRegex = /(\w+)\s*=\s*[{"']?([^},"\n]+(?:\{[^}]*\})?[^},"\n]*)[}"']?/g;
    const parsedFields: Record<string, string> = {};
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(fields)) !== null) {
      const key = fieldMatch[1].toLowerCase();
      let value = fieldMatch[2].trim();

      // Clean up LaTeX formatting
      value = value
        .replace(/[{}]/g, '')
        .replace(/\\&/g, '&')
        .replace(/\\\s/g, ' ')
        .replace(/\\textit\{([^}]+)\}/g, '$1')
        .replace(/\\emph\{([^}]+)\}/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();

      parsedFields[key] = value;
    }

    // Extract publication data
    const title = parsedFields.title;
    if (!title) continue; // Skip entries without title

    const authors = parsedFields.author || parsedFields.authors || 'Unknown';
    const journal = parsedFields.journal ||
                   parsedFields.booktitle ||
                   parsedFields.publisher ||
                   parsedFields.howpublished ||
                   'Unknown';
    const year = parsedFields.year || new Date().getFullYear().toString();
    const month = parsedFields.month;
    const abstract = parsedFields.abstract;
    const doi = parsedFields.doi;
    const url = parsedFields.url || (doi ? `https://doi.org/${doi}` : undefined);

    publications.push({
      title: formatTitle(title),
      authors: formatAuthors(authors),
      journal,
      year,
      month,
      abstract,
      doi,
      url,
    });
  }

  return publications;
}

/**
 * Format title: capitalize properly, remove extra whitespace
 */
function formatTitle(title: string): string {
  return title
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Format authors: "Last, First and Last2, First2" -> "F. Last, F2. Last2"
 */
function formatAuthors(authors: string): string {
  // Split by "and"
  const authorList = authors.split(/\s+and\s+/i);

  const formatted = authorList.map(author => {
    author = author.trim();

    // Handle "Last, First" format
    if (author.includes(',')) {
      const [last, first] = author.split(',').map(s => s.trim());
      const initials = first
        .split(/\s+/)
        .map(name => name.charAt(0).toUpperCase() + '.')
        .join(' ');
      return `${initials} ${last}`;
    }

    // Handle "First Last" format
    const parts = author.split(/\s+/);
    if (parts.length >= 2) {
      const last = parts.pop();
      const initials = parts.map(name => name.charAt(0).toUpperCase() + '.').join(' ');
      return `${initials} ${last}`;
    }

    return author;
  });

  return formatted.join(', ');
}

// =============================================================================
// SEMANTIC SCHOLAR API
// =============================================================================

const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1';

interface SemanticScholarPaper {
  paperId: string;
  title: string;
  authors: Array<{ name: string }>;
  venue: string;
  year: number;
  abstract?: string;
  externalIds?: {
    DOI?: string;
  };
  url?: string;
}

/**
 * Search for an author on Semantic Scholar and get their publications
 */
async function fetchFromSemanticScholar(
  authorQuery: string,
  isAuthorId = false
): Promise<ParsedPublication[]> {
  try {
    let authorId = authorQuery;

    // If not an ID, search for the author first
    if (!isAuthorId) {
      console.log(`🔍 Searching for author: ${authorQuery}`);

      const searchResponse = await fetch(
        `${SEMANTIC_SCHOLAR_API}/author/search?query=${encodeURIComponent(authorQuery)}&limit=5`
      );

      if (!searchResponse.ok) {
        throw new Error(`Author search failed: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();

      if (!searchData.data || searchData.data.length === 0) {
        throw new Error(`No authors found matching: ${authorQuery}`);
      }

      // Show matching authors and use the first one
      console.log('\n📚 Found authors:');
      searchData.data.forEach((author: any, i: number) => {
        console.log(`  ${i + 1}. ${author.name} (ID: ${author.authorId}) - ${author.paperCount || 0} papers`);
      });

      authorId = searchData.data[0].authorId;
      console.log(`\n✅ Using: ${searchData.data[0].name}\n`);
    }

    // Fetch author's papers
    console.log(`📖 Fetching publications...`);

    const papersResponse = await fetch(
      `${SEMANTIC_SCHOLAR_API}/author/${authorId}/papers?fields=title,authors,venue,year,abstract,externalIds,url&limit=100`
    );

    if (!papersResponse.ok) {
      throw new Error(`Failed to fetch papers: ${papersResponse.statusText}`);
    }

    const papersData = await papersResponse.json();
    const papers: SemanticScholarPaper[] = papersData.data || [];

    console.log(`📄 Found ${papers.length} publications\n`);

    // Convert to our format
    return papers.map(paper => ({
      title: paper.title,
      authors: paper.authors.map(a => a.name).join(', '),
      journal: paper.venue || 'Unknown',
      year: paper.year?.toString() || new Date().getFullYear().toString(),
      abstract: paper.abstract,
      doi: paper.externalIds?.DOI,
      url: paper.externalIds?.DOI
        ? `https://doi.org/${paper.externalIds.DOI}`
        : paper.url,
    }));

  } catch (error) {
    console.error('❌ Semantic Scholar API error:', error);
    throw error;
  }
}

// =============================================================================
// SANITY IMPORT
// =============================================================================

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 96);
}

/**
 * Convert month name/number to padded number
 */
function parseMonth(month?: string): string {
  if (!month) return '01';

  const monthMap: Record<string, string> = {
    jan: '01', january: '01', '1': '01',
    feb: '02', february: '02', '2': '02',
    mar: '03', march: '03', '3': '03',
    apr: '04', april: '04', '4': '04',
    may: '05', '5': '05',
    jun: '06', june: '06', '6': '06',
    jul: '07', july: '07', '7': '07',
    aug: '08', august: '08', '8': '08',
    sep: '09', september: '09', '9': '09',
    oct: '10', october: '10', '10': '10',
    nov: '11', november: '11', '11': '11',
    dec: '12', december: '12', '12': '12',
  };

  const normalized = month.toLowerCase().trim();
  return monthMap[normalized] || '01';
}

/**
 * Convert parsed publication to Sanity document
 */
function toSanityDocument(pub: ParsedPublication): SanityPublication {
  const monthNum = parseMonth(pub.month);

  return {
    _type: 'publication',
    title: pub.title,
    slug: {
      _type: 'slug',
      current: generateSlug(pub.title),
    },
    authors: pub.authors,
    journal: pub.journal,
    publicationDate: `${pub.year}-${monthNum}`,
    abstract: pub.abstract,
    journalLink: pub.url || pub.doi
      ? `https://doi.org/${pub.doi}`
      : `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`,
  };
}

/**
 * Check if publication already exists in Sanity
 */
async function publicationExists(title: string): Promise<boolean> {
  const query = `count(*[_type == "publication" && title == $title]) > 0`;
  return sanityClient.fetch(query, { title });
}

/**
 * Import publications to Sanity
 */
async function importToSanity(
  publications: ParsedPublication[],
  dryRun = false
): Promise<{ imported: number; skipped: number; errors: number }> {
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n📤 ${dryRun ? '[DRY RUN] ' : ''}Importing ${publications.length} publications to Sanity...\n`);

  for (const pub of publications) {
    try {
      // Check for duplicates
      const exists = await publicationExists(pub.title);

      if (exists) {
        console.log(`⏭️  Skipping (exists): ${pub.title.substring(0, 60)}...`);
        skipped++;
        continue;
      }

      const doc = toSanityDocument(pub);

      if (dryRun) {
        console.log(`📝 Would import: ${pub.title.substring(0, 60)}...`);
        imported++;
      } else {
        await sanityClient.create(doc);
        console.log(`✅ Imported: ${pub.title.substring(0, 60)}...`);
        imported++;
      }

      // Rate limiting - be nice to the API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error importing "${pub.title}":`, error);
      errors++;
    }
  }

  return { imported, skipped, errors };
}

// =============================================================================
// CLI
// =============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(1);
  }

  let publications: ParsedPublication[] = [];
  let dryRun = args.includes('--dry-run');

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    if (arg === '--bibtex' && nextArg) {
      const filePath = path.resolve(nextArg);

      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
      }

      console.log(`📄 Reading BibTeX file: ${filePath}\n`);
      const content = fs.readFileSync(filePath, 'utf-8');
      publications = parseBibTeX(content);
      console.log(`📚 Parsed ${publications.length} publications\n`);
      i++;
    }

    if (arg === '--semantic-scholar' && nextArg) {
      publications = await fetchFromSemanticScholar(nextArg, false);
      i++;
    }

    if (arg === '--semantic-scholar-id' && nextArg) {
      publications = await fetchFromSemanticScholar(nextArg, true);
      i++;
    }

    if (arg === '--help') {
      printHelp();
      process.exit(0);
    }
  }

  if (publications.length === 0) {
    console.error('❌ No publications found to import');
    process.exit(1);
  }

  // Preview
  console.log('📋 Preview (first 5 publications):');
  console.log('─'.repeat(60));
  publications.slice(0, 5).forEach((pub, i) => {
    console.log(`${i + 1}. ${pub.title}`);
    console.log(`   Authors: ${pub.authors}`);
    console.log(`   Journal: ${pub.journal} (${pub.year})`);
    console.log('');
  });

  if (publications.length > 5) {
    console.log(`   ... and ${publications.length - 5} more\n`);
  }

  // Check for Sanity token
  if (!process.env.SANITY_WRITE_TOKEN && !dryRun) {
    console.error('❌ SANITY_WRITE_TOKEN environment variable is required');
    console.log('   Get a token from: https://www.sanity.io/manage/project/YOUR_PROJECT_ID/api#tokens');
    console.log('   Or run with --dry-run to preview without importing\n');
    process.exit(1);
  }

  // Import
  const results = await importToSanity(publications, dryRun);

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Import Summary:');
  console.log(`   ✅ Imported: ${results.imported}`);
  console.log(`   ⏭️  Skipped (duplicates): ${results.skipped}`);
  console.log(`   ❌ Errors: ${results.errors}`);
  console.log('═'.repeat(60) + '\n');
}

function printHelp() {
  console.log(`
Prosophia Publication Import Tool
══════════════════════════════════

Import publications into your Sanity CMS from various sources.

USAGE:
  npx ts-node scripts/import-publications.ts [OPTIONS]

OPTIONS:
  --bibtex <file>              Import from a BibTeX file
  --semantic-scholar <name>    Search Semantic Scholar by author name
  --semantic-scholar-id <id>   Fetch from Semantic Scholar by author ID
  --dry-run                    Preview imports without writing to Sanity
  --help                       Show this help message

EXAMPLES:
  # Import from BibTeX file
  npx ts-node scripts/import-publications.ts --bibtex ./my-publications.bib

  # Search by author name (uses first match)
  npx ts-node scripts/import-publications.ts --semantic-scholar "Jane Smith"

  # Preview without importing
  npx ts-node scripts/import-publications.ts --bibtex ./pubs.bib --dry-run

ENVIRONMENT:
  SANITY_WRITE_TOKEN           Required for actual imports (not dry-run)
  NEXT_PUBLIC_SANITY_PROJECT_ID  Your Sanity project ID
  NEXT_PUBLIC_SANITY_DATASET     Your Sanity dataset (default: production)

HOW TO GET A BIBTEX FILE:
  • Google Scholar: Go to your profile → Select publications → Export → BibTeX
  • ORCID: Go to Works → Export → BibTeX
  • Zotero: Select items → Right-click → Export → BibTeX
  • Mendeley: Select items → File → Export → BibTeX

`);
}

// Run
main().catch(console.error);
