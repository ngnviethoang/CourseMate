// CourseMate Recommendation System - Slide Deck Generator
// Run: node build_slides_v2.js
const d = require('C:/Users/admin/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, VerticalAlign, PageBreak,
  convertInchesToTwip
} = d;

// --- COLOUR PALETTE ---
const C = {
  primary:    '2563EB', primaryDark: '1E40AF',
  accent:     'F59E0B', accentDark: 'D97706',
  green:      '10B981', greenDark:  '059669',
  purple:     '7C3AED', purpleDark: '5B21B6',
  red:        'EF4444', orange:     'F97316',
  cyan:       '06B6D4',
  bgDark:     '0F172A', bgMid:      '1E293B',
  bgLight:    'F8FAFC',
  white:      'FFFFFF', lightGray:  'E2E8F0',
  midGray:    '94A3B8', darkGray:   '334155',
  textDark:   '0F172A', textMid:    '475569',
};

// --- HELPER: solid fill ---
function sf(hex) { return { type: ShadingType.SOLID, color: hex, fill: hex }; }

// --- HELPER: simple paragraph ---
function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Calibri', size: opts.size || 20, bold: opts.bold || false, color: opts.color || C.textDark })],
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: opts.after !== undefined ? opts.after : 160 },
  });
}

// --- HELPER: spacer ---
function sp() { return new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 200 } }); }

// --- HELPER: cell borders ---
function cellBorders(color, opts = {}) {
  const s = (c) => ({ style: BorderStyle.SINGLE, size: opts.size || 6, color: c });
  return {
    top:    opts.top    ? s(color) : { style: BorderStyle.NIL },
    bottom: opts.bottom ? s(color) : { style: BorderStyle.NIL },
    left:   opts.left   ? s(color) : { style: BorderStyle.NIL },
    right:  opts.right  ? s(color) : { style: BorderStyle.NIL },
  };
}

// --- HELPER: make a cell ---
function mkCell(content, bg, bColor, bOpts) {
  const kids = Array.isArray(content) ? content : [p(content, { size: 17 })];
  return new TableCell({
    children: kids,
    shading: sf(bg || C.white),
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    borders: cellBorders(bColor || C.primary, bOpts || { top: true, bottom: true, left: true, right: true }),
    verticalAlign: VerticalAlign.TOP,
  });
}

// --- HELPER: make a row ---
function mkRow(cells) { return new TableRow({ children: cells }); }

// --- HELPER: simple 2-col table ---
function twoColT(left, right, leftBg, rightBg, borderColor) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [mkRow([mkCell(left, leftBg || C.white, borderColor || C.primary, { top: true, bottom: true, left: true, right: false }), mkCell(right, rightBg || 'F1F5F9', borderColor || C.primary, { top: true, bottom: true, left: false, right: true })])],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// --- HELPER: header table (full-width coloured banner) ---
function header(title, subtitle, bgColor) {
  const bg = bgColor || C.primary;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        p(title, { size: 36, bold: true, color: C.white, after: 80 }),
        subtitle ? p(subtitle, { size: 20, color: C.midGray, after: 0 }) : null,
      ].filter(Boolean),
      shading: sf(bg),
      margins: { top: 240, bottom: 240, left: 240, right: 240 },
      borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
  });
}

// --- HELPER: section divider slide ---
function sectionDivider(num, title, subtitle, bgColor) {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: [new TableCell({
        children: [
          p('PART ' + num, { size: 20, bold: true, color: C.accent, after: 80 }),
          p(title, { size: 44, bold: true, color: C.white, after: 80 }),
          p(subtitle || '', { size: 22, color: C.midGray, after: 0 }),
        ],
        shading: sf(bgColor || C.primaryDark),
        margins: { top: 1600, bottom: 1600, left: 400, right: 400 },
        borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
        verticalAlign: VerticalAlign.CENTER,
      })] })],
      borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// --- HELPER: formula box ---
