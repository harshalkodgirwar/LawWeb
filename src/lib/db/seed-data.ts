import { Category, Product, ContentSection } from "./types";

export const SEED_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Constitutional Law",
    slug: "constitutional-law",
    description: "In-depth notes on Fundamental Rights, Writs, Federalism, and Landmark SC Rulings.",
    icon: "Shield",
    display_order: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Criminal Law & New Criminal Codes",
    slug: "criminal-law",
    description: "Comprehensive guides covering BNS, BNSS, BSA, procedural safeguards, and bail doctrines.",
    icon: "Scale",
    display_order: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Civil Law & Procedure",
    slug: "civil-law",
    description: "CPC, Specific Relief Act, Law of Injunctions, and Execution of Decrees simplified.",
    icon: "BookOpen",
    display_order: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Judiciary Preparation",
    slug: "judiciary-preparation",
    description: "State Judicial Services prelims & mains answer writing frameworks and judgment writing.",
    icon: "Award",
    display_order: 4,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "Case Law Summaries",
    slug: "case-law-summaries",
    description: "Curated constitution bench decisions, ratio decidendi, and dissenting opinions.",
    icon: "FileText",
    display_order: 5,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-6",
    name: "Drafting & Court Practice",
    slug: "legal-drafting",
    description: "High Court writ petitions, PILs, criminal appeals, and contractual drafting masterclasses.",
    icon: "Briefcase",
    display_order: 6,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-7",
    name: "Bare Act Notes",
    slug: "bare-act-notes",
    description: "Section-by-section breakdown with legislative intent, amendments, and cross-references.",
    icon: "Bookmark",
    display_order: 7,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-8",
    name: "Law School Notes",
    slug: "law-school-notes",
    description: "Semester-ready exam preparation guides for 3-Year and 5-Year LL.B students.",
    icon: "GraduationCap",
    display_order: 8,
    created_at: "2026-01-01T00:00:00Z",
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-const-law-master",
    title: "Constitutional Law of India: Master Revision & Judiciary Notes",
    slug: "constitutional-law-master-notes",
    short_description: "Exhaustive, section-by-section analysis of Articles 1 to 395 with 140+ landmark Supreme Court precedents, doctrine flowcharts, and mains model answers.",
    description: `A master study compendium prepared exclusively for State Judicial Services aspirants, UPSC Law Optional candidates, and LL.B/LL.M scholars. 

This comprehensive volume distills complex constitutional doctrines into structured, exam-oriented frameworks. It provides side-by-side comparative tables for historical constitutional developments, exhaustive coverage of Part III (Fundamental Rights), the Basic Structure Doctrine from *Kesavananda Bharati* to *Minerva Mills*, and a specialized treatise on Article 32 & 226 prerogative writs with practical drafting notes.

Every chapter concludes with previous 10 years' solved mains questions from Delhi, UP, MP, and Bihar Judiciary, accompanied by high-scoring structural templates.`,
    price_paise: 69900, // ₹699
    original_price_paise: 129900, // ₹1,299
    category_id: "cat-1",
    cover_image_path: "/covers/const-law-cover.png",
    pdf_storage_path: "materials/constitutional_law_master_notes_v3.pdf",
    preview_storage_path: "previews/constitutional_law_preview.pdf",
    page_count: 384,
    file_format: "PDF (Searchable, DRM-Protected Watermark Ready)",
    topics: [
      {
        title: "Part I & II: Territory of India & Citizenship Jurisprudence",
        subtopics: ["Articles 1-4 constitutional boundaries", "CAA 2019 legal challenges & Article 11 scope"],
      },
      {
        title: "Part III: Fundamental Rights Doctrines",
        subtopics: ["Doctrine of Severability & Eclipse (Art. 13)", "Article 14 Golden Triangle & Wednesbury test", "Article 19 Reasonable Restrictions standard", "Article 21 Transformative jurisprudence: Puttaswamy to Navtej Johar"],
      },
      {
        title: "Prerogative Writs (Articles 32 & 226)",
        subtopics: ["Habeas Corpus, Mandamus, Quo Warranto, Certiorari, Prohibition", "Comparative scope of SC vs HC writ powers"],
      },
      {
        title: "Federal Architecture & Emergency Powers",
        subtopics: ["Legislative relations (Arts. 245-255)", "SR Bommai guidelines for Article 356", "Financial Emergency procedures"],
      },
      {
        title: "Constitutional Amendments & Basic Structure",
        subtopics: ["Article 368 amending power constraints", "Chronological judicial evolution of 24 basic structure features"],
      },
    ],
    target_audience: [
      "Judicial Services Aspirants (Civil Judge / ADJ Examinations)",
      "UPSC Civil Services Law Optional Candidates",
      "LL.B & LL.M Students preparing for University Finals",
      "Practicing Advocates requiring a swift reference for constitutional citations",
    ],
    learning_outcomes: [
      "Master all 395 Articles with conceptual clarity and historical context",
      "Cite over 140 landmark and recent Supreme Court judgments with precision",
      "Draft structured, high-scoring judicial mains answers using the IRAC method",
      "Quickly revise critical constitutional concepts using 45+ synthesized flowcharts",
    ],
    is_featured: true,
    is_published: true,
    sales_count: 1420,
    rating: 4.95,
    reviews_count: 284,
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-10-10T12:00:00Z",
  },
  {
    id: "prod-new-criminal-laws",
    title: "New Criminal Laws Handbook: BNS, BNSS & BSA Comparative Analysis (2024-2026)",
    slug: "new-criminal-laws-handbook-bns-bnss-bsa",
    short_description: "The definitive transition manual comparing IPC to Bharatiya Nyaya Sanhita, CrPC to Bharatiya Nagarik Suraksha Sanhita, and IEA to Bharatiya Sakshya Adhiniyam.",
    description: `India's criminal justice system has witnessed its most historic overhaul in over 160 years. This comprehensive handbook provides an authoritative, clause-by-clause comparative bridge between the colonial era penal statutes and the newly enacted criminal laws.

Includes complete concordances, section-mapping tables, highlighted substantive modifications, newly introduced offences (terrorism, organized crime, mob lynching), procedural revolutions (forensic evidence mandate, zero FIR formalization, e-summons), and electronic evidence admissibility guidelines under BSA.`,
    price_paise: 79900, // ₹799
    original_price_paise: 149900, // ₹1,499
    category_id: "cat-2",
    cover_image_path: "/covers/criminal-law-cover.png",
    pdf_storage_path: "materials/new_criminal_laws_comparative_handbook.pdf",
    preview_storage_path: "previews/criminal_laws_preview.pdf",
    page_count: 420,
    file_format: "PDF",
    topics: [
      {
        title: "BNS 2023 vs IPC 1860 Exhaustive Concordance",
        subtopics: ["Newly inserted offences: Section 111 (Organized Crime), Section 113 (Terrorist acts)", "Redefined offences against women and children", "Community service as non-custodial punishment"],
      },
      {
        title: "BNSS 2023 Procedural Innovations",
        subtopics: ["Mandatory videography during search and seizure", "Preliminary inquiry under Section 173(3)", "Police custody timelines and bail jurisprudence"],
      },
      {
        title: "Bharatiya Sakshya Adhiniyam (BSA)",
        subtopics: ["Section 61-63 Electronic Records & Hash Value verification", "Reformed burden of proof and presumption standards"],
      },
    ],
    target_audience: [
      "All Judicial Services Aspirants adapting to the new syllabi",
      "Trial Advocates, Public Prosecutors, and Legal Practitioners",
      "Law Enforcement Officers and Police Academy Cadets",
      "Law professors and students in criminal law semesters",
    ],
    learning_outcomes: [
      "Instantly cross-reference any old IPC/CrPC section to its exact new BNS/BNSS counterpart",
      "Understand the procedural nuances of electronic evidence and video-recorded seizures",
      "Draft anticipatory and regular bail applications under the new BNSS provisions",
    ],
    is_featured: true,
    is_published: true,
    sales_count: 2180,
    rating: 4.98,
    reviews_count: 512,
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-10-18T14:30:00Z",
  },
  {
    id: "prod-cpc-flowcharts-notes",
    title: "Code of Civil Procedure (CPC) & Limitation Act: Visual Flowcharts & Case Notes",
    slug: "cpc-civil-procedure-flowcharts-notes",
    short_description: "De-mystify complex civil litigation procedure. Complete with 80+ visual flowcharts, Order-Rule cheat sheets, Res Judicata doctrines, and Execution templates.",
    description: `The Code of Civil Procedure 1908 is notoriously regarded as the most intimidating procedural code for students and litigators alike. This handbook breaks down every stage of a civil suit—from institution of plaint under Order VII to summons, written statement under Order VIII, framing of issues (Order XIV), interim injunctions (Order XXXIX), and appellate mechanisms.

Features simplified visual diagrams for Section 10 (Res Sub-Judice) and Section 11 (Res Judicata), accompanied by exhaustive notes on the Law of Limitation 1963.`,
    price_paise: 59900, // ₹599
    original_price_paise: 99900, // ₹999
    category_id: "cat-3",
    cover_image_path: "/covers/cpc-notes-cover.png",
    pdf_storage_path: "materials/cpc_limitation_master_notes.pdf",
    preview_storage_path: "previews/cpc_notes_preview.pdf",
    page_count: 290,
    file_format: "PDF",
    topics: [
      {
        title: "Jurisdiction & Res Judicata",
        subtopics: ["Pecuniary, Territorial, and Subject-Matter Jurisdiction", "Constructive Res Judicata (Explanation IV to Section 11)"],
      },
      {
        title: "Pleadings & Pre-Trial Stages",
        subtopics: ["Order VI & VII Plaint requirements, Rejection vs Return", "Order VIII Written Statement, Set-off, and Counter-claim"],
      },
      {
        title: "Interim Relief & Execution",
        subtopics: ["Order XXXIX Temporary Injunctions test (Prima facie, Balance of convenience, Irreparable loss)", "Order XXI Execution of Decrees master roadmap"],
      },
      {
        title: "Appeals, Reference, Review & Revision",
        subtopics: ["Section 96 vs Section 100 Second Appeal substantial questions of law", "Section 115 Civil Revision powers"],
      },
    ],
    target_audience: [
      "Civil Judge Junior Division (CJJD) Aspirants",
      "Young Civil Litigators embarking on district court practice",
      "Law students preparing for Procedural Law examinations",
    ],
    learning_outcomes: [
      "Effortlessly visualize civil suit chronology from institution to final satisfaction",
      "Master all 51 Orders and their pivotal rules without rote memorization",
      "Write flawless procedural answers in judicial service mains",
    ],
    is_featured: true,
    is_published: true,
    sales_count: 1120,
    rating: 4.91,
    reviews_count: 198,
    created_at: "2026-03-10T10:00:00Z",
    updated_at: "2026-09-25T11:00:00Z",
  },
  {
    id: "prod-judiciary-mains-writing",
    title: "Judiciary Mains Master Answer-Writing Framework & Judgment Writing",
    slug: "judiciary-mains-answer-writing-framework",
    short_description: "The proprietary answer-structuring methodology that helped 70+ students clear State Judicial Services. Includes civil & criminal judgment writing blueprints.",
    description: `Clearing the Judiciary Preliminary exam tests knowledge, but clearing the Mains examination tests presentation, legal synthesis, and authoritative articulation. 

This masterclass manual contains 150+ solved high-scoring answers modeled across past papers of Delhi (DJS), Uttar Pradesh (UPPCS-J), Madhya Pradesh (MP-HJS/CJ), Haryana (HCS-J), and Rajasthan (RJS).

Includes dedicated sections for framing criminal charges under BNSS, framing civil issues under Order XIV CPC, and drafting complete criminal/civil judgments with evidence marshalling and sentencing considerations.`,
    price_paise: 89900, // ₹899
    original_price_paise: 169900, // ₹1,699
    category_id: "cat-4",
    cover_image_path: "/covers/judiciary-mains-cover.png",
    pdf_storage_path: "materials/judiciary_mains_answer_writing_handbook.pdf",
    preview_storage_path: "previews/judiciary_mains_preview.pdf",
    page_count: 360,
    file_format: "PDF",
    topics: [
      {
        title: "The 4-Pillar Answer Structuring Technique",
        subtopics: ["Opening proposition and legislative provision", "Doctrinal breakdown and essential ingredients", "Leading and recent case law citation technique", "Conclusive synthesis with statutory exceptions"],
      },
      {
        title: "Civil Judgment Writing Workshop",
        subtopics: ["Title of the court, pleadings summary, issues framed, evidence appreciation, relief and costs"],
      },
      {
        title: "Criminal Judgment Writing Workshop",
        subtopics: ["Prosecution version, defense plea, points for determination, benefit of doubt, sentencing guidelines"],
      },
    ],
    target_audience: [
      "State Judicial Service Mains Candidates",
      "Assistant Public Prosecutor (APP/APO) Aspirants",
      "Judicial Clerkship Candidates (Supreme Court & High Courts)",
    ],
    learning_outcomes: [
      "Dramatically improve mains scores by 20-30% using professional structuring",
      "Draft full-length Civil and Criminal judgments within the 45-minute exam window",
      "Avoid common pitfalls that lead to deduction of marks in legal answers",
    ],
    is_featured: true,
    is_published: true,
    sales_count: 1680,
    rating: 4.97,
    reviews_count: 340,
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-10-15T09:00:00Z",
  },
  {
    id: "prod-landmark-case-summaries",
    title: "500 Landmark Supreme Court Judgments Compendium (1950 - 2026)",
    slug: "500-landmark-supreme-court-judgments-compendium",
    short_description: "Concise 1-page ratio decidendi briefs for the 500 most quoted Supreme Court judgments across Constitutional, Criminal, Property, and Corporate Jurisprudence.",
    description: `Never spend hours wading through 200-page judgments when preparing for exams or oral arguments. Each case summary is meticulously formatted into four essential sections:
1. Facts of the Case
2. Primary Legal Questions & Conflicting Precedents
3. Ratio Decidendi (Authoritative Holding of the Bench)
4. Key Obiter Dicta & Overruled Precedents.

Includes bench compositions, dissenting opinions of note, and chronological updates through October 2026.`,
    price_paise: 54900, // ₹549
    original_price_paise: 109900, // ₹1,099
    category_id: "cat-5",
    cover_image_path: "/covers/case-laws-cover.png",
    pdf_storage_path: "materials/supreme_court_500_landmark_cases.pdf",
    preview_storage_path: "previews/cases_preview.pdf",
    page_count: 512,
    file_format: "PDF",
    topics: [
      {
        title: "Constitutional Bench Decisions",
        subtopics: ["Kesavananda Bharati, Maneka Gandhi, Indira Sawhney, KS Puttaswamy, Article 370 verification, Electoral Bonds judgment"],
      },
      {
        title: "Criminal Jurisprudence Precedents",
        subtopics: ["Bachan Singh & Machhi Singh (Death Penalty 'Rarest of rare'), Arnesh Kumar (Arrest guidelines), Lalita Kumari (Mandatory FIR)"],
      },
      {
        title: "Commercial & Arbitration Landmarks",
        subtopics: ["BALCO, Perkins Eastman, NN Global (Stamping & Arbitrability), Vidya Drolia"],
      },
    ],
    target_audience: [
      "Judiciary and UPSC Law Aspirants",
      "Advocates researching precedents for High Court and Supreme Court hearings",
      "CLAT PG and LL.M Entrance Candidates",
    ],
    learning_outcomes: [
      "Instantly recall the correct case law citation for any legal proposition",
      "Quote accurate paragraphs and judges' observations in written pleadings and exam answers",
    ],
    is_featured: false,
    is_published: true,
    sales_count: 980,
    rating: 4.89,
    reviews_count: 145,
    created_at: "2026-04-05T10:00:00Z",
    updated_at: "2026-10-12T16:00:00Z",
  },
  {
    id: "prod-drafting-pleadings-handbook",
    title: "High Court & Supreme Court Legal Drafting: Writs, SLPs & Commercial Pleadings",
    slug: "legal-drafting-pleadings-handbook",
    short_description: "Over 60 battle-tested drafting templates used in actual High Court & Supreme Court filings. Includes Special Leave Petitions, Public Interest Litigations, and Bail Writs.",
    description: `A master procedural companion for young advocates and judicial aspirants who want to master real-world drafting. Includes editable boilerplate clauses, verification affidavits, urgency applications, and synopsis structuring.

Covers Article 226 Writs (Quashing of FIR, challenging arbitrary administrative actions), Article 32 Writs before the Supreme Court, Article 136 Special Leave Petitions (Criminal & Civil), Commercial Summary Suits under Order XXXVII CPC, and Section 11 Arbitration Applications.`,
    price_paise: 99900, // ₹999
    original_price_paise: 189900, // ₹1,899
    category_id: "cat-6",
    cover_image_path: "/covers/drafting-cover.png",
    pdf_storage_path: "materials/high_court_drafting_handbook_templates.pdf",
    preview_storage_path: "previews/drafting_preview.pdf",
    page_count: 320,
    file_format: "PDF & Editable Clause Companion",
    topics: [
      {
        title: "High Court Constitutional Writs",
        subtopics: ["Writ of Certiorari against quasi-judicial orders", "Writ of Mandamus against statutory non-feasance", "Bail Habeas Corpus filings"],
      },
      {
        title: "Supreme Court Special Leave Petitions (SLPs)",
        subtopics: ["SLP (Civil) grounds of appeal and question of law", "SLP (Criminal) against conviction or refusal of bail"],
      },
      {
        title: "Commercial & Civil Pleadings",
        subtopics: ["Section 9 Interim Injunction petitions", "Commercial Plaints with Statement of Truth"],
      },
    ],
    target_audience: [
      "Junior Advocates entering litigation chambers",
      "Law Students participating in Moot Court Competitions",
      "Corporate In-House Counsel drafting dispute notices",
    ],
    learning_outcomes: [
      "Draft polished, courtroom-ready pleadings without clerical or jurisdictional flaws",
      "Master the subtle art of articulating questions of law in appellate petitions",
    ],
    is_featured: false,
    is_published: true,
    sales_count: 760,
    rating: 4.93,
    reviews_count: 118,
    created_at: "2026-05-12T10:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
];

