Lab Website Template Generation
Project Overview
This is a Next.js 15 + Sanity.io research lab website template with TypeScript and CSS Modules. The goal is to create 4 distinct UI design templates as independent, runnable projects while maintaining identical content from Sanity CMS.
Tech Stack

Frontend: Next.js 15.5.2 (React 19.1.0)
Styling: CSS Modules (component-scoped)
Backend/CMS: Sanity.io 4.6.1
Type Safety: TypeScript 5
Theme Support: next-themes (light/dark mode)
Additional: styled-components 6.1.19

Current Project Structure:

lab-website-template-v3/
├── app/                    # Next.js App Router
│   ├── ui/components/     # All components with .module.css files
│   ├── lib/               # Utilities & Sanity client
│   └── [pages]/           # Route pages
├── sanity/                # Sanity CMS config & schemas
├── public/                # Static assets
└── config files

Key Pages (8 total):

Home, Research, Publications, People, News, Pictures, Book, Contact
Dynamic routes: /publications/[slug], /news/[slug]

Components with CSS Modules:

HomePage, ResearchPage, PublicationsPage, PublicationDetailPage
PeoplePage, PastMembersPage, NewsPage, NewsArticlePage
PicturesPage, BookPage, ContactPage
Header, Footer, ClientLayout, ContactCTA


Primary Objective
Create 4 independent, runnable template variations in separate folders:

Engineering Template - Technical, precise, structured
Arts Template - Creative, expressive, visually rich
Sciences Template - Clean, data-focused, professional
Business Template - Corporate, polished, results-oriented


Proposed Folder Structure
parent-directory/
│
├── lab-website-template-v3/           # ORIGINAL (keep as reference)
│
├── lab-website-engineering/           # Template 1
│   ├── app/
│   ├── sanity/                        # Same Sanity config
│   ├── public/
│   ├── package.json
│   └── ...
│
├── lab-website-arts/                  # Template 2
│   ├── app/
│   ├── sanity/
│   ├── public/
│   └── ...
│
├── lab-website-sciences/              # Template 3
│   ├── app/
│   ├── sanity/
│   ├── public/
│   └── ...
│
└── lab-website-business/              # Template 4
    ├── app/
    ├── sanity/
    ├── public/
    └── ...
Each template is a complete, standalone Next.js app that can:

Run independently with npm run dev
Connect to the same Sanity project
Deploy separately if needed


Critical Requirements
MUST KEEP IDENTICAL ACROSS ALL TEMPLATES:

✅ All Sanity schemas (sanity/schemaTypes/)
✅ All Sanity configuration and queries
✅ All content fetching logic (app/lib/sanity.ts, app/lib/data.ts)
✅ Component structure and TypeScript interfaces
✅ All functionality and features
✅ Navigation structure
✅ Dynamic routes
✅ Light/dark mode functionality (next-themes)
✅ All images in /public/

CAN BE CHANGED PER TEMPLATE:

❌ All CSS Module files (.module.css)
❌ app/globals.css
❌ Color schemes and CSS variables
❌ Typography (fonts, sizes, weights)
❌ Layout spacing and grid systems
❌ Component visual styling
❌ Animations and transitions
❌ Border styles, shadows, backgrounds
❌ Button and card designs
❌ styled-components usage (if applicable)


Design Guidelines Per Template
1. Engineering Template (lab-website-engineering/)
Feel: Technical, precise, blueprint-inspired

Color palette:

Primary: Deep blues (#1E3A8A, #3B82F6)
Secondary: Grays (#475569, #64748B)
Accent: Metallic/cyan (#06B6D4)


Typography:

Headings: Roboto Mono or JetBrains Mono
Body: Inter or system-ui


Layout:

Strict grid-based
Technical diagram aesthetic
Data tables with clear borders


Visual elements:

Sharp angles, minimal curves
Blueprint-style backgrounds (subtle grid patterns)
Technical iconography
Monospaced code-like elements



2. Arts Template (lab-website-arts/)
Feel: Creative, expressive, gallery-like

Color palette:

Bold and vibrant OR artistic pastels
Primary: Purples (#8B5CF6), pinks (#EC4899)
Secondary: Warm oranges (#F59E0B), teals (#14B8A6)


Typography:

Headings: Playfair Display, Cormorant
Body: Lato, Open Sans


Layout:

Asymmetric, broken grid
Masonry-style galleries
Overlapping elements


Visual elements:

Flowing curves and organic shapes
Artistic flourishes and decorative elements
Creative use of whitespace
Gallery-style image presentations



3. Sciences Template (lab-website-sciences/)
Feel: Clean, professional, research-focused

Color palette:

Primary: Clean whites, light grays (#F8FAFC)
Accent: Scientific greens (#10B981), purples (#8B5CF6)
Data viz colors: Professional palette


Typography:

Headings: Source Serif Pro, Merriweather
Body: Source Sans Pro, system-ui


Layout:

Academic paper-like structure
Clear hierarchical sections
Organized content blocks


Visual elements:

Minimalist design
Data visualization aesthetic
Clean dividers and sections
Citation-style formatting



4. Business Template (lab-website-business/)
Feel: Corporate, polished, results-oriented

Color palette:

Primary: Corporate navy (#1E40AF), blacks (#0F172A)
Secondary: Professional grays
Accent: Gold (#F59E0B) or executive blue


Typography:

Headings: Montserrat, Poppins (bold, confident)
Body: Inter, Helvetica


Layout:

Executive dashboard style
Card-based information architecture
Clear call-to-action sections


Visual elements:

Sleek, professional cards
Subtle shadows and depth
Corporate polish
Results-oriented metrics display




Implementation Strategy
Phase 1: Setup (Do First)

Duplicate the base project 4 times:

bash   cp -r lab-website-template-v3 lab-website-engineering
   cp -r lab-website-template-v3 lab-website-arts
   cp -r lab-website-template-v3 lab-website-sciences
   cp -r lab-website-template-v3 lab-website-business

Update package.json names in each:

Change "name" field to match folder name
Keep all dependencies identical


Verify Sanity connection:

Ensure all 4 templates connect to the same Sanity project
Test that content appears identically in all



Phase 2: Create Design Systems
For each template, create a design system document:

Color variables (CSS custom properties in globals.css)
Typography scale
Spacing system
Component styling patterns

Phase 3: Implement Templates (One at a Time)
Order: Engineering → Sciences → Business → Arts
For each template:

Update app/globals.css:

Define CSS variables for colors, fonts, spacing
Set global typography styles
Configure theme (light/dark) colors


Modify all .module.css files in app/ui/components/:

HomePage.module.css
ResearchPage.module.css
PublicationsPage.module.css
PublicationDetailPage.module.css
PeoplePage.module.css
PastMembersPage.module.css
NewsPage.module.css
NewsArticlePage.module.css
PicturesPage.module.css
BookPage.module.css
ContactPage.module.css
Header, Footer, ClientLayout, ContactCTA


Test each page:

Verify content is identical
Check responsive design
Test light/dark mode
Validate TypeScript builds


Document theme-specific patterns

Phase 4: Quality Assurance

Compare content across all 4 templates (should be identical)
Test all dynamic routes
Verify Sanity queries work in all templates
Check accessibility standards
Test responsive breakpoints


Key Constraints

✅ Each template must be independently runnable
✅ All templates share the same Sanity project/data
✅ Use only CSS Modules (no Tailwind or other frameworks)
✅ Maintain TypeScript type safety
✅ Preserve next-themes functionality
✅ Keep all 8 pages + dynamic routes
❌ Do NOT modify Sanity schemas or structure
❌ Do NOT change component logic or functionality
❌ Do NOT alter data fetching patterns


Testing Each Template
bash# Navigate to template folder
cd lab-website-engineering

# Install dependencies (first time only)
npm install

# Run development server
npm run dev

# Build for production
npm run build
Each should run on a different port or be tested separately.

Expected Deliverables

✅ 4 complete, independent Next.js applications
✅ Identical content and functionality across all
✅ Distinct visual designs matching field aesthetics
✅ Documentation for each template's design system
✅ All templates fully responsive
✅ Light/dark mode working in all

