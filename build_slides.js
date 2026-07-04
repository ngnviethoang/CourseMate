// ============================================================
// CourseMate Recommendation System — Slide Deck Generator
// Output: CourseMate_RecommendationSystem_Slides.pptx
// Usage : node build_slides.js
// ============================================================
const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, VerticalAlign,
  PageBreak, convertInchesToTwip
} = require('C:/Users/admin/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');
const path = require('path');

// ─── Colour palette ───────────────────────────────────────────
const C = {
  primary:   '2563EB',   // Royal blue
  primaryDark:'1E40AF',   // Deep blue
  accent:    'F59E0B',   // Amber
  accentDark:'D97706',
  green:     '10B981',   // Emerald
  greenDark: '059669',
  purple:    '7C3AED',   // Violet
  purpleDark:'5B21B6',
  red:       'EF4444',   // Rose
  orange:    'F97316',
  cyan:      '06B6D4',
  bgDark:    '0F172A',   // Dark navy
  bgMid:     '1E293B',
  bgLight:   'F8FAFC',
  white:     'FFFFFF',
  lightGray: 'E2E8F0',
  midGray:   '94A3B8',
  darkGray:  '334155',
  textDark:  '0F172A',
  textMid:   '475569',
  textLight: 'FFFFFF',
};

// ─── Helper: solid fill colour ────────────────────────────────
function fill(hex) { return { type: ShadingType.SOLID, color: hex, fill: hex }; }

// ─── Helper: coloured paragraph ──────────────────────────────
function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, ...opts })],
    spacing: opts.spacing || { after: 120 },
    alignment: opts.align || AlignmentType.LEFT,
    ...(opts.extra || {}),
  });
}

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 200 },
  });
}

function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 160, after: 120 },
  });
}

function h3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 120, after: 80 },
  });
}

// ─── Helper: bullet paragraph ────────────────────────────────
function bullet(text, icon, opts = {}) {
  const runs = [];
  if (icon) {
    runs.push(new TextRun({ text: icon + '  ', font: 'Segoe UI Emoji', size: opts.size || 18 }));
  }
  runs.push(new TextRun({ text, size: opts.size || 18, ...(opts.runOpts || {}) }));
  return new Paragraph({
    children: runs,
    bullet: opts.noBullet ? undefined : { level: opts.level || 0 },
    spacing: { after: 80 },
    indent: opts.indent,
  });
}

// ─── Helper: coloured card block (simulated via shaded table) ──
function cardBlock(lines, bgHex, borderHex, opts = {}) {
  const rows = lines.map((line, i) =>
    new TableRow({
      children: [new TableCell({
        children: Array.isArray(line) ? line : [
          new Paragraph({
            children: [new TextRun({ text: line, size: opts.size || 18, ...(opts.runOpts || {}) })],
            spacing: { after: 60 },
            alignment: opts.align || AlignmentType.LEFT,
          })
        ],
        shading: fill(bgHex),
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        borders: {
          top:    { style: i === 0             ? BorderStyle.SINGLE : BorderStyle.NIL, size: 6, color: borderHex },
          bottom: { style: i === lines.length-1 ? BorderStyle.SINGLE : BorderStyle.NIL, size: 6, color: borderHex },
          left:   { style: BorderStyle.SINGLE, size: 6, color: borderHex },
          right:  { style: BorderStyle.SINGLE, size: 6, color: borderHex },
        },
        verticalAlign: VerticalAlign.CENTER,
      })]
    })
  );
  return new Table({
    width: { size: opts.width || 100, type: WidthType.PERCENTAGE },
    rows,
    margins: { top: 120, bottom: 120 },
  });
}

// ─── Helper: horizontal rule ─────────────────────────────────
function hr(color = C.lightGray) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color } },
    spacing: { before: 120, after: 120 },
    children: [],
  });
}

// ─── Helper: spacer ─────────────────────────────────────────
function spacer(lines = 1) {
  return new Paragraph({ children: [new TextRun({ text: '', size: 20 })], spacing: { after: 200 * lines } });
}

// ─── Slide background helpers ────────────────────────────────
// We'll simulate background colours per slide using a full-width
// top banner (table) or a background shading trick via document
// sections.  For simplicity we use the "slide" approach: each
// slide is a section with a top coloured banner.

function slideHeader(title, subtitle, icon, bgHex = C.primary, textColor = C.white) {
  const cells = [];
  if (icon) {
    cells.push(new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: icon, font: 'Segoe UI Emoji', size: 48 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
      })],
      width: { size: 10, type: WidthType.PERCENTAGE },
      verticalAlign: VerticalAlign.CENTER,
      shading: fill(bgHex),
      margins: { top: 200, bottom: 200, left: 160, right: 0 },
    }));
  }
  cells.push(new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: title, font: 'Calibri', size: 36, bold: true, color: textColor })],
        spacing: { after: 80 },
      }),
      ...(subtitle ? [new Paragraph({
        children: [new TextRun({ text: subtitle, font: 'Calibri', size: 20, color: 'D1D5DB' })],
        spacing: { after: 0 },
      })] : []),
    ],
    width: { size: 90, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    shading: fill(bgHex),
    margins: { top: 200, bottom: 200, left: 200, right: 160 },
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: cells })],
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 0, color: C.white },
      bottom: { style: BorderStyle.SINGLE, size: 0, color: C.white },
      left:   { style: BorderStyle.SINGLE, size: 0, color: C.white },
      right:  { style: BorderStyle.SINGLE, size: 0, color: C.white },
      insideH:{ style: BorderStyle.NIL },
      insideV:{ style: BorderStyle.NIL },
    },
  });
}

// ─── Score badge (coloured pill as table) ────────────────────
function scoreBadge(label, score, bgHex, textHex = C.white) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            children: [
              new TextRun({ text: label + '  ', font: 'Calibri', size: 18, color: textHex, bold: true }),
              new TextRun({ text: score, font: 'Calibri', size: 22, bold: true, color: textHex }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
          })],
          shading: fill(bgHex),
          margins: { top: 80, bottom: 80, left: 160, right: 160 },
          borders: { top: { style: BorderStyle.SINGLE, size: 4, color: bgHex }, bottom: { style: BorderStyle.SINGLE, size: 4, color: bgHex }, left: { style: BorderStyle.SINGLE, size: 4, color: bgHex }, right: { style: BorderStyle.SINGLE, size: 4, color: bgHex } },
        }),
      ]
    })],
  });
}