export const SEED_FREE_RESOURCES = [
  {
    id: "free-1",
    title: "New Criminal Laws Section Concordance Matrix (IPC to BNS)",
    description: "Instant 12-page cheat sheet mapping every IPC section to the corresponding BNS 2023 section with notes on key changes.",
    format: "PDF (Free)",
    fileSize: "1.8 MB",
    pages: 12,
    downloadCount: "18,400+",
    pdfUrl: "/free/IPC_to_BNS_Concordance_Table.pdf",
  },
  {
    id: "free-2",
    title: "Golden Rules of Judgment Writing: Model Civil Suit",
    description: "Step-by-step judicial framework for framing issues under Order XIV CPC and structuring the operative part of a civil judgment.",
    format: "PDF (Free)",
    fileSize: "2.4 MB",
    pages: 18,
    downloadCount: "14,200+",
    pdfUrl: "/free/Judgment_Writing_Civil_Suit_Template.pdf",
  },
  {
    id: "free-3",
    title: "Article 21 Transformative Precedents Flowchart",
    description: "Visual timeline of the evolution of Right to Life & Personal Liberty from A.K. Gopalan to Maneka Gandhi and Puttaswamy.",
    format: "PDF (Free)",
    fileSize: "1.2 MB",
    pages: 6,
    downloadCount: "22,900+",
    pdfUrl: "/free/Article_21_Jurisprudence_Flowchart.pdf",
  },
  {
    id: "free-4",
    title: "Limitation Act 1963 Section 5 Condonation of Delay Checklist",
    description: "Practical guide to 'sufficient cause' standards, affidavit formats, and recent Supreme Court observations.",
    format: "PDF (Free)",
    fileSize: "1.5 MB",
    pages: 8,
    downloadCount: "9,600+",
    pdfUrl: "/free/Limitation_Act_Section_5_Checklist.pdf",
  },
];

