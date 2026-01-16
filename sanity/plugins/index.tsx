/**
 * Sanity Studio Plugin: Publication Importer
 * 
 * This adds a tool to your Sanity Studio that lets researchers
 * paste BibTeX or search Semantic Scholar directly from the CMS.
 * 
 * Installation:
 * 1. Copy this file to sanity/plugins/publication-importer/
 * 2. Add to sanity.config.ts plugins array
 */

import { definePlugin, defineType } from 'sanity';
import { BookIcon } from '@sanity/icons';

// =============================================================================
// BIBTEX PARSER (Browser-compatible version)
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

function parseBibTeX(bibtexContent: string): ParsedPublication[] {
  const publications: ParsedPublication[] = [];
  const entryRegex = /@(\w+)\s*\{([^,]+),([^@]*)\}/g;
  let match;

  while ((match = entryRegex.exec(bibtexContent)) !== null) {
    const fields = match[3];
    const fieldRegex = /(\w+)\s*=\s*[{"']?([^},"\n]+(?:\{[^}]*\})?[^},"\n]*)[}"']?/g;
    const parsedFields: Record<string, string> = {};
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(fields)) !== null) {
      const key = fieldMatch[1].toLowerCase();
      let value = fieldMatch[2].trim()
        .replace(/[{}]/g, '')
        .replace(/\\&/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
      parsedFields[key] = value;
    }

    const title = parsedFields.title;
    if (!title) continue;

    publications.push({
      title,
      authors: formatAuthors(parsedFields.author || parsedFields.authors || 'Unknown'),
      journal: parsedFields.journal || parsedFields.booktitle || parsedFields.publisher || 'Unknown',
      year: parsedFields.year || new Date().getFullYear().toString(),
      month: parsedFields.month,
      abstract: parsedFields.abstract,
      doi: parsedFields.doi,
      url: parsedFields.url || (parsedFields.doi ? `https://doi.org/${parsedFields.doi}` : undefined),
    });
  }

  return publications;
}

function formatAuthors(authors: string): string {
  const authorList = authors.split(/\s+and\s+/i);
  return authorList.map(author => {
    author = author.trim();
    if (author.includes(',')) {
      const [last, first] = author.split(',').map(s => s.trim());
      const initials = first.split(/\s+/).map(n => n.charAt(0).toUpperCase() + '.').join(' ');
      return `${initials} ${last}`;
    }
    const parts = author.split(/\s+/);
    if (parts.length >= 2) {
      const last = parts.pop();
      const initials = parts.map(n => n.charAt(0).toUpperCase() + '.').join(' ');
      return `${initials} ${last}`;
    }
    return author;
  }).join(', ');
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 96);
}

// =============================================================================
// REACT COMPONENT
// =============================================================================

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Stack,
  Text,
  TextArea,
  TextInput,
  useToast,
  Spinner,
  Badge,
  Checkbox,
} from '@sanity/ui';
import { useClient } from 'sanity';