// ─── 3-column stat box ──────────────────────────────────────
function threeStats(stats) { // [{icon, label, value, bg, color}]
  const cells = stats.map(s => new TableCell({
    children: [
      new Paragraph({ children: [new TextRun({ text: s.icon, font: 'Segoe UI Emoji', size: 36 })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: s.value, font: 'Calibri', size: 28, bold: true, color: s.color || C.primary })], alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: s.label, font: 'Calibri', size: 16, color: C.midGray })], alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
    ],
    shading: fill(s.bg || C.bgLight),
    margins: { top: 160, bottom: 160, left: 80, right: 80 },
    borders: { top: { style: BorderStyle.SINGLE, size: 6, color: s.color || C.primary }, bottom: { style: BorderStyle.SINGLE, size: 6, color: s.color || C.primary }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
    verticalAlign: VerticalAlign.CENTER,
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: cells })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// ─── 2-column info row ──────────────────────────────────────
function twoCol(leftItems, rightItems, divider = true) {
  const makeCell = (items, shade) => new TableCell({
    children: items,
    shading: fill(shade),
    margins: { top: 80, bottom: 80, left: 200, right: 120 },
    borders: {
      top:    { style: BorderStyle.NIL },
      bottom: { style: BorderStyle.NIL },
      left:   { style: divider ? BorderStyle.SINGLE : BorderStyle.NIL, size: 4, color: divider ? C.lightGray : 'FFFFFF' },
      right:  { style: BorderStyle.NIL },
    },
    width: { size: 50, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.TOP,
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [makeCell(leftItems, C.white), makeCell(rightItems, 'F1F5F9')] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// ─── Flow diagram (vertical arrows) ─────────────────────────
function flowBox(icon, title, desc, bgHex = C.bgLight, borderHex = C.primary) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [new TableCell({
        children: [
          new Paragraph({ children: [new TextRun({ text: icon, font: 'Segoe UI Emoji', size: 28 })], alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: title, font: 'Calibri', size: 22, bold: true, color: borderHex })], alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
          new Paragraph({ children: [new TextRun({ text: desc, font: 'Calibri', size: 16, color: C.textMid })], alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
        ],
        shading: fill(bgHex),
        margins: { top: 160, bottom: 160, left: 160, right: 160 },
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: borderHex }, bottom: { style: BorderStyle.SINGLE, size: 6, color: borderHex }, left: { style: BorderStyle.SINGLE, size: 6, color: borderHex }, right: { style: BorderStyle.SINGLE, size: 6, color: borderHex } },
        verticalAlign: VerticalAlign.CENTER,
      })] }),
    ],
  });
}

function arrowDown(label) {
  return new Paragraph({
    children: [new TextRun({ text: label || '▼', font: 'Segoe UI Emoji', size: 20, color: C.midGray })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 60 },
  });
}

// ─── Pipeline horizontal table ──────────────────────────────
function pipelineRow(steps) {
  const cells = steps.map((s, i) => new TableCell({
    children: [
      new Paragraph({ children: [new TextRun({ text: s.icon, font: 'Segoe UI Emoji', size: 28 })], alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: s.num, font: 'Calibri', size: 14, bold: true, color: s.color || C.primary })], alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: s.title, font: 'Calibri', size: 18, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: s.desc, font: 'Calibri', size: 14, color: C.textMid })], alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
    ],
    shading: fill(s.bg || C.bgLight),
    margins: { top: 120, bottom: 120, left: 60, right: 60 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 6, color: s.color || C.primary },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: s.color || C.primary },
      left:   { style: i === 0 ? BorderStyle.SINGLE : BorderStyle.NIL, size: 6, color: s.color || C.primary },
      right:  { style: BorderStyle.NIL, size: 0, color: C.white },
    },
    verticalAlign: VerticalAlign.CENTER,
    width: { size: Math.floor(100 / steps.length), type: WidthType.PERCENTAGE },
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: cells })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 0, color: C.white } },
  });
}

// ─── Example box (highlighted) ──────────────────────────────
function exampleBox(title, content, bgHex = 'FEF3C7', borderHex = C.accent) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [new TableCell({
        children: [
          new Paragraph({ children: [new TextRun({ text: '💡 VÍ DỤ', font: 'Calibri', size: 16, bold: true, color: borderHex })], spacing: { after: 60 } }),
          new Paragraph({ children: [new TextRun({ text: title, font: 'Calibri', size: 18, bold: true })], spacing: { after: 60 } }),
          ...(Array.isArray(content) ? content : [new Paragraph({ children: [new TextRun({ text: content, font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 0 } })]),
        ],
        shading: fill(bgHex),
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: borderHex }, bottom: { style: BorderStyle.SINGLE, size: 6, color: borderHex }, left: { style: BorderStyle.THICK, size: 12, color: borderHex }, right: { style: BorderStyle.SINGLE, size: 6, color: borderHex } },
      })] }),
    ],
  });
}

// ─── Section divider slide ─────────────────────────────────
function sectionSlide(number, title, subtitle, icon, bgHex = C.primaryDark) {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: [
        new TableCell({
          children: [
            new Paragraph({ children: [new TextRun({ text: icon, font: 'Segoe UI Emoji', size: 64 })], alignment: AlignmentType.CENTER, spacing: { after: 160 } }),
            new Paragraph({ children: [new TextRun({ text: `PHẦN ${number}`, font: 'Calibri', size: 20, color: C.accent, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
            new Paragraph({ children: [new TextRun({ text: title, font: 'Calibri', size: 40, bold: true, color: C.white })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
            new Paragraph({ children: [new TextRun({ text: subtitle, font: 'Calibri', size: 22, color: '94A3B8' })], alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
          ],
          shading: fill(bgHex),
          margins: { top: 800, bottom: 800, left: 400, right: 400 },
          borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
          verticalAlign: VerticalAlign.CENTER,
        })
      ] })],
      borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── Icon + text row ───────────────────────────────────────
function iconRow(icon, label, value, bgHex = C.bgLight, iconColor = C.primary) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: icon, font: 'Segoe UI Emoji', size: 24, color: iconColor })], spacing: { after: 0 } })],
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: fill(bgHex),
        margins: { top: 60, bottom: 60, left: 120, right: 80 },
        borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 0 } })],
        width: { size: 40, type: WidthType.PERCENTAGE },
        shading: fill(bgHex),
        margins: { top: 60, bottom: 60, left: 40, right: 80 },
        borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value, font: 'Calibri', size: 16, bold: true })], spacing: { after: 0 } })],
        width: { size: 50, type: WidthType.PERCENTAGE },
        shading: fill(bgHex),
        margins: { top: 60, bottom: 60, left: 40, right: 120 },
        borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
        verticalAlign: VerticalAlign.CENTER,
      }),
    ] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const SLIDES = [];

// ─── SLIDE 1: COVER ──────────────────────────────────────────
SLIDES.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: '🎓 CourseMate', font: 'Segoe UI Emoji', size: 24, color: '94A3B8' })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Hệ Thống Gợi Ý', font: 'Calibri', size: 52, bold: true, color: C.white })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: 'Cá Nhân Hóa Học Tập', font: 'Calibri', size: 36, color: C.accent })], alignment: AlignmentType.CENTER, spacing: { after: 280 } }),
        new Paragraph({ children: [new TextRun({ text: '────────────────────────────────────────────', font: 'Calibri', size: 16, color: '334155' })], alignment: AlignmentType.CENTER, spacing: { after: 280 } }),
        new Paragraph({ children: [new TextRun({ text: '📊 Hybrid Recommendation Engine', font: 'Calibri', size: 24, color: '64748B' })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: 'Content-based + Collaborative + Weakness-driven', font: 'Calibri', size: 20, color: '475569' })], alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
      ],
      shading: fill(C.bgDark),
      margins: { top: 1600, bottom: 1600, left: 400, right: 400 },
      borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SLIDE 2: MỤC LỤC ─────────────────────────────────────────
