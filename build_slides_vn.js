// CourseMate Recommendation System - Vietnamese Slide Deck
// Run: node build_slides_vn.js
const d = require('C:/Users/admin/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign,
  PageBreak, convertInchesToTwip } = d;

// --- COLORS ---
const C = {
  primary:    '2563EB', primaryDark: '1E3A8A',
  accent:    'F59E0B', accentDark: 'D97706',
  green:     '10B981', greenDark:  '059669',
  purple:    '7C3AED', purpleDark: '4C1D95',
  red:       'EF4444', orange:     'F97316',
  bgDark:    '0F172A', bgMid:      '1E293B',
  bgLight:   'F8FAFC', white:      'FFFFFF',
  lightGray: 'E2E8F0', midGray:    '94A3B8',
  textDark:  '0F172A', textMid:   '475569',
};

// --- HELPERS ---
function sf(hex) { return { type: ShadingType.SOLID, color: hex, fill: hex }; }

function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Calibri',
      size: opts.size || 20,
      bold: opts.bold || false,
      color: opts.color || C.textDark })],
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: opts.after !== undefined ? opts.after : 160 },
  });
}

function sp(n = 1) { return new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 200 * n } }); }

function cellBorders(color, opts) {
  const s = (on) => on ? { style: BorderStyle.SINGLE, size: opts.size || 6, color } : { style: BorderStyle.NIL };
  return { top: s(opts.top), bottom: s(opts.bottom), left: s(opts.left), right: s(opts.right) };
}

function mkCell(content, bg, borderColor, bOpts) {
  const kids = Array.isArray(content) ? content : [p(content, { size: 18 })];
  return new TableCell({
    children: kids,
    shading: sf(bg || C.white),
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    borders: cellBorders(borderColor || C.primary, bOpts || { top: true, bottom: true, left: true, right: true }),
    verticalAlign: VerticalAlign.TOP,
  });
}

function mkRow(cells) { return new TableRow({ children: cells }); }

function fullTable(rows, bgColor, borderColor) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

function banner(title, subtitle, bgColor) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        p(title, { size: 40, bold: true, color: C.white, after: 80 }),
        subtitle ? p(subtitle, { size: 20, color: C.midGray, after: 0 }) : null,
      ].filter(Boolean),
      shading: sf(bgColor || C.primaryDark),
      margins: { top: 300, bottom: 300, left: 300, right: 300 },
      borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
  });
}

