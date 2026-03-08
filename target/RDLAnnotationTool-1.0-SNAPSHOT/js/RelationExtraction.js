

//===== Relation Extraction =====
// Toggles the RelationExtraction primary button between 
// a busy/loading state (disabled + custom label) and
//  its original enabled label.
function setRelBusy(isBusy, msg = "Loading") {
  const root = document.getElementById("RelationExtraction");
  const btn = root?.querySelector(".actions-row .primary-btn");
  const content = document.getElementById("execute-content");

  if (!btn) return;

  if (!btn.dataset.originalLabel) {
    btn.dataset.originalLabel = (content?.textContent || btn.textContent).trim();
  }

  if (isBusy) {
    btn.disabled = true;
    btn.setAttribute("aria-busy", "true");
    btn.classList.add("is-busy");

    if (content && content._loadingTimer) clearInterval(content._loadingTimer);

    let dots = 0;
    if (content) {
      content.textContent = msg;
      content._loadingTimer = setInterval(() => {
        dots = (dots + 1) % 4; 
        content.textContent = msg + ".".repeat(dots);
      }, 350);
    }
  } else {
    btn.disabled = false;
    btn.setAttribute("aria-busy", "false");
    btn.classList.remove("is-busy");

    if (content && content._loadingTimer) {
      clearInterval(content._loadingTimer);
      content._loadingTimer = null;
    }
    
    if (content) content.textContent = btn.dataset.originalLabel || "Execute";
  }
}

function setBackDisabled(disabled){
  const b1 = document.getElementById("back-btn-entity");
  const b2 = document.getElementById("back-btn-relation");
  [b1,b2].forEach(b=>{
    if(!b) return;
    b.disabled = disabled;             
    b.classList.toggle("is-disabled", disabled);
    b.setAttribute("aria-disabled", disabled ? "true" : "false");
  });
}

function showExecuteError(msg){
  const err = document.getElementById('execute-error');
  err.textContent = msg;
  err.style.display = 'block';
}
function clearExecuteError(){
  const err = document.getElementById('execute-error');
  err.style.display = 'none';
  err.textContent = '';
}

function isUriValid(uri){
  if (!uri) return true; 
  const u = uri.trim();
  return /^https?:\/\/\S+$/i.test(u) || /^([A-Za-z][\w.-]*):\S+$/.test(u);
}

function includesCI(text, sub){
  return text.toLowerCase().includes(sub.toLowerCase());
}

function validateEntitiesForExtraction(entities, text){
  const errors = [];
  const warnings = [];

  const seenSubType = new Set();
  const seenUri = new Map();      
  const seenLabelType = new Map(); 

  (entities || []).forEach((e, i) => {
    const row = i + 1;
    const label = (e.label || "").trim();
    const sub   = (e.substring || "").trim();
    const type  = (e.type || "").trim();
    const uri   = (e.uri || "").trim();

    // -------- ERRORS (block execute) --------
    if (!label) errors.push(`Row ${row}: missing Label.`);
    // if (!sub) errors.push(`Row ${row}: missing String.`);
    if (sub && !includesCI(text, sub)) errors.push(`Row ${row}: "${sub}" not found in the text.`);
    if (!type) errors.push(`Row ${row}: missing Type.`);
    if (!isUriValid(uri)) errors.push(`Row ${row}: invalid URI ("${uri}"). Use http(s)://... or prefix:suffix.`);

    // -------- WARNINGS (do not block) --------
    if (type === "Type" || type === "E55_Type") warnings.push(`Row ${row}: very generic Type (${type}).`);

    // Duplicate: String + Type
    if (sub && type) {
      const dupKey = `${sub.toLowerCase()}||${type}`;
      if (seenSubType.has(dupKey)) warnings.push(`Duplicate String+Type: "${sub}" + ${type}.`);
      else seenSubType.add(dupKey);
    }

    // Duplicate: URI
    if (uri) {
      if (seenUri.has(uri)) warnings.push(`Duplicate URI: "${uri}" (rows ${seenUri.get(uri)} and ${row}).`);
      else seenUri.set(uri, row);
    }

    // Duplicate: Label + Type
    if (label && type) {
      const key = `${label.toLowerCase()}||${type}`;
      if (seenLabelType.has(key)) warnings.push(`Duplicate Label+Type: "${label}" + ${type} (rows ${seenLabelType.get(key)} and ${row}).`);
      else seenLabelType.set(key, row);
    }
  });

  return { errors, warnings };
}