SLIDES.push(
  slideHeader('📋 Mục Lục', 'Nội dung trình bày', ''),
  spacer(),
  ...['Giới thiệu tổng quan', 'Kiến trúc hệ thống', 'Thuật toán gợi ý (Hybrid Scoring)', 'Thu thập tín hiệu (Signal Collector)', 'Kỹ năng & Điểm yếu (Skill Profile)', 'Analytics & Phản hồi', 'Ví dụ thực tế', 'Các cải tiến đã thực hiện', 'Demo / Q&A'].map((item, i) =>
    iconRow('🔹', `Phần ${i + 1}`, item, i % 2 === 0 ? C.white : 'F8FAFC', C.primary)
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 1: TỔNG QUAN ────────────────────────────────────
SLIDES.push(...sectionSlide(1, 'Tổng Quan Hệ Thống', 'Hệ thống gợi ý là gì và tại sao cần nó?', '🔍'));

// SLIDE 3: PROBLEM STATEMENT
SLIDES.push(
  slideHeader('😓 Bài Toán Thực Tế', 'Học viên gặp khó khăn gì khi tìm khóa học?', '😓', C.purpleDark),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [
          new Paragraph({ children: [new TextRun({ text: '❌ Quá nhiều lựa chọn', font: 'Calibri', size: 22, bold: true, color: C.red })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: 'Hàng nghìn khóa học, bài tập, cuộc thi — học viên không biết bắt đầu từ đâu.', font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 0 } }),
        ], shading: fill('FEF2F2'), margins: { top: 160, bottom: 160, left: 200, right: 120 }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.red }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.red }, left: { style: BorderStyle.SINGLE, size: 6, color: C.red }, right: { style: BorderStyle.NIL } }),
        new TableCell({ children: [
          new Paragraph({ children: [new TextRun({ text: '❌ Không cá nhân hóa', font: 'Calibri', size: 22, bold: true, color: C.red })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: 'Gợi ý chung chung, không dựa trên trình độ và mục tiêu cá nhân của từng học viên.', font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 0 } }),
        ], shading: fill('FEF2F2'), margins: { top: 160, bottom: 160, left: 120, right: 200 }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.red }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.red }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 6, color: C.red } }),
      ] }),
      new TableRow({ children: [
        new TableCell({ children: [
          new Paragraph({ children: [new TextRun({ text: '❌ Không biết điểm yếu', font: 'Calibri', size: 22, bold: true, color: C.red })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: 'Học viên không nhận ra mình còn yếu ở đâu để cải thiện đúng hướng.', font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 0 } }),
        ], shading: fill('FFF7ED'), margins: { top: 160, bottom: 160, left: 200, right: 120 }, borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, left: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, right: { style: BorderStyle.NIL } }),
        new TableCell({ children: [
          new Paragraph({ children: [new TextRun({ text: '❌ Gợi ý lặp lại', font: 'Calibri', size: 22, bold: true, color: C.red })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: 'Hệ thống cũ gợi ý lại khóa học học viên đã đăng ký hoặc đã hoàn thành.', font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 0 } }),
        ], shading: fill('FFF7ED'), margins: { top: 160, bottom: 160, left: 120, right: 200 }, borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 6, color: C.orange } }),
      ] }),
    ],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  spacer(),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 4: GIẢI PHÁP
SLIDES.push(
  slideHeader('✅ Giải Pháp Của CourseMate', 'Hệ thống gợi ý lai ghép 4 tín hiệu', '✅', C.greenDark),
  spacer(),
  pipelineRow([
    { icon: '🎯', num: '1', title: 'Content-based', desc: 'Khớp với sở thích\ndanh mục yêu thích', color: C.primary, bg: 'EFF6FF' },
    { icon: '👥', num: '2', title: 'Collaborative', desc: 'Bạn cùng trình độ\nđã học gì?', color: C.purple, bg: 'F5F3FF' },
    { icon: '🧠', num: '3', title: 'Weakness-driven', desc: 'Lấp điểm yếu\nbằng bài tập phù hợp', color: C.orange, bg: 'FFF7ED' },
    { icon: '🔥', num: '4', title: 'Popularity', desc: 'Khóa học được\nyêu thích nhất', color: C.green, bg: 'ECFDF5' },
  ]),
  spacer(0.5),
  hr(),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [
      new TableCell({ children: [
        new Paragraph({ children: [new TextRun({ text: '📦 3 Loại Nội Dung Được Gợi Ý', font: 'Calibri', size: 20, bold: true, color: C.primary })], spacing: { after: 80 } }),
        bullet('📚  Khóa học (Course)', '✅', { size: 17 }),
        bullet('🏆  Cuộc thi (Contest)', '✅', { size: 17 }),
        bullet('💪  Bài tập (Exercise)', '✅', { size: 17 }),
      ], shading: fill('F0F9FF'), margins: { top: 120, bottom: 120, left: 200, right: 120 }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, left: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, right: { style: BorderStyle.NIL } }),
      new TableCell({ children: [
        new Paragraph({ children: [new TextRun({ text: '🔄 4 Tín Hiệu Cập Nhật Liên Tục', font: 'Calibri', size: 20, bold: true, color: C.green })], spacing: { after: 80 } }),
        bullet('📝  Lịch sử bài nộp', '🔄', { size: 17 }),
        bullet('⭐  Đánh giá & điểm số', '🔄', { size: 17 }),
        bullet('🎯  Sở thích cá nhân', '🔄', { size: 17 }),
        bullet('📊  Trình độ (mastery)', '🔄', { size: 17 }),
      ], shading: fill('ECFDF5'), margins: { top: 120, bottom: 120, left: 120, right: 200 }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.green }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.green }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 6, color: C.green } }),
    ] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 2: KIẾN TRÚC ───────────────────────────────────
SLIDES.push(...sectionSlide(2, 'Kiến Trúc Hệ Thống', 'Từ request đến gợi ý cá nhân hóa', '🏗️', C.primaryDark));

