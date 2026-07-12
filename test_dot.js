const { Graphviz } = require("@hpcc-js/wasm");
(async () => {
  const gv = await Graphviz.load();
  const t = [
    `digraph G { a_USER_Id -- ent_USER; }`,
    `digraph G { a_USER_Id -- ent_USER [label="x"]; }`,
    `digraph G { a -- b; }`,
    `graph G { a_USER_Id -- ent_USER; }`,
  ];
  for (const d of t) {
    try { const svg = gv.dot(d, "svg"); console.log("OK", d); }
    catch (e) { console.log("FAIL", d, "::", e.message.split("\n")[0]); }
  }
})();