function showExecuteWarning(msg){
  const el = document.getElementById('execute-warning');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function clearExecuteWarning(){
  const el = document.getElementById('execute-warning');
  if (!el) return;
  el.textContent = '';
  el.style.display = 'none';
}

function updateExecuteState() {
  const btn = document.getElementById('execute-triple-btn');
  const entities = getEntitiesFromTable();
  const text = document.getElementById('userText')?.value || "";

  if (!entities || entities.length === 0) {
    btn.disabled = true;
    clearExecuteWarning();
    showExecuteError("Error: The Entities Table is empty. Please add at least one entity before clicking Execute.");
    return 1;
  }

  const { errors, warnings } = validateEntitiesForExtraction(entities, text);

  if (errors.length) {
    btn.disabled = true;
    clearExecuteWarning();
    showExecuteError("Error: Fix the entities before Execute:\n• " + errors.join("\n• "));
    return 0;
  }

  btn.disabled = false;
  clearExecuteError();

  if (warnings.length) {
    showExecuteWarning("Warning:\n• " + warnings.slice(0, 6).join("\n• ")
      + (warnings.length > 6 ? `\n… +${warnings.length - 6} more` : ""));
  } else {
    clearExecuteWarning();
  }
}

// returns the relation extractions for the entities.json 
// using servlet request ConvertJSONtoRDFTriples
async function RDFTriples(){
    if(updateExecuteState()) return;
    setRelBusy(true);
    setBackDisabled(true);
    
    const json = {
        text: document.getElementById('userText').value,
        entities: getEntitiesFromTable(),
        model: document.getElementById('relationllmChoice').value,
        prompt: document.getElementById("promptTemplate").value,
        prefixes: getPrefixesFromUI()
    };
    var jsonData = JSON.stringify(json);

    const xhr = new XMLHttpRequest();
    xhr.onload = async function () {
        if (xhr.status === 200) {
            
            setRelBusy(false);
            setBackDisabled(false);
            document.getElementById('validation').style.display = "block";
            hide("RelationExtraction");
            lockEntitiesTab();
            unlockRdfTab();
            unlockDrawioTab();
            document.getElementById('back-btn-relation').style.display = "block";
            document.getElementById('back-btn-entity').style.display = "none";

            const res = JSON.parse(xhr.responseText);  
            const nt = res.triples;
            const lockedCount = res.lockedCount;
            
            window.APP.triples = TriplesArray(nt);
            displayTriplesInTable(window.APP.triples, lockedCount);
//            console.log(json.model + "\n"+nt);

            showTab(null, 'triples');
            prefixes();
            
        } else {
            console.error("Conversion failed", xhr.responseText);
        }
  };
  xhr.onerror = function () {
    setRelBusy(false);
    console.error("Network error");
  };
  
  xhr.open('POST', 'ConvertJSONtoRDFTriples');
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(jsonData);
}

// Parses an N-Triples (.nt) string into an array of {subject, predicate, object}
// and shortens known URIs to prefixed form.
function TriplesArray(nt) {
  if (!nt) return [];

  const PREFIXES = (window.RDF_PREFIXES || {
    forth: 'http://www.ics.forth.gr/isl/',
    rdf:   'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs:  'http://www.w3.org/2000/01/rdf-schema#',
    crm:   'http://www.cidoc-crm.org/cidoc-crm/'
  });

  const nsList = Object.entries(PREFIXES); 
  const baseList = nsList.map(([k,v]) => [v, k + ':']);
  const tripleRe = /^(<[^>]+>|[\w-]+:[^\s]+)\s+(<[^>]+>|[\w-]+:[^\s]+)\s+(.+?)\s*\.\s*$/;
  const unbracket = s => (s.startsWith('<') && s.endsWith('>')) ? s.slice(1, -1) : s;
  const shorten = (val) => {
    if (/^[\w-]+:[^\s]+$/.test(val)) return val;
    if (val.startsWith('<') && val.endsWith('>')) {
      const iri = val.slice(1, -1);
      for (const [base, pref] of baseList) {
        if (iri.startsWith(base)) return pref + iri.slice(base.length);
      }
      return iri; 
    }
    return val; 
  };

  return nt
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#') && !/^PREFIX\b/i.test(l))
    .map(line => {
      const m = line.match(tripleRe);
      if (!m) return null;

      const subjRaw = m[1];
      const predRaw = m[2];
      let objRaw    = m[3];

      if (objRaw.startsWith('"')) {
        const lit = objRaw.match(/^"((?:\\.|[^"\\])*)"(?:@[a-zA-Z\-]+|\^\^<[^>]+>)?$/);
        const literal = lit ? lit[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : objRaw;
        return {
          subject: shorten(subjRaw),
          predicate: shorten(predRaw),
          object: literal
        };
      }

      return {
        subject: shorten(subjRaw),
        predicate: shorten(predRaw),
        object: shorten(objRaw)
      };
    })
    .filter(Boolean);
}