// SLIDE 5: ARCHITECTURE OVERVIEW
SLIDES.push(
  slideHeader('🏗️ Tổng Quan Kiến Trúc', '4 thành phần chính trong pipeline', '🏗️', C.primaryDark),
  spacer(),
  flowBox('👤', '1. Người Dùng Gửi Yêu Cầu',
    'Student → GET /api/recommendations\nLấy Top-N gợi ý cá nhân hóa', 'EFF6FF', C.primary),
  arrowDown(),
  flowBox('📡', '2. Signal Collector',
    'Thu thập 6 loại tín hiệu:\n• Sở thích  • Kỹ năng  • Hành vi', 'F5F3FF', C.purple),
  arrowDown(),
  flowBox('⚙️', '3. Hybrid Scorer',
    'Chấm điểm 4 chiều:\nContent + Collab + Weakness + Popularity', 'FFF7ED', C.orange),
  arrowDown(),
  flowBox('📦', '4. Response DTO',
    'Trả về Courses + Contests + Exercises\nkèm lý do & điểm số', 'ECFDF5', C.green),
  spacer(),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 6: PIPELINE DETAIL
SLIDES.push(
  slideHeader('⚙️ Pipeline Chi Tiết', 'Luồng xử lý từ đầu vào đến kết quả', '⚙️', C.primaryDark),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [
          new Paragraph({ children: [new TextRun({ text: '🔍 Thu thập tín hiệu (SignalCollector)', font: 'Calibri', size: 18, bold: true, color: C.purple })], spacing: { after: 80 } }),
          bullet('Lấy StudentPreference (sở thích)', '→', { size: 16 }),
          bullet('Lấy StudentSkillProfile (kỹ năng)', '→', { size: 16 }),
          bullet('Lấy Enrollments (khóa đã đăng ký)', '→', { size: 16 }),
          bullet('Tính WeakAreas / StrongAreas', '→', { size: 16 }),
        ], shading: fill('F5F3FF'), margins: { top: 120, bottom: 120, left: 160, right: 120 }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.purple }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.purple }, left: { style: BorderStyle.SINGLE, size: 6, color: C.purple }, right: { style: BorderStyle.NIL } }),
        new TableCell({ children: [
          new Paragraph({ children: [new TextRun({ text: '📊 Chấm điểm lai ghép (Hybrid Scorer)', font: 'Calibri', size: 18, bold: true, color: C.orange })], spacing: { after: 80 } }),
          bullet('ScoreCourses → Top-N khóa học', '→', { size: 16 }),
          bullet('ScoreContests → Top-N cuộc thi', '→', { size: 16 }),
          bullet('ScoreExercises → Top-N bài tập', '→', { size: 16 }),
          bullet('Xếp hạng theo FinalScore', '→', { size: 16 }),
        ], shading: fill('FFF7ED'), margins: { top: 120, bottom: 120, left: 120, right: 160 }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 6, color: C.orange } }),
      ] }),
      new TableRow({ children: [
        new TableCell({ children: [
          new Paragraph({ children: [new TextRun({ text: '🗺️  Catalog & Cache (CourseCatalog)', font: 'Calibri', size: 18, bold: true, color: C.cyan })], spacing: { after: 80 } }),
          bullet('Lấy danh sách khóa học published', '→', { size: 16 }),
          bullet('Join Category + Instructor', '→', { size: 16 }),
          bullet('Tính AverageRating + EnrollmentCount', '→', { size: 16 }),
        ], shading: fill('ECFEFF'), margins: { top: 120, bottom: 120, left: 160, right: 120 }, borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.cyan }, left: { style: BorderStyle.SINGLE, size: 6, color: C.cyan }, right: { style: BorderStyle.NIL } }),
        new TableCell({ children: [
          new Paragraph({ children: [new TextRun({ text: '📝 Phản hồi & Ghi log (Analytics)', font: 'Calibri', size: 18, bold: true, color: C.green })], spacing: { after: 80 } }),
          bullet('Log RecommendationAnalytics', '→', { size: 16 }),
          bullet('Ghi nhận feedback (Helpful/Not)', '→', { size: 16 }),
          bullet('Tracking enrollment & completion', '→', { size: 16 }),
        ], shading: fill('ECFDF5'), margins: { top: 120, bottom: 120, left: 120, right: 160 }, borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.green }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 6, color: C.green } }),
      ] }),
    ],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 3: THUẬT TOÁN ──────────────────────────────────
SLIDES.push(...sectionSlide(3, 'Thuật Toán Gợi Ý', 'Hybrid Scoring — công thức tính điểm gợi ý', '🧮', C.purpleDark));

// SLIDE 7: FORMULA
SLIDES.push(
  slideHeader('📐 Công Thức Tính Điểm', 'FinalScore = tổng có trọng số của 4 tín hiệu', '📐', C.purpleDark),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: 'FinalScore = Content × 0.35 + Collaborative × 0.25 + Weakness × 0.30 + Popularity × 0.10', font: 'Consolas', size: 20, bold: true, color: C.purple })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
        new Paragraph({ children: [new TextRun({ text: '─────────────────────────────────────────────────────────────────────────────────────────────', font: 'Calibri', size: 14, color: 'CBD5E1' })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
      ],
      shading: fill('F5F3FF'),
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 8, color: C.purple }, bottom: { style: BorderStyle.SINGLE, size: 8, color: C.purple }, left: { style: BorderStyle.SINGLE, size: 8, color: C.purple }, right: { style: BorderStyle.SINGLE, size: 8, color: C.purple } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  spacer(),
  threeStats([
    { icon: '🎯', label: 'Content-based', value: '35%', bg: 'EFF6FF', color: C.primary },
    { icon: '👥', label: 'Collaborative', value: '25%', bg: 'F5F3FF', color: C.purple },
    { icon: '🧠', label: 'Weakness-driven', value: '30%', bg: 'FFF7ED', color: C.orange },
    { icon: '🔥', label: 'Popularity', value: '10%', bg: 'ECFDF5', color: C.green },
  ]),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '🎯 Content Score', font: 'Calibri', size: 18, bold: true, color: C.primary })], spacing: { after: 40 } }), new Paragraph({ children: [new TextRun({ text: 'Độ khớp với danh mục yêu thích & mục tiêu học tập của học viên', font: 'Calibri', size: 15, color: C.textMid })], spacing: { after: 0 } })], shading: fill('F8FAFC'), margins: { top: 80, bottom: 80, left: 120, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.primary }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.primary }, left: { style: BorderStyle.SINGLE, size: 4, color: C.primary }, right: { style: BorderStyle.SINGLE, size: 4, color: C.primary } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '👥 Collaborative Score', font: 'Calibri', size: 18, bold: true, color: C.purple })], spacing: { after: 40 } }), new Paragraph({ children: [new TextRun({ text: 'Tìm học viên cùng trình độ (pass-rate ±15%) đã đăng ký khóa nào → gợi ý khóa đó', font: 'Calibri', size: 15, color: C.textMid })], spacing: { after: 0 } })], shading: fill('F8FAFC'), margins: { top: 80, bottom: 80, left: 80, right: 120 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.purple }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.purple }, left: { style: BorderStyle.SINGLE, size: 4, color: C.purple }, right: { style: BorderStyle.SINGLE, size: 4, color: C.purple } }),
      ] }),
      new TableRow({ children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '🧠 Weakness Score', font: 'Calibri', size: 18, bold: true, color: C.orange })], spacing: { after: 40 } }), new Paragraph({ children: [new TextRun({ text: 'Ưu tiên khóa học thuộc danh mục mà học viên có MasteryScore < 0.5 (điểm yếu)', font: 'Calibri', size: 15, color: C.textMid })], spacing: { after: 0 } })], shading: fill('FFFBEB'), margins: { top: 80, bottom: 80, left: 120, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.accent }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.accent }, left: { style: BorderStyle.SINGLE, size: 4, color: C.accent }, right: { style: BorderStyle.SINGLE, size: 4, color: C.accent } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '🔥 Popularity Score', font: 'Calibri', size: 18, bold: true, color: C.green })], spacing: { after: 40 } }), new Paragraph({ children: [new TextRun({ text: 'Rating trung bình (50%) + Số lượng học viên đăng ký (50%), chuẩn hóa 0–1', font: 'Calibri', size: 15, color: C.textMid })], spacing: { after: 0 } })], shading: fill('ECFDF5'), margins: { top: 80, bottom: 80, left: 80, right: 120 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.green }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.green }, left: { style: BorderStyle.SINGLE, size: 4, color: C.green }, right: { style: BorderStyle.SINGLE, size: 4, color: C.green } }),
      ] }),
    ],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 8: MASTER FORMULA