export const SEED_TESTIMONIALS = [
  {
    id: "test-1",
    name: "Pooja Sharma",
    role: "Rank 14, Delhi Judicial Service Examination (DJS)",
    avatar: "/avatars/pooja.png",
    content: "The Constitutional Law Master Notes and the Mains Answer Writing Framework completely transformed how I framed my answers. Instead of writing general paragraphs, I started quoting exact doctrines with ratio decidendi. There is no other study material in India crafted with this degree of judicial precision.",
    rating: 5,
    verifiedPurchase: true,
  },
  {
    id: "test-2",
    name: "Rohan Varma",
    role: "Advocate, Bombay High Court",
    avatar: "/avatars/rohan.png",
    content: "When the new criminal laws came into effect, our chamber was scrambling to cross-reference IPC sections. Sir's BNS-BNSS Handbook was our daily desk reference. Clear, authoritative, and brilliantly laid out.",
    rating: 5,
    verifiedPurchase: true,
  },
  {
    id: "test-3",
    name: "Ananya Deshmukh",
    role: "Civil Judge Junior Division (CJJD) Candidate",
    avatar: "/avatars/ananya.png",
    content: "CPC used to feel impossible to retain. The visual flowcharts for Section 11 Res Judicata and Order XXI execution made the concepts click instantly. Secured 68% in Civil Law Paper I!",
    rating: 5,
    verifiedPurchase: true,
  },
  {
    id: "test-4",
    name: "Vikramaditya Rao",
    role: "LL.M Scholar, National Law School of India University (NLSIU)",
    avatar: "/avatars/vikram.png",
    content: "The landmark case law compendium provides pristine, concise facts and ratio without unnecessary noise. An indispensable companion for anyone preparing for competitive law exams.",
    rating: 5,
    verifiedPurchase: true,
  },
];