// Renders the given RDF triples into the RDF table 
// by clearing the tbody and appending one row per triple.
function displayTriplesInTable(triples, lockCount = 0) {
  const tbody = document.getElementById('rdf-table-body');
  if (!tbody) return;
  tbody.innerHTML = "";

  (triples || []).forEach((t, i) => {
    addRdfRow({
      ...t,
      locked: i < lockCount
    });
  });
  validateRdfTableWarnings();
}

// Appends one editable RDF triple row (subject/predicate/object)
// with double-click link opening and prefix-locking, plus a delete action.
function addRdfRow(triple = {}){
  const tbody = document.getElementById('rdf-table-body');
  if (!tbody) return;

  const locked = !!triple.locked; // ✅ lock flag per row

  const tr = document.createElement('tr');
  if (locked) tr.classList.add('rdf-row-locked');

  const tdS = document.createElement('td');
  tdS.className = 'rdf-col-subject';
  tdS.contentEditable = locked ? "false" : "true";
  tdS.style.color = "white";
  tdS.style.textDecoration = "underline";
  tdS.style.cursor = "pointer";
  tdS.title = "Double-click to open link";
  tdS.textContent = triple.subject || '';

  tdS.addEventListener('dblclick', function() {
    let url = tdS.textContent.trim();
    if (url.startsWith("forth:")) url = 'http://www.ics.forth.gr/isl/' + url.slice("forth:".length);
    if (url.startsWith("http://") || url.startsWith("https://")) window.open(url, '_blank', 'noopener,noreferrer');
  });
  if (tdS.textContent.trim().startsWith("forth:")) lockPrefixEditable(tdS, "forth:");

  const tdP = document.createElement('td');
  tdP.className = 'rdf-col-predicate';
  tdP.contentEditable = locked ? "false" : "true";
  tdP.style.color = "white";
  tdP.style.textDecoration = "underline";
  tdP.style.cursor = "pointer";
  tdP.title = "Double-click to open link";
  tdP.textContent = triple.predicate || '';

  tdP.addEventListener('dblclick', function() {
    let url = tdP.textContent.trim();
    if (url.startsWith("rdf:"))  url = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' + url.slice("rdf:".length);
    if (url.startsWith("rdfs:")) url = 'http://www.w3.org/2000/01/rdf-schema#' + url.slice("rdfs:".length);
    if (url.startsWith("crm:"))  url = 'http://www.cidoc-crm.org/cidoc-crm/' + url.slice("crm:".length);
    if (url.startsWith("http://") || url.startsWith("https://")) window.open(url, '_blank', 'noopener,noreferrer');
  });

  const ptxt = tdP.textContent.trim();
  if (ptxt.startsWith("rdf:"))  lockPrefixEditable(tdP, "rdf:");
  if (ptxt.startsWith("rdfs:")) lockPrefixEditable(tdP, "rdfs:");
  if (ptxt.startsWith("crm:"))  lockPrefixEditable(tdP, "crm:");

  const tdO = document.createElement('td');
  tdO.className = 'rdf-col-object';
  tdO.contentEditable = locked ? "false" : "true";
  tdO.textContent = triple.object || '';

  tdO.addEventListener('dblclick', function() {
    let url = tdO.textContent.trim();
    if (url.startsWith("crm:"))   url = 'http://www.cidoc-crm.org/cidoc-crm/' + url.slice("crm:".length);
    if (url.startsWith("forth:")) url = 'http://www.ics.forth.gr/isl/' + url.slice("forth:".length);
    if (url.startsWith("rdf:"))   url = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' + url.slice("rdf:".length);
    if (url.startsWith("rdfs:"))  url = 'http://www.w3.org/2000/01/rdf-schema#' + url.slice("rdfs:".length);
    if (url.startsWith("http://") || url.startsWith("https://")) window.open(url, '_blank', 'noopener,noreferrer');
  });

  const otxt = tdO.textContent.trim();
  if (/^(crm:|rdf:|rdfs:|forth:)/.test(otxt)) {
    tdO.style.color = "white";
    tdO.style.textDecoration = "underline";
    tdO.style.cursor = "pointer";
    tdO.title = "Double-click to open link";

    if (otxt.startsWith("crm:"))   lockPrefixEditable(tdO, "crm:");
    if (otxt.startsWith("rdf:"))   lockPrefixEditable(tdO, "rdf:");
    if (otxt.startsWith("rdfs:"))  lockPrefixEditable(tdO, "rdfs:");
    if (otxt.startsWith("forth:")) lockPrefixEditable(tdO, "forth:");
  }

  const tdActions = document.createElement('td');

  if (!locked) {
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.type='button';
    delBtn.title='Delete';
    delBtn.textContent = '🗑';
    delBtn.addEventListener('click', ()=>{
      tr.remove();
      const entities = getEntitiesFromTable();
      renderAnnotatedFromEntities(entities);
      const validationStatus = document.getElementById('validation-status');

      if (validationStatus && validationStatus.textContent.trim() !== "") {
          validator();
      }
    });
    tdActions.append(delBtn);
  }

  tr.append(tdS, tdP, tdO, tdActions);
  tbody.appendChild(tr);
}
    