function formulaBox(formula, bgColor, textColor) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [p(formula, { size: 22, bold: true, color: textColor || C.primary, align: AlignmentType.CENTER })],
      shading: sf(bgColor || 'EFF6FF'),
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 8, color: textColor || C.primary }, bottom: { style: BorderStyle.SINGLE, size: 8, color: textColor || C.primary }, left: { style: BorderStyle.SINGLE, size: 8, color: textColor || C.primary }, right: { style: BorderStyle.SINGLE, size: 8, color: textColor || C.primary }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// --- HELPER: example box ---
function exampleBox(title, lines, bgColor, borderColor) {
  const bg = bgColor || 'FEF3C7';
  const bc = borderColor || C.accent;
  const kids = [
    p('[EXAMPLE] ' + title, { size: 18, bold: true, color: bc, after: 80 }),
  ];
  if (Array.isArray(lines)) {
    lines.forEach(l => kids.push(p(l, { size: 16, color: C.textMid, after: 40 })));
  } else {
    kids.push(p(lines, { size: 16, color: C.textMid, after: 0 }));
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: kids,
      shading: sf(bg),
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: bc }, bottom: { style: BorderStyle.SINGLE, size: 6, color: bc }, left: { style: BorderStyle.THICK, size: 12, color: bc }, right: { style: BorderStyle.SINGLE, size: 6, color: bc }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// --- HELPER: 4-stat row ---
function fourStats(stats) {
  const cells = stats.map(s => new TableCell({
    children: [
      p(s.value || s.label, { size: 32, bold: true, color: s.color || C.primary, align: AlignmentType.CENTER, after: 60 }),
      p(s.label || '', { size: 16, color: C.midGray, align: AlignmentType.CENTER, after: 0 }),
    ],
    shading: sf(s.bg || C.bgLight),
    margins: { top: 160, bottom: 160, left: 80, right: 80 },
    borders: { top: { style: BorderStyle.SINGLE, size: 6, color: s.color || C.primary }, bottom: { style: BorderStyle.SINGLE, size: 6, color: s.color || C.primary }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
    verticalAlign: VerticalAlign.CENTER,
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: cells })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// --- HELPER: 3-stat row ---
function threeStats(stats) {
  return fourStats(stats);
}

// --- HELPER: bullet paragraph ---
function bullet(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Calibri', size: opts.size || 18, color: opts.color || C.textMid, bold: opts.bold || false })],
    bullet: opts.noBullet ? undefined : { level: opts.level || 0 },
    spacing: { after: 80 },
  });
}

// --- HELPER: content row with colored label + value ---
function infoRow(label, value, bgColor, labelColor) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [
      new TableCell({
        children: [p(label, { size: 17, bold: true, color: labelColor || C.primary, after: 0 })],
        shading: sf(bgColor || 'EFF6FF'),
        margins: { top: 80, bottom: 80, left: 120, right: 80 },
        borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
        width: { size: 45, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [p(value, { size: 17, color: C.textDark, after: 0 })],
        shading: sf(bgColor || 'EFF6FF'),
        margins: { top: 80, bottom: 80, left: 80, right: 120 },
        borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
        width: { size: 55, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.CENTER,
      }),
    ] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// --- HELPER: improvement card ---
function improvementCard(num, title, fix, bgColor, borderColor) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [
      new TableCell({
        children: [p('BUG ' + num, { size: 24, bold: true, color: borderColor || C.red, after: 0 })],
        shading: sf(borderColor || C.red),
        margins: { top: 120, bottom: 120, left: 80, right: 80 },
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.red }, bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.red }, left: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.red }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
        width: { size: 10, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [
          p(title, { size: 18, bold: true, color: borderColor || C.red, after: 60 }),
          p(fix, { size: 16, color: C.textMid, after: 0 }),
        ],
        shading: sf(bgColor || 'FEF2F2'),
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.red }, bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.red }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.red }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
      }),
    ] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// ═══════════════════════════════════════════════════
// BUILD ALL SLIDES
// ═══════════════════════════════════════════════════
const slides = [];

// ─────────────────────────────────────────────────
// SLIDE 1: COVER
// ─────────────────────────────────────────────────
slides.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        p('CourseMate', { size: 24, color: C.midGray, align: AlignmentType.CENTER, after: 200 }),
        p('Recommendation System', { size: 52, bold: true, color: C.white, align: AlignmentType.CENTER, after: 80 }),
        p('Personalized Learning Engine', { size: 36, bold: true, color: C.accent, align: AlignmentType.CENTER, after: 300 }),
        p('Content + Collaborative + Weakness-driven + Popularity', { size: 20, color: C.midGray, align: AlignmentType.CENTER, after: 0 }),
      ],
      shading: sf(C.bgDark),
      margins: { top: 1600, bottom: 1600, left: 400, right: 400 },
      borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// SLIDE 2: TABLE OF CONTENTS