export const SEED_FAQS = [
  {
    question: "How will I receive the purchased study material?",
    answer: "Instantly upon successful payment verification through Razorpay, the purchased material will be unlocked in your personal 'My Library' account page. You can access and securely download the complete, high-resolution PDF document immediately on any device.",
  },
  {
    question: "Are the notes updated for the latest 2024–2026 criminal laws?",
    answer: "Yes, absolutely. All criminal law and judicial exam materials fully incorporate the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA), along with detailed cross-reference tables from the old colonial statutes.",
  },
  {
    question: "Can I download and print the PDF study materials?",
    answer: "Yes! Every study material is delivered as a fully searchable, high-resolution PDF that you can read offline on your iPad, tablet, laptop, or print for personal study purposes. Please note that distribution, re-uploading, or commercial resale is strictly prohibited under copyright laws.",
  },
  {
    question: "What payment methods are supported on the platform?",
    answer: "We process payments securely through Razorpay, supporting UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking across all major Indian banks, Debit Cards, Credit Cards, and Wallets in Indian Rupees (INR).",
  },
  {
    question: "Do you offer refunds on digital study materials?",
    answer: "Due to the non-returnable nature of instant digital downloads, purchases are generally final. However, in the rare event of duplicate charges, transaction errors, or technical file corruption that our support team cannot resolve within 48 hours, a full refund will be promptly issued. Please review our Refund Policy for complete details.",
  },
  {
    question: "Is this website providing legal advice for court cases?",
    answer: "No. All materials, videos, and articles published on this platform are strictly for academic, educational, and exam preparation purposes. They do not constitute personalized legal counsel or create an attorney-client relationship. If you require legal representation, please consult a licensed advocate in your jurisdiction.",
  },
];