document.addEventListener('DOMContentLoaded', ()=>{
  const addBtn = document.getElementById('add-rdf-row');
  if (addBtn) addBtn.addEventListener('click', ()=> addRdfRow({}));
});
    
    
// Reads the RDF triples table (#rdf-table-body) 
// and returns a cleaned array of {subject, predicate, object} rows.
function getTriplesFromTable() {
  const tbody = document.getElementById("rdf-table-body");
  if (!tbody) return [];

  const readCell = (cell) => {
    if (!cell) return "";
    const control = cell.querySelector("input, select, textarea");
    if (control) return (control.value ?? "").trim();
    return (cell.textContent ?? "").trim();
  };

  return Array.from(tbody.querySelectorAll("tr"))
    .map(tr => {
      const tds = tr.querySelectorAll("td");
      if (tds.length < 3) return null;

      const triple = {
        subject: readCell(tds[0]),
        predicate: readCell(tds[1]),
        object: readCell(tds[2]),
      };

      const allEmpty = !triple.subject && !triple.predicate && !triple.object;
      return allEmpty ? null : triple;
    })
    .filter(Boolean);
}


// Serializes an array of triples into N-Triples (.nt), 
// expanding known prefixes to full IRIs and quoting literals.
function triplesToNT(triples) {
  const PREFIXES = window.RDF_PREFIXES || {
    forth: "http://www.ics.forth.gr/isl/",
    rdf:   "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs:  "http://www.w3.org/2000/01/rdf-schema#",
    crm:   "http://www.cidoc-crm.org/cidoc-crm/"
  };

  const expandTerm = (t, isObject = false) => {
    t = String(t ?? "").trim();
    if (!t) return isObject ? '""' : "";
    if (t.startsWith("_:")) return t;
    if (t.startsWith("<") && t.endsWith(">")) return t;
    if (/^https?:\/\//i.test(t)) return `<${t}>`;

    const m = t.match(/^([\w-]+):(.+)$/);
    if (m && PREFIXES[m[1]]) return `<${PREFIXES[m[1]]}${m[2]}>`;

    if (isObject) {
      if (t.startsWith('"')) return t;
      return `"${escapeLiteral(t)}"`;
    }

    return t;
  };

  const escapeLiteral = (s) =>
    String(s)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");

  return triples
    .map(tr => {
      const s = expandTerm(tr.subject, false);
      const p = expandTerm(tr.predicate, false);
      const o = expandTerm(tr.object, true);

      if (!s || !p || !o) return null;
      return `${s} ${p} ${o} .`;
    })
    .filter(Boolean)
    .join("\n") + "\n";
}

// Downloads the current RDF triples table contents as a triples.nt 
// file in valid N-Triples format.
function downloadTriples() {

  const rows = getTriplesFromTable(); // [{subject,predicate,object}, ...]
  const nt   = rows.length ? triplesToNT(rows) : "";

  if (!nt.trim()) { alert("No N-Triples to download"); return; }

  const blob = new Blob([nt], { type: "application/n-triples;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = "triples.nt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

//===== Relation Extraction =====



// ===== prefixes =====
// shows and other prefixes after extract relations
function prefixes(){
    const title = document.getElementById('titlebutton');
    title.innerHTML = "Prefixes & Validation";
    show("validation");
}

// Prevents editing of the given prefix in a contentEditable cell by keeping
//  the caret after it and restoring it on input.
function lockPrefixEditable(td, prefix = "forth:") {
  const ensurePrefix = () => {
    const t = td.textContent || "";
    if (!t.startsWith(prefix)) td.textContent = prefix + t.replace(/^(\w+:)?/, "");
  };
  
  const caretPos = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;
    const range = sel.getRangeAt(0).cloneRange();
    range.selectNodeContents(td);
    range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);
    return range.toString().length;
  };

  const setCaret = (pos) => {
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();

    const range = document.createRange();
    const node = td.firstChild; 
    const safePos = Math.max(0, Math.min(pos, (node?.textContent || "").length));
    range.setStart(node || td, safePos);
    range.collapse(true);
    sel.addRange(range);
  };

  td.addEventListener("click", () => {
    ensurePrefix();
    const pos = caretPos();
    if (pos < prefix.length) setCaret(prefix.length);
  });

  td.addEventListener("keydown", (e) => {
    ensurePrefix();

    const pos = caretPos();
    if (e.key === "Backspace" && pos <= prefix.length) {
      e.preventDefault();
      setCaret(prefix.length);
      return;
    }
    if (e.key === "Delete" && pos < prefix.length) {
      e.preventDefault();
      setCaret(prefix.length);
      return;
    }

    if (pos < prefix.length && e.key.length === 1) {
      e.preventDefault();
      setCaret(prefix.length);
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "x") {
      const sel = window.getSelection();
      const selected = sel ? sel.toString() : "";
      if (selected && td.textContent.startsWith(prefix) && selected.includes(prefix)) {
        e.preventDefault();
        setCaret(prefix.length);
      }
    }
  });

  td.addEventListener("input", () => {
    const old = td.textContent || "";
    if (!old.startsWith(prefix)) {
      td.textContent = prefix + old.replace(/^(\w+:)?/, "");
      setCaret(prefix.length);
    }
  });
  
  ensurePrefix();
}


function normalizePrefixId(id){
  return String(id || "").trim().replace(/:$/, "");
}

function normalizeNs(ns){
  let s = String(ns || "").trim();
  if (!s) return "";
  if (!/[\/#]$/.test(s)) s += "/"; 
  return s;
}
function showAddPrefixError(msg){
  const el = document.getElementById("add-prefix-error");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
}

function clearAddPrefixError(){
  const el = document.getElementById("add-prefix-error");
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}

function isValidBaseUri(ns){
  const s = String(ns || "").trim();
  if (!s) return { ok:false, msg:'Base URI is required. Example: https://example.org/ns#' };

  let u;
  try { u = new URL(s); }
  catch(e){ return { ok:false, msg:'Invalid base URI. Use a full URL like https://example.org/ns#' }; }

  if (u.protocol !== "https:" && u.protocol !== "http:") {
    return { ok:false, msg:'Base URI must start with http:// or https:// (recommended: https://).' };
  }

  const host = u.hostname || "";
  if (!host.includes(".") && host !== "localhost") {
    return { ok:false, msg:'Invalid hostname. Use a hostname with a dot (e.g. example.org) or localhost.' };
  }

  const afterHost = u.href.slice(u.origin.length);
  const pathOnly = (afterHost.split(/[?#]/)[0] || "");
  if (/\/{2,}/.test(pathOnly)) {
    return { ok:false, msg:'Invalid base URI. Avoid repeated slashes (e.g. https://example.org/ns/ not https://example.org////).' };
  }

  return { ok:true, msg:"" };
}

function addPrefix(){
  const grid = document.querySelector("#settings-bar .prefix-grid");
  if (!grid) return;

  const idEl  = document.getElementById("new-prefix-id");
  const uriEl = document.getElementById("new-prefix-uri");
  if (!idEl || !uriEl) return;

  clearAddPrefixError();

  const prefixId = normalizePrefixId(idEl.value);
  const nsRaw = (uriEl.value || "").trim();
  const ns = normalizeNs(nsRaw);

  if (!prefixId) {
    showAddPrefixError('Prefix id is required (e.g. "skos").');
    idEl.focus();
    return;
  }

  if (!/^[A-Za-z][A-Za-z0-9_.-]*$/.test(prefixId)) {
    showAddPrefixError('Invalid prefix id. It must start with a letter and contain only letters, numbers, "_", ".", "-". Example: skos');
    idEl.focus();
    return;
  }

  if (!ns) {
    showAddPrefixError('Base URI is required. Example: https://example.org/ns#');
    uriEl.focus();
    return;
  }

  const check = isValidBaseUri(ns);
  if (!check.ok) {
    showAddPrefixError(check.msg);
    uriEl.focus();
    return;
  }

  const inputId = `prefix-${prefixId}`;

  if (document.getElementById(inputId)) {
    showAddPrefixError(`Prefix "${prefixId}:" already exists. Choose a different id.`);
    idEl.focus();
    return;
  }

  const label = document.createElement("label");
  const span = document.createElement("span");
  span.textContent = `${prefixId}:`;

  const input = document.createElement("input");
  input.id = inputId;
  input.type = "text";
  input.value = ns;

  label.append(span, input);
  grid.appendChild(label);

  idEl.value = "";
  uriEl.value = "";
  idEl.focus();

  window.RDF_PREFIXES = getPrefixesFromUI();
  clearAddPrefixError();
}

// ===== prefixes =====



// ===== prompt/text =====
async function setMode(scope, which) {
    const isPrompt = (which === "prompt");
    const toggle = document.querySelector(`.mode-toggle[data-scope="${scope}"]`);
    if (!toggle) return;

    const tabs = toggle.querySelectorAll(".mode-tab");
    const textBtn = tabs[0];
    const promptBtn = tabs[1];

    textBtn?.classList.toggle("is-active", !isPrompt);
    promptBtn?.classList.toggle("is-active", isPrompt);
    textBtn?.setAttribute("aria-selected", String(!isPrompt));
    promptBtn?.setAttribute("aria-selected", String(isPrompt));

    if (scope === "entity") {
      const wrapperEl = document.getElementById("textAreaWrapper");
      const footerLeftEl = document.getElementById("footerLeft");
      const promptPreviewEl = document.getElementById("promptPreview");
      const copyBtn = document.getElementById("copyPrompt");

      if (!wrapperEl || !promptPreviewEl) return;
      if (copyBtn) {
        copyBtn.style.display = "inline-flex";
        copyBtn.title = isPrompt ? "Copy prompt" : "Copy text";
        copyBtn.setAttribute("aria-label", copyBtn.title);
      }

      if (isPrompt) {
        promptPreviewEl.textContent = "Loading prompt…";

        try {
          await buildPromptTemplate();
        } catch (e) {
          console.error(e); 
        }

        wrapperEl.classList.add("is-prompt");
        if (footerLeftEl) footerLeftEl.textContent = "Prompt preview";
        promptPreviewEl.setAttribute("aria-hidden", "false");
        promptPreviewEl.textContent = composePrompt();
        return;
      }

      wrapperEl.classList.remove("is-prompt");
      if (footerLeftEl) footerLeftEl.textContent = "Text input";
      promptPreviewEl.setAttribute("aria-hidden", "true");
      return;
    }

    if (scope === "relation") {
      const wrap = document.querySelector(".relation-main");
      const annotatedPanel = wrap?.querySelector(".annotated-panel");
      const legend = document.getElementById("annotated-legend");
      const promptWrap = document.getElementById("relPromptWrap");
      const footer = document.getElementById("relationFooter");
      const pre = document.getElementById("promptPreview1");
      const copyBtn = document.getElementById("copyPrompt1");

      if (copyBtn) {
        copyBtn.style.display = "inline-flex";
        copyBtn.title = isPrompt ? "Copy prompt" : "Copy annotated text";
        copyBtn.setAttribute("aria-label", copyBtn.title);
      }

      if (isPrompt) {
        if (annotatedPanel) annotatedPanel.style.display = "none";
        if (legend) legend.style.display = "none";
        if (promptWrap) promptWrap.style.display = "block";
        if (footer) footer.style.display = "flex";
        if (pre) pre.setAttribute("aria-hidden", "false");
      } else {
        if (annotatedPanel) annotatedPanel.style.display = "";
        if (legend) legend.style.display = "";
        if (promptWrap) promptWrap.style.display = "none";
        if (footer) footer.style.display = "none";
        if (pre) pre.setAttribute("aria-hidden", "true");
      }

      return;
    }
}

// Copies the RelationExtraction prompt preview (#promptPreview1) to the clipboard and briefly shows a success checkmark on the copy button.
document.getElementById("copyPrompt1")?.addEventListener("click", async () => {
  const btn = document.getElementById("copyPrompt1");
  const pre = document.getElementById("promptPreview1");
  if (!btn || !pre) return;

  const old = btn.textContent;

  try {

    await navigator.clipboard.writeText(pre.textContent || "");

    btn.textContent = "✓";
    setTimeout(() => (btn.textContent = old || "⧉"), 900);
  } catch (e) {
    console.error(e);
  }
});


async function loadRelationPromptTemplate() {
  const method = document.getElementById("promptTemplate").value;

  const json = {
    text: document.getElementById("userText").value,
    entities: getEntitiesFromTable(),
    method: method,
    prefixes: getPrefixesFromUI()
  };

  const cacheKey = JSON.stringify(json);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
            const data = JSON.parse(xhr.responseText);

            if (xhr.status !== 200) {
              throw new Error(data.error || "Request failed");
            }

            const prompt = data.prompt || "Prompt not loaded.";
            resolve(prompt);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error("Conversion failed: " + xhr.responseText));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network error"));
    };

    xhr.open("POST", "readRelationPrompt");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(json));
  });
}



// Disables/enables the RDF tab button to prevent access until RDF triples are available.
const rdfBtn = document.getElementById("tabRdfBtn");
function lockRdfTab() {
  rdfBtn.disabled = true;
  rdfBtn.classList.add("is-disabled");
  rdfBtn.setAttribute("aria-disabled", "true");
}
function unlockRdfTab() {
  rdfBtn.disabled = false;
  rdfBtn.classList.remove("is-disabled");
  rdfBtn.removeAttribute("aria-disabled");
}

const drawioBtn = document.getElementById("tabDrawio");
function lockDrawioTab() {
  drawioBtn.disabled = true;
  drawioBtn.classList.add("is-disabled");
  drawioBtn.setAttribute("aria-disabled", "true");
}

function unlockDrawioTab() {
  drawioBtn.disabled = false;
  drawioBtn.classList.remove("is-disabled");
  drawioBtn.removeAttribute("aria-disabled");
}

const entitiesBtn = document.getElementById("tabEntities");
function lockEntitiesTab(){
  entitiesBtn.disabled = true;
  entitiesBtn.classList.add("is-disabled");
  entitiesBtn.setAttribute("aria-disabled", "true");
}
function unlockEntitiesTab(){
  entitiesBtn.disabled = false;
  entitiesBtn.classList.remove("is-disabled");
  entitiesBtn.setAttribute("aria-disabled", "true");
}

 

(() => {
  const btn = document.getElementById("toggle-settings");
  const panel = document.getElementById("settings-bar");
  if (!btn || !panel) return;

  function openPanel(){
    panel.hidden = false;                 
    requestAnimationFrame(() => {
      panel.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    });
  }

  function closePanel(){
    panel.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");

    const onEnd = (e) => {
      if (e.propertyName !== "max-height") return;
      panel.hidden = true;
      panel.removeEventListener("transitionend", onEnd);
    };
    panel.addEventListener("transitionend", onEnd);
  }

  btn.addEventListener("click", () => {
    const isOpen = panel.classList.contains("is-open") && !panel.hidden;
    isOpen ? closePanel() : openPanel();
  });
  
  document.addEventListener("click", (e) => {
  const isOpen = panel.classList.contains("is-open") && !panel.hidden;
  if (!isOpen) return;

  const clickedInsidePanel = panel.contains(e.target);
  const clickedToggleBtn = btn.contains(e.target);

  if (!clickedInsidePanel && !clickedToggleBtn) {
    closePanel();
  }
});
  
})();


function getEntitiesForPrompt() {
  const arr =  window.APP?.entities;
  if (!arr && typeof getEntitiesFromTable === "function") return getEntitiesFromTable();
  return Array.isArray(arr) ? arr : [];
}


async function updateRelationPromptPreview() {
  const pre = document.getElementById("promptPreview1");
  const promptBtn = document.getElementById("modePrompt");
  document.getElementById("loading").textContent = "prompt preview  loading...";
  const prompt = await loadRelationPromptTemplate();
  if (pre) pre.textContent = prompt;
  document.getElementById("loading").textContent = "prompt preview";
}

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("promptTemplate");

  sel?.addEventListener("change", () => {
    const promptWrap = document.getElementById("relPromptWrap");
    if (promptWrap && promptWrap.style.display !== "none") {
      updateRelationPromptPreview();
    }
  });

  setMode("text");
});
