// Generate Chen-style ERD using Graphviz WASM
// Entity = box, Relationship = diamond, Attribute = ellipse (PK underlined)
const fs = require("fs");
const path = require("path");
const { Graphviz } = require("@hpcc-js/wasm");
const sharp = require("sharp");

// ---------- helpers: build DOT for a single Chen diagram ----------
function ellipse(label, opts = {}) {
  return `  attr_${opts.id || label.replace(/\W/g,"_")} [label="${opts.underline ? "<u>"+label+"</u>" : label}", shape=ellipse, fontsize=${opts.fontsize||10}];`;
}
function entity(name, attrs = []) {
  // Composite entity: name in box header, attrs below as table rows (Chen uses side ellipses for attrs,
  // but to keep readable we'll show attrs as side ellipses + composite entity name). We'll mix:
  // Use plain rectangle for entity with name.
  return `  ent_${name} [label="${name}", shape=rectangle, style="filled,rounded", fillcolor="#E8F0FE", color="#1F3A68", penwidth=1.5, fontsize=12, fontname="Arial Bold"];`;
}
function rel(name, label = "") {
  return `  rel_${name} [label="${label||name}", shape=diamond, style=filled, fillcolor="#FFF4D6", color="#B07D00", penwidth=1.5, fontsize=11, fontname="Arial Bold"];`;
}
function eAttrText(name, attrs) {
  // side-attribute ellipses (Chen style)
  let lines = [];
  for (const a of attrs) {
    const id = `${name}_${a.label}`.replace(/\W/g,"_");
    const txt = a.pk ? `<u>${a.label}</u>` : a.label;
    lines.push(`  a_${id} [label=<${txt}>, shape=ellipse, fontsize=10,${a.pk?' fontname="Arial Bold"':''}];`);
    lines.push(`  a_${id} -> ent_${name};`);
  }
  return lines.join("\n");
}
function link(from, to, label = "") {
  return `  ${from} -> ${to}${label?` [label="${label}", fontsize=9, fontcolor="#444", fontname="Arial Italic", constraint=true]`:""};`;
}
function linkAttr(relName, entName, attrs) {
  let out = [];
  for (const a of attrs) {
    const id = `${entName}_${a.label}`.replace(/\W/g,"_");
    out.push(`  rel_${relName} -> a_${id} [style=dotted, color="#888", arrowhead=none];`);
  }
  return out.join("\n");
}
function wrapDiagram(title, bodyLines) {
  return `
digraph ER_${title.replace(/\W/g,"_")} {
  graph [rankdir=LR, fontname="Arial", label="${title}", labelloc=t, fontsize=16, compound=true, nodesep=0.3, ranksep=0.6];
  node [fontname="Arial"];
  edge [fontname="Arial"];
${bodyLines.join("\n")}
}
`;
}

// ---------- DATA: 6 Chen-style sub-diagrams ----------
function buildCoreAndCourse() {
  const lines = [];
  // Entities
  lines.push(entity("USER", ["id", "userName", "email", "isApproved"]));
  lines.push(entity("CATEGORY", ["id", "name", "isActive"]));
  lines.push(entity("COURSE", ["id", "title", "price", "imageUrl", "isPublished"]));
  lines.push(entity("CHAPTER", ["id", "title", "position"]));
  lines.push(entity("LESSON", ["id", "title", "lessonType", "position"]));
  // Attributes as side ellipses
  lines.push(eAttrText("USER", [{label:"Id",pk:true},{label:"UserName"},{label:"Email"},{label:"IsApproved"}]));
  lines.push(eAttrText("CATEGORY", [{label:"Id",pk:true},{label:"Name"},{label:"IsActive"}]));
  lines.push(eAttrText("COURSE", [{label:"Id",pk:true},{label:"Title"},{label:"Price"},{label:"ImageUrl"},{label:"IsPublished"}]));
  lines.push(eAttrText("CHAPTER", [{label:"Id",pk:true},{label:"Title"},{label:"Position"}]));
  lines.push(eAttrText("LESSON", [{label:"Id",pk:true},{label:"Title"},{label:"LessonType"},{label:"Position"}]));
  // Relationships
  lines.push(rel("instructs","instructs"));
  lines.push(rel("categorizes","categorized_as"));
  lines.push(rel("contains_c","has"));
  lines.push(rel("contains_ch","has"));
  // Edges
  lines.push(link("ent_USER", "rel_instructs"));
  lines.push(link("rel_instructs", "ent_COURSE", "1 â€” n"));
  lines.push(link("ent_CATEGORY", "rel_categorizes"));
  lines.push(link("rel_categorizes", "ent_COURSE", "1 â€” n"));
  lines.push(link("ent_COURSE", "rel_contains_c"));
  lines.push(link("rel_contains_c", "ent_CHAPTER", "1 â€” n"));
  lines.push(link("ent_CHAPTER", "rel_contains_ch"));
  lines.push(link("rel_contains_ch", "ent_LESSON", "1 â€” n"));
  return wrapDiagram("1. Identity & Course Hierarchy (Chen)", lines);
}