SLIDES.push(
  slideHeader('📊 Công Thức Chi Tiết Từng Tín Hiệu', 'Cách mỗi thành phần được tính toán', '📊', C.purpleDark),
  spacer(),
  ...['🎯 Content Score = CategoryAffinity (0–1) — khớp với sở thích học viên',
      '👥 Collaborative Score = peer_count / 10 (0–1) — số bạn cùng trình độ đã đăng ký khóa đó',
      '🧠 Weakness Score = IsWeakArea ? 0.8 : 0.2 — ưu tiên khóa trong danh mục yếu',
      '🔥 Popularity Score = (rating/5)×0.5 + (enrollments/200)×0.5 — rating + số lượng đăng ký'
  ].map((item, i) => {
    const colors = [C.primary, C.purple, C.orange, C.green];
    const bgs = ['EFF6FF', 'F5F3FF', 'FFF7ED', 'ECFDF5'];
    return iconRow('🔸', `Tín hiệu ${i + 1}`, item, C.white, colors[i]);
  }),
  spacer(),
  exampleBox(
    'Ví dụ thực tế: Tính FinalScore cho khóa học "Python Cơ Bản"',
    [
      new Paragraph({ children: [new TextRun({ text: 'Content = 0.9  (học viên thích Python)', font: 'Calibri', size: 16 })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: 'Collab = 0.4  (3/10 bạn cùng level đã học)', font: 'Calibri', size: 16 })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: 'Weakness = 0.8 (học viên yếu Python)', font: 'Calibri', size: 16 })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: 'Popularity = 0.65  (rating 4.2/5 + 130 đăng ký)', font: 'Calibri', size: 16 })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: 'FinalScore = 0.9×0.35 + 0.4×0.25 + 0.8×0.30 + 0.65×0.10 = 0.710', font: 'Calibri', size: 18, bold: true, color: C.purple })], spacing: { after: 0 } }),
    ],
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 9: CONTEST SCORING
SLIDES.push(
  slideHeader('🏆 Gợi Ý Cuộc Thi', 'Cách chấm điểm và xếp hạng cuộc thi phù hợp', '🏆', C.purpleDark),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: 'FinalScore (Contest) = CategoryMatch×0.5 + StatusBoost×0.2 + ParticipationBoost×0.1 + DifficultyMatch×0.2', font: 'Consolas', size: 18, bold: true, color: C.purple })], alignment: AlignmentType.CENTER, spacing: { after: 120 } })],
      shading: fill('F5F3FF'),
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 8, color: C.purple }, bottom: { style: BorderStyle.SINGLE, size: 8, color: C.purple }, left: { style: BorderStyle.SINGLE, size: 8, color: C.purple }, right: { style: BorderStyle.SINGLE, size: 8, color: C.purple } },
    })] })],
  }),
  spacer(),
  threeStats([
    { icon: '📂', label: 'CategoryMatch', value: '50%', bg: 'F5F3FF', color: C.purple },
    { icon: '⏰', label: 'StatusBoost', value: '20%', bg: 'FFF7ED', color: C.orange },
    { icon: '👥', label: 'Participation', value: '10%', bg: 'ECFDF5', color: C.green },
    { icon: '📊', label: 'DifficultyMatch', value: '20%', bg: 'EFF6FF', color: C.primary },
  ]),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: '⚠️  StatusBoost:', font: 'Calibri', size: 17, bold: true, color: C.orange })], spacing: { after: 40 } }),
        new Paragraph({ children: [new TextRun({ text: '• Ongoing (đang diễn ra) → 1.0', font: 'Calibri', size: 16 })], spacing: { after: 20 } }),
        new Paragraph({ children: [new TextRun({ text: '• Upcoming (sắp diễn ra) → 0.8', font: 'Calibri', size: 16 })], spacing: { after: 20 } }),
        new Paragraph({ children: [new TextRun({ text: '• Ended (đã kết thúc) → 0.1', font: 'Calibri', size: 16 })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: '⚠️  DifficultyMatch:', font: 'Calibri', size: 17, bold: true, color: C.primary })], spacing: { after: 40 } }),
        new Paragraph({ children: [new TextRun({ text: '• Có điểm yếu + Duration ≥ 60 phút → 1.0 (phù hợp người mới)', font: 'Calibri', size: 16 })], spacing: { after: 20 } }),
        new Paragraph({ children: [new TextRun({ text: '• Ngược lại → 0.5', font: 'Calibri', size: 16 })], spacing: { after: 0 } }),
      ],
      shading: fill('FFFBEB'),
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.accent }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent }, left: { style: BorderStyle.THICK, size: 12, color: C.accent }, right: { style: BorderStyle.SINGLE, size: 6, color: C.accent } },
    })] })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 10: EXERCISE SCORING
