-- ==============================================================================
-- LAWYER PORTFOLIO & MARKETPLACE SEED SQL
-- ==============================================================================

-- 1. Categories
INSERT INTO public.categories (id, name, slug, description, icon, display_order)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', 'Constitutional Law', 'constitutional-law', 'In-depth notes on Fundamental Rights, Writs, Federalism, and Landmark SC Rulings.', 'Shield', 1),
    ('c2222222-2222-2222-2222-222222222222', 'Criminal Law & New Criminal Codes', 'criminal-law', 'Comprehensive guides covering BNS, BNSS, BSA, procedural safeguards, and bail doctrines.', 'Scale', 2),
    ('c3333333-3333-3333-3333-333333333333', 'Civil Law & Procedure', 'civil-law', 'CPC, Specific Relief Act, Law of Injunctions, and Execution of Decrees simplified.', 'BookOpen', 3),
    ('c4444444-4444-4444-4444-444444444444', 'Judiciary Preparation', 'judiciary-preparation', 'State Judicial Services prelims & mains answer writing frameworks and judgment writing.', 'Award', 4),
    ('c5555555-5555-5555-5555-555555555555', 'Case Law Summaries', 'case-law-summaries', 'Curated constitution bench decisions, ratio decidendi, and dissenting opinions.', 'FileText', 5),
    ('c6666666-6666-6666-6666-666666666666', 'Drafting & Court Practice', 'legal-drafting', 'High Court writ petitions, PILs, criminal appeals, and contractual drafting masterclasses.', 'Briefcase', 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. Products
INSERT INTO public.products (
    id, title, slug, short_description, description, price_paise, original_price_paise,
    category_id, cover_image_path, pdf_storage_path, preview_storage_path,
    page_count, file_format, topics, target_audience, learning_outcomes, is_featured, is_published, sales_count, rating, reviews_count
)
VALUES 
(
    'p1111111-1111-1111-1111-111111111111',
    'Constitutional Law of India: Master Revision & Judiciary Notes',
    'constitutional-law-master-notes',
    'Exhaustive, section-by-section analysis of Articles 1 to 395 with 140+ landmark Supreme Court precedents, doctrine flowcharts, and mains model answers.',
    'A master study compendium prepared exclusively for State Judicial Services aspirants, UPSC Law Optional candidates, and LL.B/LL.M scholars. Covers Part III Fundamental Rights, Basic Structure Doctrine, Article 32 & 226 Writs, and 10 years solved mains questions.',
    69900,
    129900,
    'c1111111-1111-1111-1111-111111111111',
    '/covers/const-law-cover.png',
    'materials/constitutional_law_master_notes_v3.pdf',
    'previews/constitutional_law_preview.pdf',
    384,
    'PDF',
    '[{"title":"Part III: Fundamental Rights","subtopics":["Art 14 Golden Triangle","Art 19 Reasonable Restrictions","Art 21 Transformative Jurisprudence"]},{"title":"Prerogative Writs (32 & 226)","subtopics":["Habeas Corpus, Mandamus, Certiorari"]}]'::jsonb,
    '["Judicial Services Aspirants (Civil Judge / ADJ)", "UPSC Law Optional", "LL.B & LL.M Students"]'::jsonb,
    '["Master all 395 Articles with conceptual clarity", "Cite over 140 landmark SC judgments with precision", "Draft structured judicial mains answers using IRAC"]'::jsonb,
    true,
    true,
    1420,
    4.95,
    284
),
(
    'p2222222-2222-2222-2222-222222222222',
    'New Criminal Laws Handbook: BNS, BNSS & BSA Comparative Analysis (2024-2026)',
    'new-criminal-laws-handbook-bns-bnss-bsa',
    'The definitive transition manual comparing IPC to Bharatiya Nyaya Sanhita, CrPC to Bharatiya Nagarik Suraksha Sanhita, and IEA to Bharatiya Sakshya Adhiniyam.',
    'The historic overhaul of Indian criminal law distilled into comprehensive mapping tables, substantive modifications, procedural innovations, and electronic evidence rules.',
    79900,
    149900,
    'c2222222-2222-2222-2222-222222222222',
    '/covers/criminal-law-cover.png',
    'materials/new_criminal_laws_comparative_handbook.pdf',
    'previews/criminal_laws_preview.pdf',
    420,
    'PDF',
    '[{"title":"BNS 2023 vs IPC 1860","subtopics":["New offences: Organised Crime & Terrorism","Community Service"]},{"title":"BNSS 2023 Procedural Rules","subtopics":["Mandatory videography","Preliminary inquiry"]},{"title":"BSA Electronic Evidence","subtopics":["Section 61-63 Certificates"]}]'::jsonb,
    '["Judicial Services Aspirants", "Trial Advocates & Prosecutors", "Law Enforcement Cadets"]'::jsonb,
    '["Cross-reference old to new criminal sections effortlessly", "Understand electronic evidence admissibility", "Draft bail applications under BNSS"]'::jsonb,
    true,
    true,
    2180,
    4.98,
    512
),
(
    'p3333333-3333-3333-3333-333333333333',
    'Code of Civil Procedure (CPC) & Limitation Act: Visual Flowcharts & Case Notes',
    'cpc-civil-procedure-flowcharts-notes',
    'De-mystify complex civil litigation procedure. Complete with 80+ visual flowcharts, Order-Rule cheat sheets, Res Judicata doctrines, and Execution templates.',
    'Breaks down every stage of a civil suit from institution of plaint to trial, injunctions, and execution under Order XXI. Includes comprehensive notes on the Limitation Act 1963.',
    59900,
    99900,
    'c3333333-3333-3333-3333-333333333333',
    '/covers/cpc-notes-cover.png',
    'materials/cpc_limitation_master_notes.pdf',
    'previews/cpc_notes_preview.pdf',
    290,
    'PDF',
    '[{"title":"Jurisdiction & Res Judicata","subtopics":["Section 10 & 11 constructive res judicata"]},{"title":"Pleadings & Trial","subtopics":["Order VI, VII & VIII","Order XXXIX Injunctions"]}]'::jsonb,
    '["Civil Judge Junior Division Aspirants", "Junior Civil Litigators", "Law Students"]'::jsonb,
    '["Visualize civil suits from plaint to execution", "Master all 51 Orders and pivotal rules easily"]'::jsonb,
    true,
    true,
    1120,
    4.91,
    198
),
(
    'p4444444-4444-4444-4444-444444444444',
    'Judiciary Mains Master Answer-Writing Framework & Judgment Writing',
    'judiciary-mains-answer-writing-framework',
    'The proprietary answer-structuring methodology that helped 70+ students clear State Judicial Services. Includes civil & criminal judgment writing blueprints.',
    'Over 150 solved questions across DJS, UP, MP, and Rajasthan judiciary. Features dedicated chapters on framing charges and drafting complete judicial judgments.',
    89900,
    169900,
    'c4444444-4444-4444-4444-444444444444',
    '/covers/judiciary-mains-cover.png',
    'materials/judiciary_mains_answer_writing_handbook.pdf',
    'previews/judiciary_mains_preview.pdf',
    360,
    'PDF',
    '[{"title":"The 4-Pillar IRAC Technique","subtopics":["Proposition","Doctrine","Citations","Synthesis"]},{"title":"Civil & Criminal Judgment Writing","subtopics":["Issues, Evidence Marshalling, Operative Relief"]}]'::jsonb,
    '["State Judicial Service Mains Candidates", "APP / APO Candidates", "Judicial Clerkship Candidates"]'::jsonb,
    '["Boost mains scores by 20-30% using professional structuring", "Draft full judgments within 45-minute exam limits"]'::jsonb,
    true,
    true,
    1680,
    4.97,
    340
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Content Sections (Configurable portfolio data)
INSERT INTO public.content_sections (section_key, content_json)
VALUES 
    ('hero', '{
        "title": "Adv. Harshal Kodgirwar",
        "tagline": "Supreme Court Advocate & Premier Legal Educator",
        "subtitle": "Bridging rigorous courtroom practice with academic excellence. Mentoring over 150,000+ law students and judicial aspirants with authoritative, exam-oriented study materials.",
        "primaryCta": "Explore Study Materials",
        "secondaryCta": "About My Practice"
    }'::jsonb),
    ('profile', '{
        "qualifications": "B.A. LL.B (Hons.), LL.M (Constitutional & Administrative Law)",
        "barCouncilNumber": "MAH/2841/2016",
        "courts": "Supreme Court of India, Delhi High Court & Bombay High Court",
        "experience": "10+ Years in Litigation & Legal Academics",
        "communitySize": "150,000+ Students & Followers"
    }'::jsonb)
ON CONFLICT (section_key) DO NOTHING;