function buildLearningCommerce() {
  const lines = [];
  // Entities
  for (const n of ["USER","COURSE","ENROLLMENT","USER_LESSON_PROGRESS","REVIEW","CART","CART_ITEM","ORDER","ORDER_ITEM","PAYMENT_TRANSACTION","NOTIFICATION"]) {
    lines.push(entity(n));
  }
  // Relationships
  for (const r of ["enrolls","has_progress","writes_review","owns_cart","has_item","places_order","contains_order","paid_by","receives_notif"]) {
    lines.push(rel(r));
  }
  // Edges (USER â†’ enrolls â† COURSE, etc.)
  lines.push(link("ent_USER","rel_enrolls"));
  lines.push(link("rel_enrolls","ent_COURSE","1 â€” n"));
  lines.push(link("rel_enrolls","ent_ENROLLMENT")); // binary: actually USER---enrolls---COURSE
  // make enrolls binary actually since it's between USER & COURSE only
  // Replace: remove the wrong edge
  lines.pop();
  // re-add a single join (optional): we'll keep enrolls as n-n between USER & COURSE.
  // has_progress: USER -> USER_LESSON_PROGRESS (rel handled in next block)
  lines.push(link("ent_USER","rel_has_progress"));
  lines.push(link("rel_has_progress","ent_USER_LESSON_PROGRESS","1 â€” n"));
  lines.push(link("ent_USER","rel_writes_review"));
  lines.push(link("rel_writes_review","ent_REVIEW","1 â€” n"));
  lines.push(link("rel_writes_review","ent_COURSE"));
  // oh wait - REVIEW relates to USER & COURSE only. correct.
  // the prior 3 lines: USER -> writes_review, writes_review -> REVIEW, writes_review -> COURSE.
  // that's correct.
  lines.push(link("ent_USER","rel_owns_cart"));
  lines.push(link("rel_owns_cart","ent_CART","1 â€” 1"));
  lines.push(link("rel_owns_cart","rel_has_item")); // chain to CART_ITEM
  lines.push(link("rel_has_item","ent_CART_ITEM","1 â€” n"));
  lines.push(link("rel_has_item","ent_COURSE"));
  // ORDER flow
  lines.push(link("ent_USER","rel_places_order"));
  lines.push(link("rel_places_order","ent_ORDER","1 â€” n"));
  lines.push(link("rel_places_order","rel_contains_order"));
  lines.push(link("rel_contains_order","ent_ORDER_ITEM","1 â€” n"));
  lines.push(link("rel_contains_order","ent_COURSE"));
  lines.push(link("rel_places_order","rel_paid_by"));
  lines.push(link("rel_paid_by","ent_PAYMENT_TRANSACTION","1 â€” n"));
  lines.push(link("ent_USER","rel_receives_notif"));
  lines.push(link("rel_receives_notif","ent_NOTIFICATION","1 â€” n"));
  return wrapDiagram("2. Learning & Commerce (Chen)", lines);
}