SLIDES.push(
  slideHeader('💪 Gợi Ý Bài Tập', 'Cách hệ thống chọn bài tập luyện tập', '💪', C.greenDark),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: 'FinalScore (Exercise) = CategoryAffinity × 0.7 + DifficultyScore × 0.3', font: 'Consolas', size: 20, bold: true, color: C.green })], alignment: AlignmentType.CENTER, spacing: { after: 0 } })],
      shading: fill('ECFDF5'),
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 8, color: C.green }, bottom: { style: BorderStyle.SINGLE, size: 8, color: C.green }, left: { style: BorderStyle.SINGLE, size: 8, color: C.green }, right: { style: BorderStyle.SINGLE, size: 8, color: C.green } },
    })] })],
  }),
  spacer(),
  twoCol([
    new Paragraph({ children: [new TextRun({ text: '🧠 Nguyên tắc thông minh', font: 'Calibri', size: 18, bold: true, color: C.green })], spacing: { after: 80 } }),
    bullet('Học viên yếu → gợi bài Dễ (Easy)', '→', { size: 16 }),
    bullet('Học viên mạnh → gợi bài Trung bình/Khó', '→', { size: 16 }),
    bullet('Đã làm rồi + không phải điểm yếu → bỏ qua', '→', { size: 16 }),
    bullet('Đã làm rồi + THUỘC điểm yếu → GIỮ LẠI', '→', { size: 16 }),
  ], [
    new Paragraph({ children: [new TextRun({ text: '📊 DifficultyScore thông minh', font: 'Calibri', size: 18, bold: true, color: C.orange })], spacing: { after: 80 } }),
    bullet('Weak area + Easy → Score = 1.0 − 0/2 = 1.0', '→', { size: 16 }),
    bullet('Weak area + Medium → Score = 1.0 − 1/2 = 0.5', '→', { size: 16 }),
    bullet('Weak area + Hard → Score = 1.0 − 2/2 = 0.0', '→', { size: 16 }),
    bullet('Không weak → luôn = 0.5', '→', { size: 16 }),
  ]),
  spacer(),
  exampleBox(
    'Ví dụ: Học viên Yếu Python muốn cải thiện',
    'Bài "Python: Vòng lặp For (Easy)" → Score = 0.9×0.7 + 1.0×0.3 = 0.930 ✅ Rất phù hợp\nBài "Python: Đệ quy (Hard)" → Score = 0.9×0.7 + 0.0×0.3 = 0.630 ⚠️ Chưa phù hợp',
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 4: SIGNAL COLLECTOR ────────────────────────────
SLIDES.push(...sectionSlide(4, 'Thu Thập Tín Hiệu', 'Signal Collector — bộ não thu thập dữ liệu học viên', '📡', C.primaryDark));

// SLIDE 11: SIGNAL TYPES
SLIDES.push(
  slideHeader('📡 Signal Collector', '6 loại tín hiệu thu thập từ học viên', '📡', C.primaryDark),
  spacer(),
  ...[
    { icon: '❤️', label: 'StudentPreference', desc: 'Danh mục yêu thích, độ khó mong muốn, mục tiêu học tập, thời gian mỗi ngày', color: C.red, bg: 'FEF2F2' },
    { icon: '🧠', label: 'StudentSkillProfile', desc: 'Điểm số theo (Category × Difficulty), tỷ lệ đậu, thời gian làm bài', color: C.orange, bg: 'FFF7ED' },
    { icon: '📚', label: 'EnrolledCourseIds', desc: 'Danh sách khóa học đã đăng ký — hệ thống KHÔNG gợi ý lại các khóa này', color: C.primary, bg: 'EFF6FF' },
    { icon: '✅', label: 'CompletedLessonIds', desc: 'Danh sách bài học đã hoàn thành — tránh lặp lại nội dung', color: C.green, bg: 'ECFDF5' },
    { icon: '📝', label: 'Exercise Submissions', desc: 'Lịch sử nộp bài (đậu/rớt, điểm số) — dùng tính MasteryScore', color: C.cyan, bg: 'ECFEFF' },
    { icon: '💬', label: 'Contest Submissions', desc: 'Kết quả thi đấu — tham gia tính Weakness/Strength profile', color: C.purple, bg: 'F5F3FF' },
  ].map(s => new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: `${s.icon}  ${s.label}`, font: 'Calibri', size: 20, bold: true, color: s.color })], spacing: { after: 40 } }),
        new Paragraph({ children: [new TextRun({ text: s.desc, font: 'Calibri', size: 17, color: C.textMid })], spacing: { after: 0 } }),
      ],
      shading: fill(s.bg),
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: s.color }, bottom: { style: BorderStyle.SINGLE, size: 6, color: s.color }, left: { style: BorderStyle.THICK, size: 10, color: s.color }, right: { style: BorderStyle.SINGLE, size: 6, color: s.color } },
    })] })],
  })),
  spacer(),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 12: AFFINITY
SLIDES.push(
  slideHeader('🔗 Category Affinity Map', 'Cách hệ thống tính mức độ quan tâm đến từng danh mục', '🔗', C.primaryDark),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: '📐 Công thức Affinity', font: 'Calibri', size: 20, bold: true, color: C.primary })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: 'Affinity = max( FavouriteBoost, 0.4 + ImprovementBoost × 0.6 )', font: 'Consolas', size: 18, color: C.textDark })], spacing: { after: 40 } }),
        new Paragraph({ children: [new TextRun({ text: 'Trong đó: ImprovementBoost = 1.0 − MasteryScore (yếu → cao, mạnh → thấp)', font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 0 } }),
      ],
      shading: fill('EFF6FF'),
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, left: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, right: { style: BorderStyle.SINGLE, size: 6, color: C.primary } },
    })] })],
  }),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Học viên', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.primaryDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark } } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'MasteryScore', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.primaryDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark } } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ImprovementBoost', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.primaryDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark } } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Affinity cuối', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.primaryDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.primaryDark } } }),
      ] }),
      ...[
        ['Minh (mạnh Python)', '0.85', '0.15', '0.49 → Trung bình', C.green],
        ['Lan (yếu Python)', '0.30', '0.70', '0.82 → Cao (yếu→cần cải thiện)', C.orange],
        ['Anh (trung bình SQL)', '0.55', '0.45', '0.67 → Khá', C.cyan],
        ['Thu (yêu thích AI)', '→ Favourite=1.0', '→ 1.0', '1.0 → Rất cao (sở thích)', C.purple],
      ].map(row => new TableRow({ children: row.map((cell, ci) => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: cell, font: 'Calibri', size: 15, color: ci === 3 ? (row[4]) : C.textDark })], alignment: AlignmentType.CENTER })], shading: fill(ci === 3 ? 'F8FAFC' : C.white), margins: { top: 60, bottom: 60, left: 60, right: 60 }, borders: { top: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray }, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray }, left: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray }, right: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray } } })) })),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 5: SKILL PROFILE ────────────────────────────────
SLIDES.push(...sectionSlide(5, 'Hồ Sơ Kỹ Năng', 'Skill Profile — xác định điểm mạnh & điểm yếu', '🧠', C.orangeDark));

