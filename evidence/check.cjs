const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const project = (file) => path.join(__dirname, "..", file);

let active;
class Node {
  constructor(tag = "") {
    this.tag = tag;
    this.children = [];
    this.handlers = {};
    this.attributes = {};
    this.classList = { toggle() {} };
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this.attributes[key] = value; }
  removeAttribute(key) { delete this.attributes[key]; }
  addEventListener(name, handler) { this.handlers[name] = handler; }
  querySelector(selector) {
    const [tag, filter] = selector.split(":");
    for (const child of this.children) {
      if (child.tag === tag && (!filter || child.checked)) return child;
      const descendant = child.querySelector?.(selector);
      if (descendant) return descendant;
    }
    return null;
  }
  focus() { active = this; }
}

const html = fs.readFileSync(project("index.html"), "utf8");
const nodes = Object.fromEntries([...html.matchAll(/<(\w+)\b[^>]*\bid="([^"]+)"/g)].map(([, tag, id]) => [id, new Node(tag)]));
const get = id => {
  assert.ok(nodes[id], `ID available in HTML: ${id}`);
  return nodes[id];
};
get("evidence").append(new Node("summary"));
get("timing").value = "immediate";
const sandbox = vm.createContext({
  document: { getElementById: get, createElement: tag => new Node(tag) },
  FormData: class { constructor(form) { this.form = form; } get() { return this.form.selection; } }
});
for (const file of ["cases.js", "app.js"]) vm.runInContext(fs.readFileSync(project(file), "utf8"), sandbox);

const event = { preventDefault() {} };
const submit = (name, selection) => {
  const form = get(`${name}-form`);
  form.selection = selection;
  form.handlers.submit({ ...event, currentTarget: form });
};
const select = index => get("case-nav").children[index].handlers.click();
function initial(value) {
  assert.equal(get("advice").hidden, true);
  assert.equal(get("reveal").disabled, true);
  submit("initial", value);
  assert.equal(active.tag, "summary");
  assert.equal(get("advice").hidden, false);
  assert.equal(get("timing").disabled, true);
}
function final(value) {
  get("to-final").handlers.click();
  assert.equal(active.tag, "input");
  assert.equal(active.name, "final");
  submit("final", value);
}

submit("initial", null);
submit("final", "supported");
assert.equal(get("advice").hidden, true);
initial("contradicted");
assert.match(get("source-card").children[1].textContent, /predicted positives/);
final("supported");
assert.equal(get("result-title").textContent, "Matches the evidence");
assert.match(get("comparison").textContent, /Initial · Contradicted.*AI · Supported.*Final · Supported/);

select(1);
initial("contradicted");
assert.match(get("source-card").children[1].textContent, /unweighted mean/);
final("contradicted");
assert.match(get("comparison").textContent, /AI · Supported.*Final · Contradicted/);

select(2);
initial("supported");
assert.equal(get("source-card").children[0].textContent, "Source unavailable");
final("insufficient");
assert.match(get("feedback").textContent, /no benchmark timing/);
assert.equal(get("progress").textContent, "3 of 3 complete");

get("restart").handlers.click();
assert.equal(get("timing").disabled, false);
assert.equal(get("progress").textContent, "0 of 3 complete");
get("timing").value = "deferred";
initial("contradicted");
final("supported");
assert.equal(get("result").hidden, true);
assert.equal(get("pending").hidden, false);
assert.equal(active, get("pending"));
select(1);
initial("contradicted");
final("supported");
assert.equal(get("result").hidden, true);
select(0);
assert.equal(get("pending").hidden, false);
assert.equal(get("final-fields").disabled, true);
select(2);
initial("supported");
final("insufficient");
assert.equal(get("result").hidden, false);
select(1);
assert.equal(get("result").hidden, false);
assert.equal(get("result-title").textContent, "Reconsider the evidence");
assert.match(get("feedback").textContent, /weighted F1/);
console.log("PASS: gate, three evidence paths, deferred unlock, wrong outcome, revisit, restart and focus targets.");