function PublicationImporterTool() {
  const client = useClient({ apiVersion: '2024-01-01' });
  const toast = useToast();
  
  const [mode, setMode] = useState<'bibtex' | 'semantic'>('bibtex');
  const [bibtexInput, setBibtexInput] = useState('');
  const [authorQuery, setAuthorQuery] = useState('');
  const [parsedPubs, setParsedPubs] = useState<ParsedPublication[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  // Parse BibTeX
  const handleParseBibtex = useCallback(() => {
    try {
      const pubs = parseBibTeX(bibtexInput);
      setParsedPubs(pubs);
      setSelectedIndices(new Set(pubs.map((_, i) => i)));
      
      if (pubs.length === 0) {
        toast.push({
          status: 'warning',
          title: 'No publications found',
          description: 'Check your BibTeX format',
        });
      } else {
        toast.push({
          status: 'success',
          title: `Found ${pubs.length} publications`,
        });
      }
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Parse error',
        description: String(error),
      });
    }
  }, [bibtexInput, toast]);

  // Search Semantic Scholar
  const handleSearchSemantic = useCallback(async () => {
    if (!authorQuery.trim()) return;
    
    setLoading(true);
    try {
      // Search for author
      const searchRes = await fetch(
        `https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(authorQuery)}&limit=1`
      );
      const searchData = await searchRes.json();
      
      if (!searchData.data?.length) {
        throw new Error('No authors found');
      }

      const authorId = searchData.data[0].authorId;
      
      // Fetch papers
      const papersRes = await fetch(
        `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=title,authors,venue,year,abstract,externalIds&limit=100`
      );
      const papersData = await papersRes.json();
      
      const pubs: ParsedPublication[] = (papersData.data || []).map((p: any) => ({
        title: p.title,
        authors: p.authors?.map((a: any) => a.name).join(', ') || 'Unknown',
        journal: p.venue || 'Unknown',
        year: p.year?.toString() || new Date().getFullYear().toString(),
        abstract: p.abstract,
        doi: p.externalIds?.DOI,
        url: p.externalIds?.DOI ? `https://doi.org/${p.externalIds.DOI}` : undefined,
      }));

      setParsedPubs(pubs);
      setSelectedIndices(new Set(pubs.map((_, i) => i)));
      
      toast.push({
        status: 'success',
        title: `Found ${pubs.length} publications for ${searchData.data[0].name}`,
      });
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Search failed',
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  }, [authorQuery, toast]);

  // Toggle selection
  const toggleSelection = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  // Select all / none
  const toggleAll = () => {
    if (selectedIndices.size === parsedPubs.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(parsedPubs.map((_, i) => i)));
    }
  };

  // Import selected
  const handleImport = useCallback(async () => {
    const toImport = parsedPubs.filter((_, i) => selectedIndices.has(i));
    if (toImport.length === 0) return;

    setImporting(true);
    let imported = 0;
    let skipped = 0;

    try {
      for (const pub of toImport) {
        // Check for existing
        const exists = await client.fetch(
          `count(*[_type == "publication" && title == $title]) > 0`,
          { title: pub.title }
        );

        if (exists) {
          skipped++;
          continue;
        }

        // Create document
        await client.create({
          _type: 'publication',
          title: pub.title,
          slug: { _type: 'slug', current: generateSlug(pub.title) },
          authors: pub.authors,
          journal: pub.journal,
          publicationDate: `${pub.year}-01`,
          abstract: pub.abstract,
          journalLink: pub.url || `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`,
        });

        imported++;
      }

      toast.push({
        status: 'success',
        title: 'Import complete',
        description: `Imported ${imported}, skipped ${skipped} duplicates`,
      });

      // Clear
      setParsedPubs([]);
      setSelectedIndices(new Set());
      setBibtexInput('');
      setAuthorQuery('');

    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Import failed',
        description: String(error),
      });
    } finally {
      setImporting(false);
    }
  }, [parsedPubs, selectedIndices, client, toast]);

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Heading as="h1" size={2}>
          <Flex align="center" gap={2}>
            <BookIcon />
            Publication Importer
          </Flex>
        </Heading>
        
        <Text muted>
          Import publications from BibTeX or search Semantic Scholar.
        </Text>

        {/* Mode Toggle */}
        <Flex gap={2}>
          <Button
            mode={mode === 'bibtex' ? 'default' : 'ghost'}
            onClick={() => setMode('bibtex')}
            text="BibTeX Import"
          />
          <Button
            mode={mode === 'semantic' ? 'default' : 'ghost'}
            onClick={() => setMode('semantic')}
            text="Semantic Scholar"
          />
        </Flex>

        {/* BibTeX Mode */}
        {mode === 'bibtex' && (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text weight="semibold">Paste BibTeX</Text>
              <Text size={1} muted>
                Export from Google Scholar, ORCID, Zotero, or Mendeley
              </Text>
              <TextArea
                rows={10}
                placeholder="@article{...}"
                value={bibtexInput}
                onChange={(e) => setBibtexInput(e.currentTarget.value)}
              />
              <Button
                tone="primary"
                onClick={handleParseBibtex}
                disabled={!bibtexInput.trim()}
                text="Parse BibTeX"
              />
            </Stack>
          </Card>
        )}

        {/* Semantic Scholar Mode */}
        {mode === 'semantic' && (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text weight="semibold">Search by Author</Text>
              <Text size={1} muted>
                Enter author name to fetch their publications
              </Text>
              <Flex gap={2}>
                <Box flex={1}>
                  <TextInput
                    placeholder="e.g., Jane Smith"
                    value={authorQuery}
                    onChange={(e) => setAuthorQuery(e.currentTarget.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSemantic()}
                  />
                </Box>
                <Button
                  tone="primary"
                  onClick={handleSearchSemantic}
                  disabled={!authorQuery.trim() || loading}
                  text={loading ? 'Searching...' : 'Search'}
                  icon={loading ? Spinner : undefined}
                />
              </Flex>
            </Stack>
          </Card>
        )}

        {/* Results */}
        {parsedPubs.length > 0 && (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={4}>
              <Flex justify="space-between" align="center">
                <Text weight="semibold">
                  Found {parsedPubs.length} publications
                </Text>
                <Flex gap={2}>
                  <Button
                    mode="ghost"
                    onClick={toggleAll}
                    text={selectedIndices.size === parsedPubs.length ? 'Deselect All' : 'Select All'}
                    fontSize={1}
                  />
                  <Badge tone="primary">{selectedIndices.size} selected</Badge>
                </Flex>
              </Flex>

              <Box style={{ maxHeight: '400px', overflow: 'auto' }}>
                <Stack space={2}>
                  {parsedPubs.map((pub, i) => (
                    <Card
                      key={i}
                      padding={3}
                      radius={2}
                      tone={selectedIndices.has(i) ? 'primary' : 'default'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleSelection(i)}
                    >
                      <Flex gap={3} align="flex-start">
                        <Checkbox checked={selectedIndices.has(i)} readOnly />
                        <Stack space={1}>
                          <Text weight="semibold" size={1}>
                            {pub.title}
                          </Text>
                          <Text size={1} muted>
                            {pub.authors}
                          </Text>
                          <Text size={0} muted>
                            {pub.journal} ({pub.year})
                          </Text>
                        </Stack>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Button
                tone="positive"
                onClick={handleImport}
                disabled={selectedIndices.size === 0 || importing}
                text={importing ? 'Importing...' : `Import ${selectedIndices.size} Publications`}
                icon={importing ? Spinner : undefined}
              />
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  );
}

// =============================================================================
// PLUGIN EXPORT
// =============================================================================

export const publicationImporter = definePlugin({
  name: 'publication-importer',
  tools: [
    {
      name: 'publication-importer',
      title: 'Import Publications',
      icon: BookIcon,
      component: PublicationImporterTool,
    },
  ],
});