// SLIDE 13: MASTER
SLIDES.push(
  slideHeader('🧠 Công Thức MasteryScore', 'Điểm thành thạo = tỷ lệ đậu × 0.7 + điểm trung bình × 0.3', '🧠', C.orangeDark),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: 'MasteryScore = PassRate × 0.7 + ScoreRate × 0.3', font: 'Consolas', size: 22, bold: true, color: C.orange })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: 'Trong đó:', font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: 'PassRate = Số lần đậu ÷ Tổng số lần nộp', font: 'Consolas', size: 18, color: C.textDark })], spacing: { after: 20 } }),
      new Paragraph({ children: [new TextRun({ text: 'ScoreRate = Điểm trung bình ÷ 100  (clamp 0–1)', font: 'Consolas', size: 18, color: C.textDark })], spacing: { after: 0 } })],
      shading: fill('FFF7ED'),
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 8, color: C.orange }, bottom: { style: BorderStyle.SINGLE, size: 8, color: C.orange }, left: { style: BorderStyle.SINGLE, size: 8, color: C.orange }, right: { style: BorderStyle.SINGLE, size: 8, color: C.orange } },
    })] })],
  }),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Học viên', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.orangeDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark } } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Pass/Total', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.orangeDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark } } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Avg Score', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.orangeDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark } } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'MasteryScore', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.orangeDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark } } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Phân loại', font: 'Calibri', size: 16, bold: true, color: C.white })], alignment: AlignmentType.CENTER })], shading: fill(C.orangeDark), margins: { top: 80, bottom: 80, left: 80, right: 80 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, left: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark }, right: { style: BorderStyle.SINGLE, size: 4, color: C.orangeDark } } }),
      ] }),
      ...[
        ['Minh', '8/10 = 0.80', '85/100 = 0.85', '0.80×0.7+0.85×0.3 = 0.815', '✅ Mạnh (≥0.75)', C.green],
        ['Lan', '2/8 = 0.25', '55/100 = 0.55', '0.25×0.7+0.55×0.3 = 0.340', '⚠️ YẾU (<0.5)', C.red],
        ['Anh', '5/7 ≈ 0.71', '72/100 = 0.72', '0.71×0.7+0.72×0.3 = 0.713', '🟡 Trung bình', C.accent],
      ].map(row => new TableRow({ children: row.map((cell, ci) => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: cell, font: 'Calibri', size: 15, color: ci === 4 ? row[5] : C.textDark })], alignment: AlignmentType.CENTER })], shading: fill(ci === 4 ? 'F8FAFC' : C.white), margins: { top: 60, bottom: 60, left: 60, right: 60 }, borders: { top: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray }, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray }, left: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray }, right: { style: BorderStyle.SINGLE, size: 2, color: C.lightGray } } })) })),
    ],
  }),
  spacer(),
  new Paragraph({ children: [new TextRun({ text: '⚠️  Ngưỡng yếu: MasteryScore < 0.5 → IsWeakArea = true', font: 'Calibri', size: 16, bold: true, color: C.red })], spacing: { after: 0 } }),
  new Paragraph({ children: [new PageBreak()] }),
);

// SLIDE 14: REBUILD SKILL PROFILE
SLIDES.push(
  slideHeader('🔄 RebuildSkillProfile', 'Tái tính toán toàn bộ hồ sơ kỹ năng từ lịch sử', '🔄', C.orangeDark),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [new TableCell({
        children: [
          new Paragraph({ children: [new TextRun({ text: '🔄 Luồng RebuildSkillProfile', font: 'Calibri', size: 20, bold: true, color: C.orange })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: '① Tổng hợp ExerciseSubmissions (bài nộp)', 'Consolas', size: 16 })], spacing: { after: 40 } }),
          new Paragraph({ children: [new TextRun({ text: '② Tổng hợp ContestSubmissions (kết quả thi)', 'Consolas', size: 16 })], spacing: { after: 40 } }),
          new Paragraph({ children: [new TextRun({ text: '③ Gộp theo (Category, Difficulty) — Trọng số theo số lần nộp ⚠️ [ĐÃ SỬA]', 'Consolas', size: 16, color: C.green })], spacing: { after: 40 } }),
          new Paragraph({ children: [new TextRun({ text: '④ Tính MasteryScore = PassRate×0.7 + ScoreRate×0.3', 'Consolas', size: 16 })], spacing: { after: 40 } }),
          new Paragraph({ children: [new TextRun({ text: '⑤ Xóa profile cũ → Insert profile mới', 'Consolas', size: 16 })], spacing: { after: 0 } }),
        ],
        shading: fill('FFF7ED'),
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, left: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, right: { style: BorderStyle.SINGLE, size: 6, color: C.orange } },
      })] })],
  }),
  spacer(),
  exampleBox(
    '⚠️  Bug đã sửa: Weighted Average thay vì Simple Average',
    'Trước (sai):  Score = (score_existing + score_contest) / 2\nSau (đúng):    Score = (score_existing × count_existing + score_contest × count_contest) / (count_existing + count_contest)\n→ Đảm bảo tín hiệu có nhiều dữ liệu hơn có trọng số lớn hơn!',
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 6: ANALYTICS ───────────────────────────────────
SLIDES.push(...sectionSlide(6, 'Analytics & Phản Hồi', 'Theo dõi hiệu quả và cải thiện hệ thống', '📊', C.greenDark));

// SLIDE 15: ANALYTICS
SLIDES.push(
  slideHeader('📊 Recommendation Analytics', 'Hệ thống đo lường & cải thiện chất lượng gợi ý', '📊', C.greenDark),
  spacer(),
  threeStats([
    { icon: '👁️', label: 'Total Recommendations', value: '123,456', bg: 'ECFDF5', color: C.green },
    { icon: '📝', label: 'Enrollment Rate', value: '34.2%', bg: 'EFF6FF', color: C.primary },
    { icon: '👍', label: 'Helpful Rate', value: '78.5%', bg: 'FFF7ED', color: C.orange },
    { icon: '🎯', label: 'Click-Through Rate', value: '51.8%', bg: 'F5F3FF', color: C.purple },
  ]),
  spacer(),
  twoCol([
    new Paragraph({ children: [new TextRun({ text: '📌 Các Chỉ Số Quan Trọng', font: 'Calibri', size: 18, bold: true, color: C.green })], spacing: { after: 80 } }),
    bullet('EnrollmentRate = enrolled / total', '→', { size: 16 }),
    bullet('ClickThroughRate = clicked / shown', '→', { size: 16 }),
    bullet('HelpfulRate = helpful / feedback', '→', { size: 16 }),
    bullet('CompletionRate = completed / enrolled', '→', { size: 16 }),
  ], [
    new Paragraph({ children: [new TextRun({ text: '🔄 Feedback Loop', font: 'Calibri', size: 18, bold: true, color: C.purple })], spacing: { after: 80 } }),
    bullet('Học viên đánh giá 👍/👎', '→', { size: 16 }),
    bullet('Hệ thống ghi nhận feedback', '→', { size: 16 }),
    bullet('Cải thiện weight theo thời gian', '→', { size: 16 }),
    bullet('Admin xem Top/Worst courses', '→', { size: 16 }),
  ]),
  spacer(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: '🔗 Các Endpoint Analytics', font: 'Calibri', size: 18, bold: true, color: C.primary })], spacing: { after: 80 } }),
        bullet('GET /api/recommendations/analytics/summary', '', { size: 15, runOpts: { font: 'Consolas', color: C.darkGray } }),
        bullet('GET /api/recommendations/analytics/top-courses', '', { size: 15, runOpts: { font: 'Consolas', color: C.darkGray } }),
        bullet('GET /api/recommendations/my-analytics', '', { size: 15, runOpts: { font: 'Consolas', color: C.darkGray } }),
        bullet('GET /api/recommendations/my-stats', '', { size: 15, runOpts: { font: 'Consolas', color: C.darkGray } }),
        bullet('POST /api/recommendations/{id}/feedback', '', { size: 15, runOpts: { font: 'Consolas', color: C.darkGray } }),
      ],
      shading: fill('EFF6FF'),
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, left: { style: BorderStyle.SINGLE, size: 6, color: C.primary }, right: { style: BorderStyle.SINGLE, size: 6, color: C.primary } },
    })] })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 7: VÍ DỤ ───────────────────────────────────────
SLIDES.push(...sectionSlide(7, 'Ví Dụ Thực Tế', 'Walkthrough từ đầu vào đến gợi ý hoàn chỉnh', '🎬', C.cyanDark));