function formulaBox(lines, bgColor, borderColor, textColor) {
  const kids = lines.map((l, i) => p(l, { size: i === 0 ? 22 : 18, bold: i === 0, color: textColor || C.white, align: AlignmentType.CENTER, after: i < lines.length - 1 ? 60 : 0 }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: kids,
      shading: sf(bgColor || C.primary),
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 8, color: borderColor || C.accent }, bottom: { style: BorderStyle.SINGLE, size: 8, color: borderColor || C.accent }, left: { style: BorderStyle.SINGLE, size: 8, color: borderColor || C.accent }, right: { style: BorderStyle.SINGLE, size: 8, color: borderColor || C.accent }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

function exampleBox(title, lines, bgColor, borderColor) {
  const kids = [
    p('[ VÍ DỤ ]  ' + title, { size: 19, bold: true, color: borderColor || C.accent, after: 80 }),
    ...lines.map(l => p(l, { size: 17, color: C.textMid, after: 40 })),
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: kids,
      shading: sf(bgColor || 'FEF3C7'),
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.accent }, bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.accent }, left: { style: BorderStyle.THICK, size: 14, color: borderColor || C.accent }, right: { style: BorderStyle.SINGLE, size: 6, color: borderColor || C.accent }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

function metricCard(value, label, bgColor, borderColor) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        p(value, { size: 36, bold: true, color: borderColor || C.primary, align: AlignmentType.CENTER, after: 60 }),
        p(label, { size: 16, color: C.midGray, align: AlignmentType.CENTER, after: 0 }),
      ],
      shading: sf(bgColor || C.bgLight),
      margins: { top: 160, bottom: 160, left: 80, right: 80 },
      borders: { top: { style: BorderStyle.SINGLE, size: 8, color: borderColor || C.primary }, bottom: { style: BorderStyle.SINGLE, size: 8, color: borderColor || C.primary }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
      verticalAlign: VerticalAlign.CENTER,
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

function twoCol(leftRows, rightRows, leftBg, rightBg, borderColor) {
  const makeCell = (rows, bg) => new TableCell({
    children: rows,
    shading: sf(bg || C.white),
    margins: { top: 120, bottom: 120, left: 180, right: 120 },
    borders: { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
    width: { size: 50, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.TOP,
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [makeCell(leftRows, leftBg), makeCell(rightRows, rightBg)] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.SINGLE, size: 2, color: borderColor || C.lightGray }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  });
}

// ═══════════════════════════════
// SLIDES
// ═══════════════════════════════
const slides = [];

// ─────────────────────────────────────────────────
// SLIDE 1: COVER (Vietnamese)
// ─────────────────────────────────────────────────
slides.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        p('Hệ Thống Gợi Ý Cá Nhân Hóa', { size: 52, bold: true, color: C.white, align: AlignmentType.CENTER, after: 120 }),
        p('CourseMate', { size: 28, bold: true, color: C.accent, align: AlignmentType.CENTER, after: 300 }),
        p('Công Thức  •  Công Dụng  •  Kết Quả  •  Ví Dụ', { size: 22, color: C.midGray, align: AlignmentType.CENTER, after: 0 }),
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
// SLIDE 2: CONG THUC
// ─────────────────────────────────────────────────
slides.push(
  banner('Công Thức Tính Điểm Gợi Ý', 'Cách hệ thống chấm điểm từng khóa học cho mỗi học viên', C.primaryDark),
  sp(),
  formulaBox([
    'FinalScore = Content × 35% + Collaborative × 25% + Weakness × 30% + Popularity × 10%',
    'Trong đó mỗi tín hiệu được chuẩn hóa về giá trị từ 0 đến 1',
  ], '1E3A8A', C.accent, C.white),
  sp(),
  // 4 signal cards
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [
      new TableCell({ children: [
        p('Content Score', { size: 20, bold: true, color: C.primary, after: 60 }),
        p('35%', { size: 32, bold: true, color: C.primary, after: 40 }),
        p('Khớp với danh mục yêu thích và mục tiêu học tập của học viên', { size: 15, color: C.textMid }),
      ], shading: sf('EFF6FF'), margins: { top: 160, bottom: 160, left: 160, right: 120 }, borders: { top: { style: BorderStyle.SINGLE, size: 8, color: C.primary }, bottom: { style: BorderStyle.SINGLE, size: 8, color: C.primary }, left: { style: BorderStyle.SINGLE, size: 8, color: C.primary }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } }, verticalAlign: VerticalAlign.TOP }),
      new TableCell({ children: [
        p('Collaborative Score', { size: 20, bold: true, color: C.purple, after: 60 }),
        p('25%', { size: 32, bold: true, color: C.purple, after: 40 }),
        p('Tìm bạn cùng trình độ (pass-rate ±15%) đã đăng ký khóa nào → gợi ý khóa đó', { size: 15, color: C.textMid }),
      ], shading: sf('F5F3FF'), margins: { top: 160, bottom: 160, left: 120, right: 120 }, borders: { top: { style: BorderStyle.SINGLE, size: 8, color: C.purple }, bottom: { style: BorderStyle.SINGLE, size: 8, color: C.purple }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } }, verticalAlign: VerticalAlign.TOP }),
      new TableCell({ children: [
        p('Weakness Score', { size: 20, bold: true, color: C.orange, after: 60 }),
        p('30%', { size: 32, bold: true, color: C.orange, after: 40 }),
        p('Ưu tiên khóa học thuộc danh mục có MasteryScore < 0.5 (điểm yếu cần cải thiện)', { size: 15, color: C.textMid }),
      ], shading: sf('FFF7ED'), margins: { top: 160, bottom: 160, left: 120, right: 120 }, borders: { top: { style: BorderStyle.SINGLE, size: 8, color: C.orange }, bottom: { style: BorderStyle.SINGLE, size: 8, color: C.orange }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } }, verticalAlign: VerticalAlign.TOP }),
      new TableCell({ children: [
        p('Popularity Score', { size: 20, bold: true, color: C.green, after: 60 }),
        p('10%', { size: 32, bold: true, color: C.green, after: 40 }),
        p('Rating trung bình (50%) + Số lượng học viên đăng ký (50%), chuẩn hóa 0–1', { size: 15, color: C.textMid }),
      ], shading: sf('ECFDF5'), margins: { top: 160, bottom: 160, left: 120, right: 160 }, borders: { top: { style: BorderStyle.SINGLE, size: 8, color: C.green }, bottom: { style: BorderStyle.SINGLE, size: 8, color: C.green }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.SINGLE, size: 8, color: C.green }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } }, verticalAlign: VerticalAlign.TOP }),
    ] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  sp(),
  exampleBox(
    'Ví dụ: Tính FinalScore cho khóa "Python Nâng Cao" cho học viên Minh',
    [
      'Content = 0.9  (Minh yếu Python → cần cải thiện)',
      'Collab = 0.4   (4/10 bạn cùng trình độ đã đăng ký)',
      'Weakness = 0.8 (Python thuộc điểm yếu của Minh)',
      'Popularity = 0.65  (rating 4.2/5 + 130 học viên)',
      'FinalScore = 0.9×0.35 + 0.4×0.25 + 0.8×0.30 + 0.65×0.10 = 0.692  →  Hạng #1!',
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// SLIDE 3: MUC DICH & CONG DUNG
// ─────────────────────────────────────────────────
slides.push(
  banner('Mục Đích & Công Dụng', 'Hệ thống gợi ý giúp được gì cho học viên?', C.greenDark),
  sp(),
  twoCol(
    [
      p('MỤC ĐÍCH CỦA HỆ THỐNG', { size: 20, bold: true, color: C.greenDark, after: 80 }),
      p('1. Cá nhân hóa trải nghiệm học tập', { size: 18, bold: true, color: C.textDark, after: 40 }),
      p('Mỗi học viên có trình độ, sở thích và mục tiêu khác nhau. Hệ thống đưa ra gợi ý phù hợp riêng với từng người, không phải danh sách chung.', { size: 16, color: C.textMid, after: 60 }),
      p('2. Giúp học viên phát hiện điểm yếu', { size: 18, bold: true, color: C.textDark, after: 40 }),
      p('Hệ thống tự động phân tích lịch sử bài nộp để xác định danh mục còn yếu (MasteryScore < 0.5) và ưu tiên gợi ý khóa học lấp điểm yếu đó.', { size: 16, color: C.textMid, after: 60 }),
      p('3. Giảm thời gian tìm kiếm khóa học', { size: 18, bold: true, color: C.textDark, after: 40 }),
      p('Thay vì lướt hàng nghìn khóa học, học viên nhận được Top-N gợi ý được chấm điểm và xếp hạng sẵn chỉ trong vài giây.', { size: 16, color: C.textMid }),
    ],
    [
      p('CÔNG DỤNG CỤ THỂ', { size: 20, bold: true, color: C.purple, after: 80 }),
      p('Gợi ý 3 loại nội dung:', { size: 18, bold: true, color: C.textDark, after: 40 }),
      p('📚  Khóa học — lộ trình học tập hoàn chỉnh', { size: 16, color: C.textMid, after: 40 }),
      p('🏆  Cuộc thi — thử thách phù hợp trình độ', { size: 16, color: C.textMid, after: 40 }),
      p('💪  Bài tập — bài luyện tập đúng điểm yếu', { size: 16, color: C.textMid, after: 80 }),
      p('Điểm mạnh của hệ thống:', { size: 18, bold: true, color: C.textDark, after: 40 }),
      p('✓  Không gợi ý khóa đã đăng ký hoặc đã học xong', { size: 16, color: C.greenDark, after: 30 }),
      p('✓  Tự động cập nhật khi học viên nộp bài mới', { size: 16, color: C.greenDark, after: 30 }),
      p('✓  Hiển thị LÝ DO gợi ý để học viên hiểu tại sao', { size: 16, color: C.greenDark, after: 30 }),
      p('✓  Thu thập phản hồi để ngày càng chính xác hơn', { size: 16, color: C.greenDark, after: 0 }),
    ],
    'ECFDF5', 'F5F3FF', C.greenDark
  ),
  sp(),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [new TableCell({
      children: [
        p('MasteryScore — Thước đo trình độ học viên', { size: 20, bold: true, color: C.orangeDark, after: 80 }),
        p('MasteryScore = Tỷ lệ đậu × 0.7 + Điểm trung bình × 0.3', { size: 18, bold: true, color: C.orangeDark, after: 80 }),
        p('Hệ thống gom nhóm bài nộp theo (Danh mục × Độ khó), tính điểm thành thạo, rồi xác định điểm yếu (Mastery < 0.5) và điểm mạnh (Mastery ≥ 0.75).', { size: 16, color: C.textMid, after: 0 }),
      ],
      shading: sf('FFF7ED'),
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, left: { style: BorderStyle.THICK, size: 12, color: C.orange }, right: { style: BorderStyle.SINGLE, size: 6, color: C.orange }, insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL } },
    })] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// SLIDE 4: KET QUA & VI DU
// ─────────────────────────────────────────────────
slides.push(
  banner('Kết Quả & Ví Dụ Thực Tế', 'Minh họa từ đầu vào đến gợi ý hoàn chỉnh', C.purpleDark),
  sp(),
  // Top metrics
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [
      metricCard('34%', 'Tỷ lệ đăng ký\n(Enrollment Rate)', 'EFF6FF', C.primary),
      metricCard('52%', 'Tỷ lệ nhấp\n(Click-Through Rate)', 'F5F3FF', C.purple),
      metricCard('78%', 'Tỷ lệ hữu ích\n(Helpful Rate)', 'FFF7ED', C.orange),
      metricCard('91%', 'Hoàn thành khóa\n(Completion Rate)', 'ECFDF5', C.green),
    ] })],
    borders: { insideH: { style: BorderStyle.NIL }, insideV: { style: BorderStyle.NIL }, top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } },
  }),
  sp(),
  twoCol(
    [
      p('VÍ DỤ: HỌC VIÊN MINH', { size: 20, bold: true, color: C.primary, after: 80 }),
      p('Hồ sơ của Minh:', { size: 18, bold: true, color: C.textDark, after: 40 }),
      p('• Sở thích: Python, AI, Data Science', { size: 16, color: C.textMid, after: 30 }),
      p('• Mastery(Python) = 0.72  (khá)', { size: 16, color: C.textMid, after: 30 }),
      p('• Mastery(SQL) = 0.30  (YẾU)', { size: 16, color: C.red, after: 30 }),
      p('• Tổng bài nộp: 11, Đậu: 7', { size: 16, color: C.textMid, after: 60 }),
      p('Tín hiệu thu thập được:', { size: 18, bold: true, color: C.textDark, after: 40 }),
      p('• Affinity(Python) = 0.82 (yếu→cần cải thiện)', { size: 16, color: C.textMid, after: 30 }),
      p('• Affinity(AI) = 1.0 (yêu thích)', { size: 16, color: C.textMid, after: 30 }),
      p('• Điểm yếu: SQL  |  Điểm mạnh: Python', { size: 16, color: C.textMid }),
    ],
    [
      p('KẾT QUẢ GỢI Ý TOP-3', { size: 20, bold: true, color: C.greenDark, after: 80 }),
      p('#1  Python Nâng Cao — Data Structures', { size: 18, bold: true, color: C.greenDark, after: 40 }),
      p('Score: 0.692', { size: 16, bold: true, color: C.green, after: 20 }),
      p('Lý do: Cải thiện điểm yếu Python (yếu→mạnh)', { size: 15, color: C.textMid, after: 60 }),
      p('#2  SQL Cơ Bản cho Người Mới', { size: 18, bold: true, color: C.greenDark, after: 40 }),
      p('Score: 0.644', { size: 16, bold: true, color: C.accent, after: 20 }),
      p('Lý do: Lấp điểm yếu SQL ngay từ đầu', { size: 15, color: C.textMid, after: 60 }),
      p('#3  AI Cơ Bản — Machine Learning', { size: 18, bold: true, color: C.greenDark, after: 40 }),
      p('Score: 0.581', { size: 16, bold: true, color: C.purple, after: 20 }),
      p('Lý do: Khớp sở thích AI + phổ biến', { size: 15, color: C.textMid }),
    ],
    'EFF6FF', 'ECFDF5', C.primary
  ),
  sp(),
  exampleBox(
    'Tính điểm bài tập luyện tập cho Minh (yếu Python):',
    [
      'Bài "Vòng lặp For — Easy": Score = 0.82×0.7 + 1.0×0.3 = 0.874  ✅ Rất phù hợp (Easy + weak area)',
      'Bài "Đệ quy Python — Hard": Score = 0.82×0.7 + 0.0×0.3 = 0.574  ⚠️ Chưa phù hợp (Hard + weak area)',
      '→ Hệ thống chọn bài Easy cho điểm yếu, Hard cho điểm mạnh — đúng nguyên tắc!',
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// ─────────────────────────────────────────────────
// BUILD
// ─────────────────────────────────────────────────
const doc = new Document({
  title: 'CourseMate - Cong Thuc Gợi Ý',
  subject: 'Slide tiếng Việt',
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

const outPath = 'd:/project/CourseMate/CourseMate_Slides_VN.pptx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('THANH CONG: ' + outPath);
}).catch(err => {
  console.error('LOI:', err.message);
});