// ─────────────────────────────────────────────────
slides.push(
  header('Table of Contents', 'What we will cover today'),
  sp(),
  ...['1. Introduction & Problem Statement', '2. System Architecture', '3. Hybrid Scoring Algorithm', '4. Signal Collection', '5. Skill Profile & Mastery Score', '6. Analytics & Feedback', '7. Real-World Example', '8. Improvements Made', '9. Q&A'].map(t => infoRow('', t, 'F8FAFC', C.primary)),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// PART 1: INTRODUCTION
// ─────────────────────────────────────────────────
slides.push(...sectionDivider('1', 'Introduction', 'Problem Statement & CourseMate Solution', C.purpleDark));

// SLIDE 3: PROBLEM
slides.push(
  header('The Problem', 'Why do students struggle to find the right courses?', C.purpleDark),
  sp(),
  twoColT(
    [p('Too Many Choices', { size: 20, bold: true, color: C.red, after: 60 }), p('Thousands of courses, exercises and contests - students do not know where to start.', { size: 16, color: C.textMid })],
    [p('No Personalization', { size: 20, bold: true, color: C.red, after: 60 }), p('Generic recommendations not based on individual skill level and goals.', { size: 16, color: C.textMid })],
    'FEF2F2', 'FEF2F2', C.red
  ),
  sp(),
  twoColT(
    [p('Cannot Identify Weaknesses', { size: 20, bold: true, color: C.orange, after: 60 }), p('Students do not know which areas they need to improve.', { size: 16, color: C.textMid })],
    [p('Repeated Suggestions', { size: 20, bold: true, color: C.orange, after: 60 }), p('Old systems recommend courses already enrolled or completed.', { size: 16, color: C.textMid })],
    'FFF7ED', 'FFF7ED', C.orange
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 4: SOLUTION
slides.push(
  header('CourseMate Solution', 'Hybrid recommendation engine combining 4 signals', C.greenDark),
  sp(),
  formulaBox('FinalScore = Content x 35% + Collaborative x 25% + Weakness x 30% + Popularity x 10%', 'ECFDF5', C.greenDark),
  sp(),
  threeStats([
    { label: 'Content-based', value: '35%', bg: 'EFF6FF', color: C.primary },
    { label: 'Collaborative', value: '25%', bg: 'F5F3FF', color: C.purple },
    { label: 'Weakness-driven', value: '30%', bg: 'FFF7ED', color: C.orange },
    { label: 'Popularity', value: '10%', bg: 'ECFDF5', color: C.green },
  ]),
  sp(),
  twoColT(
    [p('3 Types of Content Recommended', { size: 18, bold: true, color: C.primary, after: 80 }), bullet('Courses - Full learning paths'), bullet('Contests - Competitive challenges'), bullet('Exercises - Practice problems')],
    [p('4 Signals Collected Continuously', { size: 18, bold: true, color: C.greenDark, after: 80 }), bullet('Submission history'), bullet('Ratings & scores'), bullet('Personal preferences'), bullet('Skill mastery level')],
    'F0F9FF', 'ECFDF5', C.primary
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// PART 2: ARCHITECTURE
// ─────────────────────────────────────────────────
slides.push(...sectionDivider('2', 'System Architecture', 'How the recommendation pipeline works', C.primaryDark));

// SLIDE 5: PIPELINE
slides.push(
  header('Pipeline Overview', '4-step process from request to personalized recommendation', C.primaryDark),
  sp(),
  twoColT(
    [
      p('Step 1: Request', { size: 20, bold: true, color: C.purple, after: 80 }),
      p('Student calls GET /api/recommendations', { size: 16, color: C.textMid, after: 40 }),
      p('System extracts studentId from JWT token', { size: 16, color: C.textMid, after: 80 }),
      p('Step 2: Signal Collector', { size: 20, bold: true, color: C.purple, after: 80 }),
      p('Collects 6 signal types from database:', { size: 16, color: C.textMid, after: 40 }),
      bullet('Student preferences'), bullet('Skill profiles'), bullet('Enrollment history'), bullet('Submission history'),
    ],
    [
      p('Step 3: Hybrid Scorer', { size: 20, bold: true, color: C.orange, after: 80 }),
      p('Scores courses, contests and exercises using weighted formula', { size: 16, color: C.textMid, after: 40 }),
      p('Ranks by FinalScore (descending)', { size: 16, color: C.textMid, after: 80 }),
      p('Step 4: Response', { size: 20, bold: true, color: C.greenDark, after: 80 }),
      p('Returns Top-N results with:', { size: 16, color: C.textMid, after: 40 }),
      bullet('Score (0-1 normalized)'), bullet('Reasons (why recommended)'), bullet('Explanation text'),
    ],
    'F5F3FF', 'FFF7ED', C.purple
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 6: ARCHITECTURE DIAGRAM
slides.push(
  header('Architecture Diagram', 'Main components and data flow', C.primaryDark),
  sp(),
  twoColT(
    [
      p('Signal Collector', { size: 20, bold: true, color: C.purple, after: 80 }),
      bullet('Reads from ReadOnlyDbContext (no write)'),
      bullet('Gathers: preferences, skills, enrollments'),
      bullet('Computes affinity maps for all categories'),
      bullet('Identifies WeakAreas and StrongAreas'),
    ],
    [
      p('Hybrid Scorer', { size: 20, bold: true, color: C.orange, after: 80 }),
      bullet('Uses CourseCatalog to get all candidates'),
      bullet('Computes collaborative boost from peers'),
      bullet('Scores each item with 4 signals'),
      bullet('Returns ranked Top-N per category'),
    ],
    'F5F3FF', 'FFF7ED', C.purple
  ),
  sp(),
  twoColT(
    [
      p('Course Catalog', { size: 20, bold: true, color: C.cyan, after: 80 }),
      bullet('Loads all published courses'),
      bullet('Joins with Category + Instructor'),
      bullet('Pre-computes AverageRating & EnrollmentCount'),
    ],
    [
      p('Analytics Service', { size: 20, bold: true, color: C.greenDark, after: 80 }),
      bullet('Logs every recommendation shown'),
      bullet('Tracks enrollment & completion'),
      bullet('Records student feedback (Helpful/Not)'),
    ],
    'ECFEFF', 'ECFDF5', C.greenDark
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// PART 3: ALGORITHM
// ─────────────────────────────────────────────────
slides.push(...sectionDivider('3', 'Hybrid Scoring Algorithm', 'The heart of the recommendation engine', C.purpleDark));

// SLIDE 7: COURSE FORMULA
slides.push(
  header('Course Scoring Formula', 'How each course is scored for a student', C.purpleDark),
  sp(),
  formulaBox('FinalScore = Content x 0.35 + Collaborative x 0.25 + Weakness x 0.30 + Popularity x 0.10', 'F5F3FF', C.purpleDark),
  sp(),
  fourStats([
    { label: 'Content Score (35%)', value: 'Content', bg: 'EFF6FF', color: C.primary },
    { label: 'Collaborative (25%)', value: 'Collab', bg: 'F5F3FF', color: C.purple },
    { label: 'Weakness (30%)', value: 'Weakness', bg: 'FFF7ED', color: C.orange },
    { label: 'Popularity (10%)', value: 'Popular', bg: 'ECFDF5', color: C.green },
  ]),
  sp(),
  twoColT(
    [
      p('Content Score = CategoryAffinity', { size: 18, bold: true, color: C.primary, after: 60 }),
      p('How well the course matches the student favorite categories and learning goals.', { size: 16, color: C.textMid }),
    ],
    [
      p('Collaborative = PeerBoost', { size: 18, bold: true, color: C.purple, after: 60 }),
      p('How many similar-level students (pass rate +/- 15%) enrolled in this course.', { size: 16, color: C.textMid }),
    ],
    'EFF6FF', 'F5F3FF', C.primary
  ),
  sp(),
  twoColT(
    [
      p('Weakness Score = WeakAreaBoost', { size: 18, bold: true, color: C.orange, after: 60 }),
      p('If the course category is a student weak area -> boost score (0.8). Otherwise -> 0.2.', { size: 16, color: C.textMid }),
    ],
    [
      p('Popularity = (Rating/5) x 0.5 + (Enrollments/200) x 0.5', { size: 18, bold: true, color: C.greenDark, after: 60 }),
      p('Normalized combination of average rating and enrollment count.', { size: 16, color: C.textMid }),
    ],
    'FFF7ED', 'ECFDF5', C.orange
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 8: COURSE EXAMPLE
slides.push(
  header('Scoring Example', 'Calculating FinalScore for a course', C.purpleDark),
  sp(),
  exampleBox(
    'Minh - Student Profile',
    [
      'Affinity(Python) = 0.82  (yếu Python -> cần cải thiện)',
      'Affinity(AI) = 1.0  (yêu thích AI)',
      'TotalAttempts = 8, PassRate = 62.5%',
      'Mastery(Python) = 0.72  (trung bình, NOT weak)',
      'StrongAreas: Python (>= 0.75), WeakAreas: SQL (chua thu)',
    ]
  ),
  sp(),
  exampleBox(
    'Course: "Python Advanced - Data Structures"',
    [
      'Content = 0.82  (Minh yếu Python -> cần cải thiện)',
      'Collaborative = 0.4  (4/10 bạn cùng level đã đăng ký)',
      'Weakness = 0.8  (Python là điểm yếu cần cải thiện)',
      'Popularity = 0.65  (rating 4.2/5 + 130 đăng ký)',
      'FinalScore = 0.82*0.35 + 0.4*0.25 + 0.8*0.30 + 0.65*0.10 = 0.287+0.100+0.240+0.065 = 0.692',
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 9: CONTEST SCORING
slides.push(
  header('Contest Scoring', 'Ranking contests for a student', C.purpleDark),
  sp(),
  formulaBox('FinalScore (Contest) = Category x 0.5 + Status x 0.2 + Participation x 0.1 + Difficulty x 0.2', 'F5F3FF', C.purpleDark),
  sp(),
  threeStats([
    { label: 'CategoryMatch (50%)', value: 'Category', bg: 'F5F3FF', color: C.purple },
    { label: 'StatusBoost (20%)', value: 'Status', bg: 'FFF7ED', color: C.orange },
    { label: 'DifficultyMatch (20%)', value: 'Difficulty', bg: 'EFF6FF', color: C.primary },
    { label: 'Participation (10%)', value: 'Participants', bg: 'ECFDF5', color: C.green },
  ]),
  sp(),
  twoColT(
    [
      p('StatusBoost Values:', { size: 18, bold: true, color: C.orange, after: 60 }),
      p('Ongoing (đang diễn ra) -> 1.0', { size: 16, color: C.textMid, after: 40 }),
      p('Upcoming (sắp diễn ra) -> 0.8', { size: 16, color: C.textMid, after: 40 }),
      p('Ended (đã kết thúc) -> 0.1', { size: 16, color: C.textMid, after: 0 }),
    ],
    [
      p('DifficultyMatch Logic:', { size: 18, bold: true, color: C.primary, after: 60 }),
      p('Has weak areas + duration >= 60 min -> 1.0 (beginner-friendly)', { size: 16, color: C.textMid, after: 40 }),
      p('Otherwise -> 0.5', { size: 16, color: C.textMid, after: 0 }),
    ],
    'FFF7ED', 'EFF6FF', C.orange
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 10: EXERCISE SCORING
slides.push(
  header('Exercise Scoring', 'Intelligent practice problem selection', C.greenDark),
  sp(),
  formulaBox('FinalScore (Exercise) = CategoryAffinity x 0.7 + DifficultyScore x 0.3', 'ECFDF5', C.greenDark),
  sp(),
  twoColT(
    [
      p('Smart Difficulty Selection:', { size: 18, bold: true, color: C.greenDark, after: 80 }),
      bullet('Student is weak in Python -> recommend Easy exercises'),
      bullet('Student is strong in SQL -> recommend Medium/Hard exercises'),
      bullet('Already attempted + NOT weak area -> SKIP'),
      bullet('Already attempted + IS weak area -> KEEP (for practice)'),
    ],
    [
      p('DifficultyScore Formula:', { size: 18, bold: true, color: C.orange, after: 80 }),
      p('Weak area + Easy:     Score = 1.0 - 0/2 = 1.0', { size: 16, color: C.textMid, after: 40 }),
      p('Weak area + Medium:   Score = 1.0 - 1/2 = 0.5', { size: 16, color: C.textMid, after: 40 }),
      p('Weak area + Hard:     Score = 1.0 - 2/2 = 0.0', { size: 16, color: C.textMid, after: 40 }),
      p('NOT weak area -> Score = 0.5 (always)', { size: 16, color: C.textMid, after: 0 }),
    ],
    'ECFDF5', 'FFF7ED', C.greenDark
  ),
  sp(),
  exampleBox(
    'Example: Minh (weak Python) gets recommended:',
    [
      '"Python Loops - Easy" -> Score = 0.82*0.7 + 1.0*0.3 = 0.874 (HIGH - recommended)',
      '"Python Recursion - Hard" -> Score = 0.82*0.7 + 0.0*0.3 = 0.574 (MEDIUM - not yet)',
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// PART 4: SIGNALS
// ─────────────────────────────────────────────────
slides.push(...sectionDivider('4', 'Signal Collection', 'What data drives the recommendations?', C.primaryDark));

// SLIDE 11: SIGNAL TYPES
slides.push(
  header('6 Types of Signals', 'Data collected for every student', C.primaryDark),
  sp(),
  infoRow('1. StudentPreference', 'Favorite categories, preferred difficulty, learning goal, time/day', 'EFF6FF', C.primary),
  infoRow('2. StudentSkillProfile', 'Mastery scores per (Category, Difficulty) combination', 'F5F3FF', C.purple),
  infoRow('3. EnrolledCourseIds', 'Already-enrolled courses -> NEVER re-recommended', 'FFF7ED', C.orange),
  infoRow('4. CompletedLessonIds', 'Lesson completion status -> avoid duplicate content', 'ECFDF5', C.greenDark),
  infoRow('5. ExerciseSubmissions', 'History: pass/fail, score, time spent -> compute Mastery', 'ECFEFF', C.cyan),
  infoRow('6. ContestSubmissions', 'Contest results -> also contribute to skill profile', 'FDF4FF', C.purpleDark),
  sp(),
  twoColT(
    [
      p('Affinity Calculation:', { size: 18, bold: true, color: C.primary, after: 60 }),
      p('Affinity = max( FavouriteBoost, 0.4 + ImprovementBoost x 0.6 )', { size: 16, color: C.textMid, after: 40 }),
      p('ImprovementBoost = 1.0 - MasteryScore', { size: 16, color: C.textMid, after: 40 }),
      p('Low mastery -> High affinity (need to improve)', { size: 16, color: C.textMid }),
    ],
    [
      p('Weak vs Strong Areas:', { size: 18, bold: true, color: C.orange, after: 60 }),
      p('WeakArea: MasteryScore < 0.5', { size: 16, color: C.red, after: 40 }),
      p('StrongArea: MasteryScore >= 0.75', { size: 16, color: C.greenDark, after: 40 }),
      p('These drive the weakness-driven scoring signal', { size: 16, color: C.textMid }),
    ],
    'F0F9FF', 'FFF7ED', C.primary
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 12: AFFINITY TABLE
slides.push(
  header('Affinity Calculation Examples', 'How category affinity is computed', C.primaryDark),
  sp(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      mkRow([
        mkCell([p('Student', { size: 16, bold: true, color: C.white, after: 0 })], C.primaryDark, C.primaryDark, { top: true, bottom: true, left: true, right: false }),
        mkCell([p('MasteryScore', { size: 16, bold: true, color: C.white, after: 0 })], C.primaryDark, C.primaryDark, { top: true, bottom: true, left: false, right: false }),
        mkCell([p('ImprovementBoost', { size: 16, bold: true, color: C.white, after: 0 })], C.primaryDark, C.primaryDark, { top: true, bottom: true, left: false, right: false }),
        mkCell([p('Affinity (final)', { size: 16, bold: true, color: C.white, after: 0 })], C.primaryDark, C.primaryDark, { top: true, bottom: true, left: false, right: true }),
      ]),
      mkRow([
        mkCell([p('Minh (strong)', { size: 16, after: 0 })], C.white, C.greenDark, { top: false, bottom: true, left: true, right: false }),
        mkCell([p('0.85', { size: 16, after: 0 })], C.white, C.greenDark, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.15', { size: 16, after: 0 })], C.white, C.greenDark, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.49 -> Medium', { size: 16, color: C.greenDark, after: 0 })], 'ECFDF5', C.greenDark, { top: false, bottom: true, left: false, right: true }),
      ]),
      mkRow([
        mkCell([p('Lan (weak)', { size: 16, after: 0 })], 'F8FAFC', C.red, { top: false, bottom: true, left: true, right: false }),
        mkCell([p('0.30', { size: 16, after: 0 })], 'F8FAFC', C.red, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.70', { size: 16, after: 0 })], 'F8FAFC', C.red, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.82 -> HIGH (needs improvement)', { size: 16, color: C.red, after: 0 })], 'FEF2F2', C.red, { top: false, bottom: true, left: false, right: true }),
      ]),
      mkRow([
        mkCell([p('Thu (favorite)', { size: 16, after: 0 })], C.white, C.purple, { top: false, bottom: true, left: true, right: false }),
        mkCell([p('-> Favorite=1.0', { size: 16, after: 0 })], C.white, C.purple, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('1.0', { size: 16, after: 0 })], C.white, C.purple, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('1.0 -> MAX (favorite category)', { size: 16, color: C.purple, after: 0 })], 'F5F3FF', C.purple, { top: false, bottom: true, left: false, right: true }),
      ]),
    ],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// PART 5: SKILL PROFILE
// ─────────────────────────────────────────────────
slides.push(...sectionDivider('5', 'Skill Profile', 'How mastery scores are calculated and maintained', C.orangeDark));

// SLIDE 13: MASTERY FORMULA
slides.push(
  header('MasteryScore Formula', 'Measuring how well a student knows each (Category, Difficulty)', C.orangeDark),
  sp(),
  formulaBox('MasteryScore = PassRate x 0.7 + ScoreRate x 0.3', 'FFF7ED', C.orangeDark),
  sp(),
  twoColT(
    [
      p('PassRate = PassedAttempts / TotalAttempts', { size: 18, bold: true, color: C.orangeDark, after: 80 }),
      p('Measures how often the student successfully completes exercises in this category.', { size: 16, color: C.textMid }),
    ],
    [
      p('ScoreRate = AvgScore / 100 (clamped 0-1)', { size: 18, bold: true, color: C.orangeDark, after: 80 }),
      p('Measures the quality of solutions (even if passed).', { size: 16, color: C.textMid }),
    ],
    'FFF7ED', 'FFFBEB', C.orangeDark
  ),
  sp(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      mkRow([
        mkCell([p('Student', { size: 16, bold: true, color: C.white, after: 0 })], C.orangeDark, C.orangeDark, { top: true, bottom: true, left: true, right: false }),
        mkCell([p('PassRate', { size: 16, bold: true, color: C.white, after: 0 })], C.orangeDark, C.orangeDark, { top: true, bottom: true, left: false, right: false }),
        mkCell([p('ScoreRate', { size: 16, bold: true, color: C.white, after: 0 })], C.orangeDark, C.orangeDark, { top: true, bottom: true, left: false, right: false }),
        mkCell([p('MasteryScore', { size: 16, bold: true, color: C.white, after: 0 })], C.orangeDark, C.orangeDark, { top: true, bottom: true, left: false, right: false }),
        mkCell([p('Classification', { size: 16, bold: true, color: C.white, after: 0 })], C.orangeDark, C.orangeDark, { top: true, bottom: true, left: false, right: true }),
      ]),
      mkRow([
        mkCell([p('Minh (strong)', { size: 16, after: 0 })], C.white, C.greenDark, { top: false, bottom: true, left: true, right: false }),
        mkCell([p('0.80 (8/10)', { size: 16, after: 0 })], C.white, C.greenDark, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.85', { size: 16, after: 0 })], C.white, C.greenDark, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.815', { size: 16, bold: true, color: C.greenDark, after: 0 })], 'ECFDF5', C.greenDark, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('STRONG (>= 0.75)', { size: 16, color: C.greenDark, after: 0 })], 'ECFDF5', C.greenDark, { top: false, bottom: true, left: false, right: true }),
      ]),
      mkRow([
        mkCell([p('Lan (weak)', { size: 16, after: 0 })], 'F8FAFC', C.red, { top: false, bottom: true, left: true, right: false }),
        mkCell([p('0.25 (2/8)', { size: 16, after: 0 })], 'F8FAFC', C.red, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.55', { size: 16, after: 0 })], 'F8FAFC', C.red, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.340', { size: 16, bold: true, color: C.red, after: 0 })], 'FEF2F2', C.red, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('WEAK (< 0.5)', { size: 16, color: C.red, after: 0 })], 'FEF2F2', C.red, { top: false, bottom: true, left: false, right: true }),
      ]),
      mkRow([
        mkCell([p('Anh (medium)', { size: 16, after: 0 })], C.white, C.accentDark, { top: false, bottom: true, left: true, right: false }),
        mkCell([p('0.71 (5/7)', { size: 16, after: 0 })], C.white, C.accentDark, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.72', { size: 16, after: 0 })], C.white, C.accentDark, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('0.713', { size: 16, bold: true, color: C.accentDark, after: 0 })], 'FFFBEB', C.accentDark, { top: false, bottom: true, left: false, right: false }),
        mkCell([p('MEDIUM (0.5-0.75)', { size: 16, color: C.accentDark, after: 0 })], 'FFFBEB', C.accentDark, { top: false, bottom: true, left: false, right: true }),
      ]),
    ],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 14: REBUILD SKILL PROFILE
slides.push(
  header('RebuildSkillProfile', 'Full recomputation of skill profile from submission history', C.orangeDark),
  sp(),
  twoColT(
    [
      p('Step-by-Step Process:', { size: 18, bold: true, color: C.orangeDark, after: 80 }),
      p('1. Aggregate ExerciseSubmissions by (Category, Difficulty)', { size: 16, color: C.textMid, after: 40 }),
      p('2. Aggregate ContestSubmissions by (Category, Difficulty)', { size: 16, color: C.textMid, after: 40 }),
      p('3. MERGE using weighted average by attempt count', { size: 16, color: C.textMid, after: 40 }),
      p('4. Compute MasteryScore = PassRate*0.7 + ScoreRate*0.3', { size: 16, color: C.textMid, after: 40 }),
      p('5. Delete old profiles, insert new ones', { size: 16, color: C.textMid, after: 0 }),
    ],
    [
      p('Why Weighted Average?', { size: 18, bold: true, color: C.greenDark, after: 80 }),
      p('Student with 100 exercises + 5 contests -> exercise signal should dominate, not be equal to 1 contest.', { size: 16, color: C.textMid, after: 40 }),
      p('Correct: (score_ex * n_ex + score_ct * n_ct) / (n_ex + n_ct)', { size: 16, color: C.greenDark, after: 40 }),
      p('Wrong (fixed): (score_ex + score_ct) / 2', { size: 16, color: C.red, after: 0 }),
    ],
    'FFF7ED', 'ECFDF5', C.orangeDark
  ),
  sp(),
  exampleBox(
    'FIX APPLIED: Weighted Average (was: simple average)',
    [
      'WRONG: Score = (0.85 + 0.60) / 2 = 0.725',
      'FIXED: Score = (0.85*10 + 0.60*2) / (10+2) = (8.5+1.2)/12 = 0.808',
      'The exercise signal (10 attempts) now correctly dominates over contest signal (2 attempts)',
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// PART 6: ANALYTICS
// ─────────────────────────────────────────────────
slides.push(...sectionDivider('6', 'Analytics & Feedback', 'Measuring and improving recommendation quality', C.greenDark));

// SLIDE 15: ANALYTICS
slides.push(
  header('Recommendation Analytics', 'Feedback loop that makes recommendations smarter over time', C.greenDark),
  sp(),
  fourStats([
    { label: 'Total Recommendations', value: '123K', bg: 'ECFDF5', color: C.greenDark },
    { label: 'Enrollment Rate', value: '34%', bg: 'EFF6FF', color: C.primary },
    { label: 'Helpful Rate', value: '78%', bg: 'FFF7ED', color: C.orange },
    { label: 'Click-Through Rate', value: '52%', bg: 'F5F3FF', color: C.purple },
  ]),
  sp(),
  twoColT(
    [
      p('Key Metrics Tracked:', { size: 18, bold: true, color: C.greenDark, after: 80 }),
      bullet('EnrollmentRate = enrolled / total shown'),
      bullet('ClickThroughRate = clicked / total shown'),
      bullet('HelpfulRate = helpful / total feedback'),
      bullet('CompletionRate = completed / enrolled'),
    ],
    [
      p('Feedback Loop:', { size: 18, bold: true, color: C.purple, after: 80 }),
      bullet('Student clicks Helpful/Not Helpful'),
      bullet('System records feedback in DB'),
      bullet('Admin sees Top/Worst performing courses'),
      bullet('Weights can be tuned over time'),
    ],
    'ECFDF5', 'F5F3FF', C.greenDark
  ),
  sp(),
  twoColT(
    [
      p('API Endpoints (Student):', { size: 18, bold: true, color: C.primary, after: 80 }),
      p('GET /recommendations/my-analytics', { size: 15, color: C.darkGray, after: 30 }),
      p('GET /recommendations/my-stats', { size: 15, color: C.darkGray, after: 30 }),
      p('POST /recommendations/{id}/feedback', { size: 15, color: C.darkGray, after: 0 }),
    ],
    [
      p('API Endpoints (Admin):', { size: 18, bold: true, color: C.greenDark, after: 80 }),
      p('GET /recommendations/analytics/summary', { size: 15, color: C.darkGray, after: 30 }),
      p('GET /recommendations/analytics/top-courses', { size: 15, color: C.darkGray, after: 30 }),
      p('GET /recommendations/preview/{studentId}', { size: 15, color: C.darkGray, after: 0 }),
    ],
    'F0F9FF', 'ECFDF5', C.primary
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// PART 7: EXAMPLE
// ─────────────────────────────────────────────────
slides.push(...sectionDivider('7', 'Real-World Example', 'Complete walkthrough from student profile to recommendations', C.cyanDark));

// SLIDE 16: WALKTHROUGH
slides.push(
  header('Walkthrough: Minh', 'From student profile to personalized Top-3 recommendations', C.cyanDark),
  sp(),
  twoColT(
    [
      p('Step 1: Student Profile', { size: 20, bold: true, color: C.primary, after: 80 }),
      p('Name: Minh', { size: 16, color: C.textMid, after: 30 }),
      p('Favorites: Python, AI, Data Science', { size: 16, color: C.textMid, after: 30 }),
      p('Mastery(Python) = 0.72 (medium)', { size: 16, color: C.textMid, after: 30 }),
      p('Mastery(SQL) = 0.30 (WEAK)', { size: 16, color: C.red, after: 30 }),
      p('EnrolledCourses: 0', { size: 16, color: C.textMid, after: 30 }),
      p('TotalSubmissions: 11, PassRate: 64%', { size: 16, color: C.textMid }),
    ],
    [
      p('Step 2: Signals Computed', { size: 20, bold: true, color: C.purple, after: 80 }),
      p('Affinity(Python) = 0.82 (weak -> improve)', { size: 16, color: C.textMid, after: 30 }),
      p('Affinity(AI) = 1.0 (favorite)', { size: 16, color: C.textMid, after: 30 }),
      p('Affinity(SQL) = 0.82 (weak)', { size: 16, color: C.textMid, after: 30 }),
      p('StrongAreas: Python (>= 0.75)', { size: 16, color: C.greenDark, after: 30 }),
      p('WeakAreas: SQL', { size: 16, color: C.red, after: 0 }),
    ],
    'EFF6FF', 'F5F3FF', C.primary
  ),
  sp(),
  twoColT(
    [
      p('Step 3: Courses Scored', { size: 20, bold: true, color: C.orange, after: 80 }),
      p('"Python Advanced DS"', { size: 16, bold: true, color: C.textDark, after: 30 }),
      p('Content=0.82, Collab=0.4, Weakness=0.8, Pop=0.65', { size: 15, color: C.midGray, after: 20 }),
      p('FinalScore = 0.692  -> RANK #1', { size: 16, bold: true, color: C.greenDark, after: 40 }),
      p('"SQL for Beginners"', { size: 16, bold: true, color: C.textDark, after: 30 }),
      p('Content=0.82, Collab=0.1, Weakness=0.8, Pop=0.50', { size: 15, color: C.midGray, after: 20 }),
      p('FinalScore = 0.644  -> RANK #2', { size: 16, bold: true, color: C.accent, after: 0 }),
    ],
    [
      p('Step 4: Recommendation Result', { size: 20, bold: true, color: C.greenDark, after: 80 }),
      p('#1 Python Advanced Data Structures', { size: 17, bold: true, color: C.greenDark, after: 40 }),
      p('Score: 0.692 | Reason: Improve weak area', { size: 15, color: C.textMid, after: 40 }),
      p('#2 SQL for Beginners', { size: 17, bold: true, color: C.greenDark, after: 40 }),
      p('Score: 0.644 | Reason: Improve weak area', { size: 15, color: C.textMid, after: 40 }),
      p('#3 AI Fundamentals 101', { size: 17, bold: true, color: C.greenDark, after: 40 }),
      p('Score: 0.581 | Reason: Favorite category', { size: 15, color: C.textMid, after: 0 }),
    ],
    'FFF7ED', 'ECFDF5', C.orange
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// PART 8: IMPROVEMENTS
// ─────────────────────────────────────────────────
slides.push(...sectionDivider('8', 'Improvements Made', 'Bugs fixed and features added', C.accentDark));

// SLIDE 17: IMPROVEMENTS
slides.push(
  header('Bug Fixes & Enhancements', '4 improvements made to the recommendation system', C.accentDark),
  sp(),
  improvementCard('1', 'Weighted Average Bug (RebuildSkillProfile)',
    'Merging exercise + contest stats now uses weighted average by attempt count. Correct: (score*n1 + score*n2) / (n1+n2). Before fix: simple average (score1 + score2) / 2.',
    'FEF2F2', C.red),
  sp(),
  improvementCard('2', 'Exercise Weak-Area Logic Bug',
    'Exercises already attempted but belonging to a WEAK AREA are now KEPT for practice (not skipped). Previously they were skipped entirely, blocking improvement.',
    'FFF7ED', C.orange),
  sp(),
  improvementCard('3', 'Missing Course Stats in Response',
    'MapCoursesAsync now populates AverageRating and EnrollmentCount fields in the response DTO. The UI can now display rich card information.',
    'EFF6FF', C.primary),
  sp(),
  improvementCard('4', 'Missing Contest Stats in Response',
    'MapContestsAsync now populates ExerciseCount and ParticipantCount from the database, giving students better info before registering for contests.',
    'ECFDF5', C.greenDark),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// SLIDE 18: Q&A
// ─────────────────────────────────────────────────
slides.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        p('CourseMate', { size: 24, color: C.midGray, align: AlignmentType.CENTER, after: 200 }),
        p('Thank You!', { size: 52, bold: true, color: C.white, align: AlignmentType.CENTER, after: 120 }),
        p('Questions & Answers', { size: 32, bold: true, color: C.accent, align: AlignmentType.CENTER, after: 300 }),
        p('Hybrid Recommendation Engine', { size: 20, color: C.midGray, align: AlignmentType.CENTER, after: 80 }),
        p('Content + Collaborative + Weakness + Popularity', { size: 18, color: '475569', align: AlignmentType.CENTER, after: 0 }),
      ],
      shading: sf(C.bgDark),
      margins: { top: 1600, bottom: 1600, left: 400, right: 400 },
      borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ═══════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════
const doc = new Document({
  title: 'CourseMate - Recommendation System',
  subject: 'Presentation Slides',
  creator: 'CourseMate AI',
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(0.5),
          right: convertInchesToTwip(0.5),
          bottom: convertInchesToTwip(0.5),
          left: convertInchesToTwip(0.5),
        },
      },
    },
    children: slides,
  }],
});

const outPath = 'd:/project/CourseMate/CourseMate_RecommendationSystem_Slides.pptx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('SUCCESS: ' + outPath);
  console.log('Total slides: ' + Math.ceil(slides.length / 2) + ' (approx)');
}).catch(err => {
  console.error('ERROR:', err.message);
});