function buildExerciseContest() {
  const lines = [];
  for (const n of ["EXERCISE","EXERCISE_TEST_CASE","EXERCISE_EXAMPLE","EXERCISE_DEFAULT_CODE","EXERCISE_SUBMISSION","CONTEST","CONTEST_EXERCISE","CONTEST_REGISTRATION","CONTEST_SUBMISSION","CONTEST_PRIZE","USER","COURSE"]) {
    lines.push(entity(n));
  }
  // core rels
  for (const r of ["has_test_cases","has_examples","has_defaults","receives_submission","belongs_to_contest","registers_for","submits_to","awards","creates_exercise","creates_contest"]) lines.push(rel(r));
  lines.push(link("ent_EXERCISE","rel_has_test_cases")); lines.push(link("rel_has_test_cases","ent_EXERCISE_TEST_CASE","1 â€” n"));
  lines.push(link("ent_EXERCISE","rel_has_examples")); lines.push(link("rel_has_examples","ent_EXERCISE_EXAMPLE","1 â€” n"));
  lines.push(link("ent_EXERCISE","rel_has_defaults")); lines.push(link("rel_has_defaults","ent_EXERCISE_DEFAULT_CODE","1 â€” n"));
  lines.push(link("ent_EXERCISE","rel_receives_submission")); lines.push(link("rel_receives_submission","ent_EXERCISE_SUBMISSION","1 â€” n"));
  lines.push(link("ent_USER","rel_creates_exercise")); lines.push(link("rel_creates_exercise","ent_EXERCISE","1 â€” n"));
  lines.push(link("ent_USER","rel_creates_contest")); lines.push(link("rel_creates_contest","ent_CONTEST","1 â€” n"));
  lines.push(link("ent_EXERCISE","rel_belongs_to_contest")); lines.push(link("rel_belongs_to_contest","ent_CONTEST_EXERCISE","1 â€” n"));
  lines.push(link("rel_belongs_to_contest","ent_CONTEST")); // via CONTEST_EXERCISE chain
  // simpler: directly USER -> registers_for -> CONTEST
  lines.push(link("ent_USER","rel_registers_for")); lines.push(link("rel_registers_for","ent_CONTEST_REGISTRATION","1 â€” n"));
  lines.push(link("rel_registers_for","ent_CONTEST"));
  // submit
  lines.push(link("ent_USER","rel_submits_to")); lines.push(link("rel_submits_to","ent_CONTEST_SUBMISSION","1 â€” n"));
  lines.push(link("rel_submits_to","ent_CONTEST")); lines.push(link("rel_submits_to","ent_EXERCISE"));
  // prize
  lines.push(link("ent_CONTEST","rel_awards")); lines.push(link("rel_awards","ent_CONTEST_PRIZE","1 â€” n"));
  lines.push(link("rel_awards","ent_COURSE"));
  return wrapDiagram("3. Exercise & Contest (Chen)", lines);
}

function buildChatFile() {
  const lines = [];
  for (const n of ["USER","CHAT_CONVERSATION","CHAT_MESSAGE","FILE_ENTRY","FILE_CHUNK","FILE_ENTRY_EMBEDDING","LESSON_MATERIAL"]) {
    lines.push(entity(n));
  }
  for (const r of ["owns_conversation","has_message","owns_files","splits_into","produces_embedding","attached_to_lesson"]) lines.push(rel(r));
  lines.push(link("ent_USER","rel_owns_conversation")); lines.push(link("rel_owns_conversation","ent_CHAT_CONVERSATION","1 â€” n"));
  lines.push(link("ent_CHAT_CONVERSATION","rel_has_message")); lines.push(link("rel_has_message","ent_CHAT_MESSAGE","1 â€” n"));
  lines.push(link("ent_USER","rel_owns_files")); lines.push(link("rel_owns_files","ent_FILE_ENTRY","1 â€” n"));
  lines.push(link("ent_FILE_ENTRY","rel_splits_into")); lines.push(link("rel_splits_into","ent_FILE_CHUNK","1 â€” n"));
  lines.push(link("ent_FILE_ENTRY","rel_produces_embedding")); lines.push(link("rel_produces_embedding","ent_FILE_ENTRY_EMBEDDING","1 â€” n"));
  lines.push(link("rel_produces_embedding","ent_FILE_CHUNK"));
  lines.push(link("ent_FILE_ENTRY","rel_attached_to_lesson")); lines.push(link("rel_attached_to_lesson","ent_LESSON_MATERIAL","1 â€” n"));
  return wrapDiagram("4. Chat & File (Chen)", lines);
}