export const SEED_PROFILE_CONFIG = {
  name: "Adv. Harshal Kodgirwar",
  designation: "Advocate, Supreme Court of India & High Court | Legal Educator",
  qualifications: "B.A. LL.B (Hons.), LL.M (Constitutional & Administrative Law)",
  barCouncilNumber: "MAH/2841/2016", // Representative configurable credential
  bio: "With over a decade of litigation experience across the High Court and Supreme Court of India, Adv. Harshal has dedicated his professional career to bridging the gap between rigorous courtroom practice and academic excellence. Through his legal education initiatives, YouTube channel, and structured study compendiums, he mentors over 150,000+ law students, judicial aspirants, and young practitioners across India.",
  socials: {
    youtube: "https://youtube.com/@harshalkodgirwar",
    instagram: "https://instagram.com/adv.harshal",
    linkedin: "https://linkedin.com/in/harshal-kodgirwar",
    twitter: "https://x.com/adv_harshal",
    telegram: "https://t.me/legalnotescommunity",
  },
  stats: {
    studentsMentored: "150,000+",
    materialsDistributed: "45,000+",
    judicialOfficersProduced: "180+",
    yearsInLitigation: "10+ Years",
  },
  contact: {
    email: "contact@advharshal.com",
    supportEmail: "support@advharshal.com",
    officeLocation: "Chambers at Supreme Court of India & High Court Bench, New Delhi / Mumbai",
    hours: "Monday – Saturday: 10:00 AM – 7:00 PM IST",
  },
};