// SLIDE 16: WALKTHROUGH
SLIDES.push(
  slideHeader('🎬 Ví Dụ: Minh — Học Viên Mới', 'Từ profile đến gợi ý cá nhân hóa trong 5 bước', '🎬', C.cyanDark),
  spacer(),
  ...[
    { step: '1', icon: '👤', title: 'Profile Minh', items: ['Sở thích: Python, Data Science', 'Đã đăng ký: 0 khóa', 'Bài nộp: 3 bài Python (2 đậu)', 'MasteryScore Python: 0.72', 'WeakAreas: SQL (chưa thử)'], color: C.primary, bg: 'EFF6FF' },
    { step: '2', icon: '📡', title: 'Signal Thu Thập', items: ['Affinity(Python) = 0.82 (yếu→cần cải thiện)', 'Affinity(SQL) = 0.6 (cần thử)', 'StrongAreas: Python (≥0.75)', 'EnrolledCourseIds: rỗng'], color: C.purple, bg: 'F5F3FF' },
    { step: '3', icon: '⚙️', title: 'Hybrid Scorer', items: ['"Python Nâng Cao": FinalScore=0.81', '  Content=0.9, Weakness=0.8, Collab=0.2', '"SQL Cơ Bản": FinalScore=0.65', '  Content=0.6, Weakness=0.8, Collab=0.1'], color: C.orange, bg: 'FFF7ED' },
    { step: '4', icon: '✅', title: 'Kết Quả Top-3', items: ['#1 Python Nâng Cao  (Score: 0.81)', '  Lý do: Cải thiện điểm yếu', '#2 SQL Cơ Bản    (Score: 0.65)', '  Lý do: Phổ biến + yếu SQL', '#3 Data Science 101 (Score: 0.58)', '  Lý do: Khớp sở thích + phổ biến'], color: C.green, bg: 'ECFDF5' },
  ].map(s => new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: s.step, font: 'Calibri', size: 24, bold: true, color: s.color })], alignment: AlignmentType.CENTER, spacing: { after: 0 } })],
        width: { size: 8, type: WidthType.PERCENTAGE },
        shading: fill(s.color),
        margins: { top: 120, bottom: 120, left: 40, right: 40 },
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: s.color }, bottom: { style: BorderStyle.SINGLE, size: 6, color: s.color }, left: { style: BorderStyle.SINGLE, size: 6, color: s.color }, right: { style: BorderStyle.NIL } },
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [
          new Paragraph({ children: [new TextRun({ text: `${s.icon}  ${s.title}`, font: 'Calibri', size: 18, bold: true, color: s.color })], spacing: { after: 60 } }),
          ...s.items.map(item => new Paragraph({ children: [new TextRun({ text: item, font: 'Calibri', size: 15, color: C.textMid })], spacing: { after: 30 } })),
        ],
        shading: fill(s.bg),
        margins: { top: 80, bottom: 80, left: 120, right: 160 },
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: s.color }, bottom: { style: BorderStyle.SINGLE, size: 6, color: s.color }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 6, color: s.color } },
      }),
    ] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  })),
  spacer(),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 8: IMPROVEMENTS ────────────────────────────────
SLIDES.push(...sectionSlide(8, 'Các Cải Tiến Đã Thực Hiện', 'Sửa lỗi và nâng cấp hệ thống', '🔧', C.accentDark));

// SLIDE 17: IMPROVEMENTS
SLIDES.push(
  slideHeader('🔧 Các Cải Tiến Đã Thực Hiện', '4 bug đã được phát hiện và sửa chữa', '🔧', C.accentDark),
  spacer(),
  ...[
    { icon: '🐛', title: 'Bug 1: Weighted Average (sai)', fix: 'Đã sửa: Score = (score₁×n₁ + score₂×n₂) / (n₁+n₂) thay vì chia 2 đơn giản. Đảm bảo tín hiệu nhiều dữ liệu có trọng số lớn hơn.', color: C.red, bg: 'FEF2F2' },
    { icon: '🐛', title: 'Bug 2: Bài tập yếu bị bỏ sót', fix: 'Đã sửa: Bài tập đã làm rồi nhưng THUỘC điểm yếu → GIỮ LẠI để học viên luyện tập, thay vì bỏ qua hoàn toàn.', color: C.orange, bg: 'FFF7ED' },
    { icon: '🔧', title: 'Tính năng: Rating + Enrollment', fix: 'Đã thêm: MapCoursesAsync trả về AverageRating & EnrollmentCount để UI hiển thị thông tin phong phú hơn trên card khóa học.', color: C.primary, bg: 'EFF6FF' },
    { icon: '🔧', title: 'Tính năng: ExerciseCount + ParticipantCount', fix: 'Đã thêm: MapContestsAsync trả về số bài tập & số người tham gia cuộc thi, giúp học viên đánh giá độ khó trước khi đăng ký.', color: C.green, bg: 'ECFDF5' },
  ].map(s => new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: `${s.icon}  ${s.title}`, font: 'Calibri', size: 18, bold: true, color: s.color })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: s.fix, font: 'Calibri', size: 16, color: C.textMid })], spacing: { after: 0 } }),
      ],
      shading: fill(s.bg),
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: s.color }, bottom: { style: BorderStyle.SINGLE, size: 6, color: s.color }, left: { style: BorderStyle.THICK, size: 10, color: s.color }, right: { style: BorderStyle.SINGLE, size: 6, color: s.color } },
    })] })],
  })),
  spacer(),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─── SECTION 9: Q&A ─────────────────────────────────────────
SLIDES.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: '🎓 CourseMate', font: 'Calibri', size: 24, color: '94A3B8' })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Cảm Ơn Các Bạn!', font: 'Calibri', size: 48, bold: true, color: C.white })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
        new Paragraph({ children: [new TextRun({ text: '🙋‍♂️ Hỏi & Đáp', font: 'Calibri', size: 28, color: C.accent })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Hybrid Recommendation Engine', font: 'Calibri', size: 20, color: '64748B' })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: 'Content + Collaborative + Weakness + Popularity', font: 'Calibri', size: 18, color: '475569' })], alignment: AlignmentType.CENTER, spacing: { after: 0 } }),
      ],
      shading: fill(C.bgDark),
      margins: { top: 1600, bottom: 1600, left: 400, right: 400 },
      borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ═══════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════════════════
const doc = new Document({
  title: 'CourseMate - Hệ Thống Gợi Ý',
  subject: 'Recommendation System Presentation',
  creator: 'CourseMate AI',
  description: 'Slide trình bày hệ thống gợi ý cá nhân hóa CourseMate',
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 20, color: C.textDark }
      },
    },
    paragraphStyles: [
      {
        id: 'Normal',
        name: 'Normal',
        run: { font: 'Calibri', size: 20 },
        paragraph: { spacing: { after: 200 } },
      },
    ],
  },
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
    children: SLIDES,
  }],
});

const outputPath = path.join(__dirname, 'CourseMate_RecommendationSystem_Slides.pptx');
Packer.createBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log('✅ Slide created: ' + outputPath);
  console.log('📄 Total slides: ~' + SLIDES.length + ' content blocks');
});