function buildRecommendation() {
  const lines = [];
  for (const n of ["USER","COURSE","COURSE_EMBEDDING","COURSE_SIMILARITY","COURSE_CO_OCCURRENCE","USER_RECOMMENDATION","STUDENT_PREFERENCE","STUDENT_SKILL_PROFILE"]) {
    lines.push(entity(n));
  }
  for (const r of ["embeds","similar_to","co_occurs","receives_recommendation","has_preference","has_skill_profile"]) lines.push(rel(r));
  lines.push(link("ent_COURSE","rel_embeds")); lines.push(link("rel_embeds","ent_COURSE_EMBEDDING","1 â€” 0..1"));
  lines.push(link("ent_COURSE","rel_similar_to")); lines.push(link("rel_similar_to","ent_COURSE_SIMILARITY","1 â€” n"));
  lines.push(link("rel_similar_to","ent_COURSE")); // back to COURSE (self)
  lines.push(link("ent_COURSE","rel_co_occurs")); lines.push(link("rel_co_occurs","ent_COURSE_CO_OCCURRENCE","1 â€” n"));
  lines.push(link("rel_co_occurs","ent_COURSE"));
  lines.push(link("ent_USER","rel_receives_recommendation")); lines.push(link("rel_receives_recommendation","ent_USER_RECOMMENDATION","1 â€” n"));
  lines.push(link("rel_receives_recommendation","ent_COURSE"));
  lines.push(link("ent_USER","rel_has_preference")); lines.push(link("rel_has_preference","ent_STUDENT_PREFERENCE","1 â€” 1"));
  lines.push(link("ent_USER","rel_has_skill_profile")); lines.push(link("rel_has_skill_profile","ent_STUDENT_SKILL_PROFILE","1 â€” n"));
  return wrapDiagram("5. AI & Recommendation (Chen)", lines);
}

function buildQuizAndLessonVariants() {
  const lines = [];
  for (const n of ["LESSON","LESSON_VIDEO","LESSON_READING","LESSON_CODING","LESSON_QUIZ","LESSON_QUIZ_QUESTION","LESSON_QUIZ_ANSWER"]) {
    lines.push(entity(n));
  }
  for (const r of ["has_video","has_reading","has_coding","has_quiz","contains_question","has_answer"]) lines.push(rel(r));
  lines.push(link("ent_LESSON","rel_has_video")); lines.push(link("rel_has_video","ent_LESSON_VIDEO","1 â€” 0..1"));
  lines.push(link("ent_LESSON","rel_has_reading")); lines.push(link("rel_has_reading","ent_LESSON_READING","1 â€” 0..1"));
  lines.push(link("ent_LESSON","rel_has_coding")); lines.push(link("rel_has_coding","ent_LESSON_CODING","1 â€” 0..1"));
  lines.push(link("ent_LESSON","rel_has_quiz")); lines.push(link("rel_has_quiz","ent_LESSON_QUIZ","1 â€” 0..1"));
  lines.push(link("rel_has_quiz","rel_contains_question")); lines.push(link("rel_contains_question","ent_LESSON_QUIZ_QUESTION","1 â€” n"));
  lines.push(link("ent_LESSON_QUIZ_QUESTION","rel_has_answer")); lines.push(link("rel_has_answer","ent_LESSON_QUIZ_ANSWER","1 â€” n"));
  return wrapDiagram("6. Lesson Variants & Quiz (Chen)", lines);
}

const diagrams = [
  buildCoreAndCourse(),
  buildQuizAndLessonVariants(),
  buildLearningCommerce(),
  buildExerciseContest(),
  buildChatFile(),
  buildRecommendation(),
];

module.exports = { diagrams };

(async () => {
  const gv = await Graphviz.load();
  for (let i = 0; i < diagrams.length; i++) {
    const dot = diagrams[i];
    const svg = gv.dot(dot, "svg");
    const baseName = `ERD_Chen_${String(i+1).padStart(2,"0")}`;
    const svgPath = path.resolve(__dirname, `${baseName}.svg`);
    const pngPath = path.resolve(__dirname, `${baseName}.png`);
    fs.writeFileSync(svgPath, svg, "utf8");
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    console.log("Wrote:", baseName, "svg=", svg.length, "bytes");
  }
  console.log("All sub-diagrams generated.");
})();


