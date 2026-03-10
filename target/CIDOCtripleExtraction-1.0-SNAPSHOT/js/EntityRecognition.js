
//----------------- global ------------------
//===== usefull ids and global parameters =====
const inputText = document.getElementById("userText");
const promptTemplate = document.getElementById("prompt-select");
const promptPreview = document.getElementById("promptPreview");
const option = document.getElementById('llmChoice');
const select = document.getElementById("prompt-select");
const hover = document.getElementById("prompt-hover");
const promptContent = document.getElementById("prompt-content");
const relationPromptSelect = document.getElementById("promptTemplate");
const llmChoice = document.getElementById("llmChoice");
const relationllmChoice = document.getElementById("relationllmChoice");

// in order llm choice in relation extraction follow llm choice in entity recognition
llmChoice.addEventListener("change", function () {
  relationllmChoice.value = llmChoice.value;
});
// in order method in relation extraction follow method in entity recognition
promptTemplate.addEventListener("change", function () {
  relationPromptSelect.selectedIndex = promptTemplate.selectedIndex;
});

relationllmChoice.value = llmChoice.value;
relationPromptSelect.selectedIndex = promptTemplate.selectedIndex;


window.APP = { text: '', entities: [], triples: [] } // for global access

const LLM = { // which llm selected in order to know which servlet to run 
  "gpt-4o-2024-08-06": "ChatGPTAPI",
  "gpt-4o-mini": "ChatGPTAPI",
  "deepseek-chat": "DeepSeekAPI",
  "gemini-2.5-flash": "GeminiAPI"   
};

const descriptions = { // prompt description
  basic: "Fast • less strict",
  zero_shot: "Balanced • no examples",
  few_shot: "Best accuracy • uses examples",
  allClasses: "Heavier prompt • helps class coverage",
  descriptiveClasses: "Most guidance • reduces ambiguity"
};

let IDnumber = 0; // for calculate the legth of the entities table 
//===== usefull ids and global parameters =====



// ===== Global prefixes (state)=====
function getPrefixesFromUI() {
  const defaults = {
    forth: "http://www.ics.forth.gr/isl/",
    rdf:   "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs:  "http://www.w3.org/2000/01/rdf-schema#",
    crm:   "http://www.cidoc-crm.org/cidoc-crm/"
  };

  const prefixes = { ...defaults };

  const coreIds = ["forth","rdf","rdfs","crm"];
  coreIds.forEach((k) => {
    const el = document.getElementById(`prefix-${k}`);
    const v = (el?.value || "").trim();
    prefixes[k] = v || defaults[k];
  });

  document.querySelectorAll('#settings-bar input[id^="prefix-"]').forEach((inp) => {
    const id = inp.id;               
    const key = id.slice("prefix-".length); 
    if (!key || coreIds.includes(key)) return;

    const v = (inp.value || "").trim();
    if (v) prefixes[key] = v;
  });

  return prefixes;
}

function readCellValue(td) {
  if (!td) return "";

  var field = td.querySelector("input, textarea, select");
  if (field) {
    var v = field.value;
    return String(v != null ? v : "").trim();
  }

  var t = td.textContent; 
  return String(t != null ? t : "").trim();
}

function getPrefixMap() {
  var p = getPrefixesFromUI();

  Object.keys(p).forEach(function(k) {
    p[k] = String(p[k] != null ? p[k] : "").trim();
  });

  return p;
}

window.RDF_PREFIXES = getPrefixesFromUI();
// ===== Global prefixes (state)=====
// ----------------------------------------------------




//----------------- functions -------------------------

// ===== Text =====
function clearUserText(){
  if (!inputText) return;
  inputText.value = '';
  inputText.focus();
  updatePromptPreview();
}

// Loads an example text into the textarea and forces the UI back to Text mode,
// updating related UI labels and triggering an input refresh.
function loadText() {
    
   const modeText = document.getElementById("modeText");
   const modePrompt = document.getElementById("modePrompt");
   const example =
     "On July 21, 1928, Konstantinos Karyotakis committed suicide in Vathi, Preveza,"
     +" using a revolver and leaving behind a letter. The weapon and the letter are today in the Benaki Museum, with the unique identifiers 10 and 9 respectively.";

   const inputText = document.getElementById("userText");
   const wrapper = document.getElementById("textAreaWrapper");

   inputText.value = example;

   if (wrapper) wrapper.classList.remove("is-prompt");

   const modeTextBtn = document.getElementById("modeText");
   const modePromptBtn = document.getElementById("modePrompt");
   if (modeTextBtn && modePromptBtn) {
     modeTextBtn.classList.add("is-active");
     modePromptBtn.classList.remove("is-active");
     modeTextBtn.setAttribute("aria-selected", "true");
     modePromptBtn.setAttribute("aria-selected", "false");
   }

   const footerLeft = document.getElementById("footerLeft");
//   if (footerLeft) footerLeft.textContent = "Text input";

   inputText.dispatchEvent(new Event("input", { bubbles: true }));
}
 
// Keeps the prompt preview in sync by updating it on text input changes and prompt template selection changes.
inputText.addEventListener("input", updatePromptPreview);

// ===== Text =====



// ===== Prompt =====
// Update dercription after select another prompt
function updatePromptDescription(){
  const sel = promptTemplate;
  const hint = document.getElementById("prompt-desc");
  if (!sel || !hint) return;

  const update = () => {
    hint.textContent = descriptions[sel.value] || "";
  };

  sel.addEventListener("change", update);
  update(); 
}
document.addEventListener("DOMContentLoaded", updatePromptDescription); 

// if the server fails load this in prompt preview
let currentPromptTemplate = `You are an entity recognition system.
Extract entities from the given text.
Return JSON array with fields: id, label, type, string, uri (optional).

TEXT:
"""{{TEXT}}"""`;

// Builds the prompt preview loading it from the prompt folders
const promptCache = new Map();
async function buildPromptTemplate() {
  const promptName = (promptTemplate?.value || "basic") + "_prompt";

  if (promptCache.has(promptName)) {
    currentPromptTemplate = promptCache.get(promptName);
    return currentPromptTemplate;
  }

  const res = await fetch(`readPrompt?name=${encodeURIComponent(promptName)}`);
  if (!res.ok) throw new Error("Prompt not found: " + promptName);

  const text = await res.text();
  promptCache.set(promptName, text);
  currentPromptTemplate = text;
  return text;
}

// composes prompt with the user's input to see the final prompt that have to send in llm
function composePrompt() {
  const raw = inputText.value ?? "";
  const userText = raw.trim();

  if (!userText) return currentPromptTemplate || "";

  const injected = `"""${raw}"""`;

  return (currentPromptTemplate || "")
    .replaceAll("{TEXT}", injected)
    .replaceAll("[TEXT]", injected)
    .replaceAll("{{TEXT}}", injected);
}

// Updates the prompt preview area
async function updatePromptPreview() {
  if (!document.getElementById("textAreaWrapper").classList.contains("is-prompt")) return;

  try {
    await buildPromptTemplate();
  } catch (err) {
    console.error(err);
  }

  promptPreview.textContent = composePrompt();
}

// Copies the composed prompt to the clipboard (regardless of current mode) and briefly shows a success checkmark.
const copyPrompt = document.getElementById("copyPrompt");
copyPrompt.addEventListener("click", async () => {
  try {
    await buildPromptTemplate();
    await navigator.clipboard.writeText(composePrompt());

    copyPrompt.textContent = "✓";
    setTimeout(() => (copyPrompt.textContent = "⧉"), 900);
  } catch (e) {
    console.error(e);
  }
});

promptTemplate.addEventListener("change", updatePromptPreview);
// ===== Prompt =====



//===== Entity Recognition =====
//(request to servlet based on the llm)

// Sends the given data to the EntitiesTable endpoint
//  and resolves with the parsed entities JSON response in order to set table
function displayEntitiesInTable(data){
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function(){
      if (xhr.status === 200){
        try {
          const entities = JSON.parse(xhr.responseText);
          resolve(entities);
        } catch (e){ reject(e); }
      } else {
        reject(new Error("EntitiesTable failed: " + xhr.status));
      }
    };
    xhr.onerror = () => reject(new Error("Network error calling EntitiesTable"));
    xhr.open('POST', 'EntitiesTable');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
  });
}


async function sendQuestion() { // returns the entities 
    const err = document.getElementById("executeError");

    // clear previous
    if (err) { err.textContent = ""; err.classList.remove("is-visible"); }

    if (!inputText || !inputText.value.trim()) {
        if (err) {
            err.textContent = "Please insert text before executing.";
            err.classList.add("is-visible");
        }
        inputText?.focus();
        return;
    }

    const btn = document.getElementById('execute-span');
    const btnOuter = document.getElementById('execute-btn');
    btnOuter.disabled = true;

    const originalText = btn.textContent;
    let dots = 0;

    btn._loadingTimer = setInterval(() => {
        dots = (dots + 1) % 4; // 0..3
        btn.textContent = "Loading" + ".".repeat(dots);
    }, 350);
    
    IDnumber = 0;

    const data = {
        question: document.getElementById('userText').value,
        model: option.value,
        prompt: select.value + '_prompt'
    };

    const LLMoption = LLM[option.value] || "ChatGPTAPI";

    const xhr = new XMLHttpRequest();
    xhr.onload = async function() {
        clearInterval(btn._loadingTimer);
        btn._loadingTimer = null;
        btnOuter.disabled = false;
        btn.textContent = originalText;

        if (xhr.status === 200) {
            const obj = JSON.parse(xhr.responseText);
            let txt = (obj.message || "").trim().replace(/^json\s*/i, "");
            txt = txt.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();

            const parsed = JSON.parse(txt);
            const entities = Array.isArray(parsed) ? parsed : (parsed.entities || []);   
            lockRdfTab();
            lockDrawioTab();
            hide("EntityRecognition");
            show("RelationExtraction");
            document.getElementById("response").style.display = "block";
            document.getElementById("back-btn-entity").style.display = "block";

            showTab(null, 'entities');

            setEntitiesInTable(entities);
            renderAnnotatedFromEntities(entities);
            window.APP.entities = entities;

            updateExecuteState();
            document.getElementById("promptPreview1").textContent = await loadRelationPromptTemplate();

        } else {
            let errorMsg = "Request failed. Status: " + xhr.status;
            try {
                const errorJson = JSON.parse(xhr.responseText);
                if (errorJson.error) errorMsg = errorJson.error;
            } catch(e) { /* use default message */ }

            document.getElementById('response').innerHTML = 
                '<div style="color:red; padding:10px; border:1px solid red;">' + 
                '<strong>Error:</strong> ' + errorMsg + 
                '</div>';
            document.getElementById("response").style.display = "block";
        }
    };

    xhr.onerror = function() {
        clearInterval(btn._loadingTimer);
        btnOuter.disabled = false;
        btn.textContent = originalText;
        alert("Network error or server is down.");
    };

    xhr.open('POST', LLMoption);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}
// ===== Entities Table =====
// get/download entities table(json), add/change/delete rows on entities table)

// Converts entities to json in order to download
function tableEntitiesToJSON(rows){
  return rows
    .filter(r => r.label || r.type || r.uri || r.substring)  
    .map(r => ({
      "label": r.label,
      "CIDOC-CRM class": "http://www.cidoc-crm.org/cidoc-crm/" + r.type,
      "URI": r.uri,
      "substring": r.substring
    }));
}

// download entities in json 
function downloadJSON() {
  const rows = getEntitiesFromTable();
  const arr  = tableEntitiesToJSON(rows);

  if (!arr.length) {
    alert('No JSON to download');
    return;
  }

  const prefixes = getPrefixesFromUI();

  const fixedArr = arr.map(item => ({
    ...item,
    URI: replacePrefixOnly(item.URI, prefixes)
  }));

  const text = JSON.stringify(fixedArr, null, 2);
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'entities.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function replacePrefixOnly(value, prefixes) {
  if (!value) return value;

  value = String(value).trim();

  const colonIndex = value.indexOf(':');
  if (colonIndex <= 0) return value;

  const prefix = value.slice(0, colonIndex);
  const localPart = value.slice(colonIndex + 1);

  if (!prefixes || !prefixes[prefix]) return value;

  return prefixes[prefix] + localPart;
}

function downloadEntitiesNT(filename = "entities.nt"){
  const entities = (typeof getEntitiesFromTable === "function") ? getEntitiesFromTable() : [];
  if (!entities.length) { alert("No entities to download"); return; }

  const payload = {
    prefixes: getPrefixesFromUI(),
    entities: getEntitiesFromTable()
  };

  const xhr = new XMLHttpRequest();
  xhr.responseType = "text";

  xhr.onload = function(){
    if (xhr.status === 200){
      const nt = (xhr.responseText || "").trim();
      if (!nt) { alert("No triples returned."); return; }

      const blob = new Blob([nt + "\n"], { type: "application/n-triples;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } else {
      alert("downloadEntitiesNT failed. Status: " + xhr.status);
      console.error(xhr.responseText);
    }
  };

  xhr.onerror = () => alert("Network error while generating entities.nt");
  xhr.open("POST", "DownloadEntitiesNTServlet");
  xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  xhr.send(JSON.stringify(payload));
}

// checks if user-added uri is an valid uri (uses default prefixes and user-added) 
function isValidUri(uri){
  const u = String(uri || "").trim();
  if (!u) return false;

  const m = u.match(/^([A-Za-z][\w.-]*):(\S+)$/);
  if (!m) return false;

  const pref = m[1];
  const local = m[2];
  if (!local) return false;

  const prefixes = getPrefixesFromUI();
  return !!(prefixes[pref] && prefixes[pref].trim().length > 0);
}

// Marks a table row as "dirty" (edited): enables/disables its .update-btn and toggles the 'dirty' CSS class.
function markRowDirty(tr, dirty=true){
  const upd = tr.querySelector('.update-btn');

  if (upd){
    const uriText = (tr.querySelector('.col-uri')?.textContent || "").trim();
    const okUri = isValidUri(uriText);

    const labelText = (tr.querySelector('.col-label')?.textContent || "").trim();
    const okLabel = labelText.length > 0;

    const typeVal = (tr.querySelector('.col-type select')?.value || "").trim();
    const okType = typeVal.length > 0;

    upd.disabled = !(dirty && okUri && okLabel && okType);
  }

  tr.classList.toggle('dirty', !!dirty);
}

// Triggers update button when something changes in the cell
function wireEditable(el, tr){
  ['input','blur','keyup','paste'].forEach(ev =>
    el.addEventListener(ev, () => markRowDirty(tr, true))
  );
  
}

// Makes the updates in the row to placed on the annotated text
function applyRowUpdate(tr){
  const entities = getEntitiesFromTable();
  renderAnnotatedFromEntities(entities);     
  markRowDirty(tr, false);
  updateExecuteState();
}

// Reads a single <tr> from the Entities table and returns a normalized entity object (as json)
// (prefers the full URI stored in data-full-uri over the visible text).
function readEntityRow(tr){
  const uriCell = tr.querySelector('.col-uri');

  const textUri = (uriCell?.textContent || "").trim();
  const dataUri = (uriCell?.dataset?.fullUri || "").trim();
  let uri = textUri || dataUri || "";
  if (uriCell) uriCell.dataset.fullUri = uri;

  return {
    id:        tr.children[0]?.textContent.trim() || "",
    uri:       uri,
    label:     tr.querySelector('.col-label')?.textContent.trim() || "",
    type:      tr.querySelector('.col-type select')?.value || "",
    substring: tr.querySelector('.col-string')?.textContent.trim() || ""
  };
}

// Collects all rows in the Entities table body and returns them as an array of entity objects.
function getEntitiesFromTable(){
  return [...document.querySelectorAll('#entities-table-body tr')].map(readEntityRow);
}

// if it is URI keeps only localName
function normalizeTypeKey(t){
  if (!t) return '';
  let s = String(t).trim();
  
  if (/^https?:\/\//i.test(s)) s = s.split(/[\/#]/).pop();
  return s.replace(/\s+/g, '_');
}

// uses prefixes instead uri (forth, crm, rdf, rdfs)
function qnameFromUri(uri) {
  const u = String(uri || "").trim();
  if (!u) return "";

  const prefixes = {
    forth: document.getElementById("prefix-forth")?.value?.trim() || "http://www.ics.forth.gr/isl/",
    crm:   document.getElementById("prefix-crm")?.value?.trim()   || "http://www.cidoc-crm.org/cidoc-crm/",
    rdf:   document.getElementById("prefix-rdf")?.value?.trim()   || "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs:  document.getElementById("prefix-rdfs")?.value?.trim()  || "http://www.w3.org/2000/01/rdf-schema#",
  };

  for (const [p, base] of Object.entries(prefixes)) {
    if (base && u.startsWith(base)) {
      const local = u.slice(base.length);
      return local ? `${p}:${local}` : u;
    }
  }

  const frag = u.split(/[#/]/).pop();
  return frag ? frag : u;
}

// add new row in entities table with or without entity 
function addEntityRow(entity={}){
  const tbody = document.getElementById('entities-table-body');
  const tr = document.createElement('tr');

  const tdId = document.createElement('td');
  tdId.textContent = ++IDnumber;
  
  const tdURI = document.createElement('td');
  tdURI.className = 'col-uri';
  tdURI.contentEditable = "true"; 
  const full = (entity.uri || entity.URI || "forth:").trim();
  const initialUri = full; 
  tdURI.dataset.fullUri = full;
  tdURI.textContent = full;

  tdURI.textContent = qnameFromUri(full);   
  tdURI.style.textDecoration = "underline";
  tdURI.style.cursor = "pointer";
  tdURI.title = "Double-click to open link"; 
  tdURI.addEventListener('dblclick', function() {
    let url = tdURI.textContent.trim();
    url = document.getElementById('prefix-forth').value + url.slice("forth:".length);
    window.open(url, '_blank'); 
  });
  
  const tdLabel = document.createElement('td');
  tdLabel.className = 'col-label';
  tdLabel.contentEditable = "true";
  tdLabel.textContent = entity.label || "";

  const tdType = document.createElement('td');
  tdType.className = 'col-type';
  entity.type = entity.type;
  const rawType = entity.type || entity["CIDOC-CRM class"] || "";
  const typeWidget = makeTypeSelect(normalizeTypeKey(rawType));
  tdType.appendChild(typeWidget);

  const tdString = document.createElement('td');
  tdString.className = 'col-string';
  tdString.contentEditable = "true";
  tdString.textContent = entity.substring ?? "";

  const tdActions = document.createElement('td');
  tdActions.className = 'col-actions';

  const delBtn = document.createElement('button');
  delBtn.className = 'icon-btn';
  delBtn.type='button';
  delBtn.title='Delete';
  delBtn.textContent = '🗑';
  delBtn.addEventListener('click', ()=>{
    tr.remove();
    updateExecuteState();
    const entities = getEntitiesFromTable();      
    renderAnnotatedFromEntities(entities);          
  });

  const updBtn = document.createElement('button');
  updBtn.className = 'icon-btn update-btn';
  updBtn.type='button';
  updBtn.title='Apply updates to views';
  updBtn.textContent = '⟳';          
  updBtn.disabled = true;
  updBtn.addEventListener('click', ()=>{
      applyRowUpdate(tr);
      updateExecuteState();
  });

  tdActions.append(delBtn, updBtn);
  
  tr.append(tdId,  tdURI, tdLabel, tdType, tdString, tdActions);
  tbody.appendChild(tr);

  // activate “dirty” when something changed in the line
  [tdURI, tdLabel, tdType, tdString].forEach(td => wireEditable(td, tr));
}

// sets all the entities to entities table using the addEntityRow
function setEntitiesInTable(entities=[]){
  const tbody = document.getElementById('entities-table-body');
  tbody.innerHTML = "";
  (entities||[]).forEach(addEntityRow);
}

// if push the add-entity-row button adds new row in the entities table without specific entity
document.addEventListener('DOMContentLoaded', ()=>{
  const addBtn = document.getElementById('add-entity-row');
  if (addBtn){
    addBtn.addEventListener('click', ()=>{
      addEntityRow({});
      updateExecuteState();     
    });
  }
});
// ===== Entities Table =====



// ===== Other Actions =====
function setHidden(id, val) {
    
  const el = document.getElementById(id);
  if (el) el.hidden = !!val;
}
function show(id){ setHidden(id, false); } // shows this element with id in the html 
function hide(id){ setHidden(id, true); } // hides this element with id in the html 

function goback() {
  unlockRelationStep1();
  show("EntityRecognition");
  hide("RelationExtraction");

  setMode('relation', 'text');

  document.getElementById("response").style.display = "none";
  document.getElementById("back-btn-entity").style.display = "none";

  unlockEntitiesTab();
  lockRdfTab();
  lockDrawioTab();

  const rdfBody = document.getElementById("rdf-table-body");
  if (rdfBody) rdfBody.innerHTML = "";

  const warningBox = document.getElementById("rdf-table-warning");
  if (warningBox) {
    warningBox.textContent = "";
    warningBox.style.display = "none";
  }

  const promptPreview = document.getElementById("promptPreview1");
  if (promptPreview) promptPreview.textContent = "";

  document.getElementById('EntityRecognition').scrollIntoView({
    behavior: 'auto',
    block: 'start'
  });
}

// for nice/smooth ui changing the buttons
function moveTabIndicator(activeBtn){
  const wrap = activeBtn.closest('.tab-buttons');
  const indicator = wrap.querySelector('.tab-indicator');
  const wrapRect = wrap.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();

  const x = btnRect.left - wrapRect.left - 4;   
  const w = btnRect.width;

  indicator.style.transform = `translateX(${x}px)`;
  indicator.style.width = `${w}px`;
}

// shows the entities table, the rdf triples, the drawio  settings-bar
function showTab(evt, tabName) {
  const buttons = [...document.querySelectorAll('.tab-button')];
  const btnFromEvent = evt?.currentTarget || null;

  const btnFromName =
    buttons.find(b => b.dataset.tab === tabName) ||
    buttons.find(b => (b.getAttribute('onclick') || '').includes(`'${tabName}'`)) ||
    buttons.find(b => (b.getAttribute('onclick') || '').includes(`"${tabName}"`)) ||
    null;

  const activeBtn = btnFromEvent || btnFromName;
     
  if (tabName === "drawio") {
    document.getElementById("prefixes-btn").style.display = "none";

  } else {
    document.getElementById("prefixes-btn").style.display = "block";
  }
  
  buttons.forEach(b => b.classList.remove('tab-button--active'));
  if (activeBtn) activeBtn.classList.add('tab-button--active');

  document.querySelectorAll('.tab-content')
    .forEach(p => (p.style.display = 'none'));

  const panel = document.getElementById('tab-' + tabName);
  if (panel) panel.style.display = 'block';

  const titleMap = { entities: 'Entities Table', json: 'JSON', triples: 'RDF Triples' };
  const h = document.getElementById('tab-title');
  if (h) h.textContent = titleMap[tabName] || tabName;

  if (typeof moveTabIndicator === "function" && activeBtn) {
    moveTabIndicator(activeBtn);
  }
}

function lockRelationStep1() {
  const step = document.getElementById("relation-step-1");
  const link = document.getElementById("relation-step-1-link");

  if (step) {
    step.classList.add("how-step-blocked");
    step.title = "To review entities again, go back to Entity Recognition.";
  }

  if (link) {
    link.dataset.oldHref = link.getAttribute("href") || "";
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.title = "Go back first to Entity Recognition";
  }
}

function unlockRelationStep1() {
  const step = document.getElementById("relation-step-1");
  const link = document.getElementById("relation-step-1-link");

  if (step) {
    step.classList.remove("how-step-blocked");
    step.removeAttribute("title");
  }

  if (link) {
    if (link.dataset.oldHref) {
      link.setAttribute("href", link.dataset.oldHref);
    } else {
      link.setAttribute("href", "#response");
    }
    link.removeAttribute("aria-disabled");
    link.removeAttribute("title");
  }
}
// ===== Other Actions =====



// ===== higliting  =====
//  the text and the cubes in the type of entities table
function _autoColor(key){
  const palette = [
    "#50c8ff","#ffc850","#58d67a","#ff7fc1","#c2b6ff",
    "#a98cff","#e9e36e","#ff9ad6","#e89895","#8bd3dd",
    "#f6a6ff","#9de07a","#ffb37a","#7ed2f6","#c6c6c6"
  ];
  let h=0; for (let i=0;i<key.length;i++) h = (h*33 + key.charCodeAt(i))|0;
  return palette[Math.abs(h)%palette.length];
}

// Colors taken from RemoGrillo CIDOC-CRM periodic table groups
const PT = {
  GREY:   "#cfcfcf",
  BLUE:   "#2d7fa3",  
  RED:    "#7b1e16",
  GOLD:   "#b88710",   
  PURPLE: "#6f0d6f",   
  GREEN:  "#5a7e14",   
  DKGREEN:"#1f6b2a", 
  ORANGE: "#f07f1a"    
};

// ---- Your ENTITY_STYLES using periodic-table colors ----
const ENTITY_STYLES = {
  "E1_CRM_Entity":                 {label:"CRM Entity (E1)",                color: PT.GREY},

  "E2_Temporal_Entity":            {label:"Temporal Entity (E2)",           color: PT.GREY},
  "E3_Condition_State":            {label:"Condition State (E3)",           color: PT.GREY},

  "E4_Period":                     {label:"Period (E4)",                    color: PT.BLUE},
  "E5_Event":                      {label:"Event (E5)",                     color: PT.BLUE},
  "E6_Destruction":                {label:"Destruction (E6)",               color: PT.BLUE},
  "E7_Activity":                   {label:"Activity (E7)",                  color: PT.BLUE},
  "E8_Acquisition":                {label:"Acquisition (E8)",               color: PT.BLUE},
  "E9_Move":                       {label:"Move (E9)",                      color: PT.BLUE},
  "E10_Transfer_Of_Custody":       {label:"Transfer of Custody (E10)",      color: PT.BLUE},
  "E10_Transfer_of_Custody":       {label:"Transfer of Custody (E10)",      color: PT.BLUE},
  "E11_Modification":              {label:"Modification (E11)",             color: PT.BLUE},
  "E12_Production":                {label:"Production (E12)",               color: PT.BLUE},
  "E13_Attribute_Assignment":      {label:"Attribute Assignment (E13)",     color: PT.BLUE},
  "E14_Condition_Assessment":      {label:"Condition Assessment (E14)",     color: PT.BLUE},
  "E15_Identifier_Assignment":     {label:"Identifier Assignment (E15)",    color: PT.BLUE},
  "E16_Measurement":               {label:"Measurement (E16)",              color: PT.BLUE},
  "E17_Type_Assignment":           {label:"Type Assignment (E17)",          color: PT.BLUE},

  "E18_Physical_Thing":            {label:"Physical Thing (E18)",           color: PT.RED},
  "E19_Physical_Object":           {label:"Physical Object (E19)",          color: PT.RED},
  "E20_Biological_Object":         {label:"Biological Object (E20)",        color: PT.RED},
  "E21_Person":                    {label:"Person (E21)",                   color: PT.PURPLE},
  "E22_Man-Made_Object":           {label:"Man-Made Object (E22)",          color: PT.RED},
  "E22_Human-Made_Object":         {label:"Human-Made Object (E22)",        color: PT.RED},
  "E22_Human_Made_Object":         {label:"Human-Made Object (E22)",        color: PT.RED},
  "E23_Physical_Human-Made_Thing": {label:"Physical Human-Made Thing (E23)",color: PT.RED},
  "E24_Physical_Man-Made_Thing":   {label:"Physical Man-Made Thing (E24)",  color: PT.RED},
  "E25_Human-Made_Feature":        {label:"Human-Made Feature (E25)",       color: PT.RED},
  "E26_Physical_Feature":          {label:"Physical Feature (E26)",         color: PT.RED},
  "E27_Site":                      {label:"Site (E27)",                     color: PT.RED},

  "E28_Conceptual_Object":         {label:"Conceptual Object (E28)",        color: PT.GOLD},
  "E29_Design_Or_Procedure":       {label:"Design or Procedure (E29)",      color: PT.GOLD},
  "E29_Design_or_Procedure":       {label:"Design or Procedure (E29)",      color: PT.GOLD},
  "E30_Right":                     {label:"Right (E30)",                    color: PT.GOLD},
  "E31_Document":                  {label:"Document (E31)",                 color: PT.GOLD},
  "E32_Authority_Document":        {label:"Authority Document (E32)",       color: PT.GOLD},
  "E33_Linguistic_Object":         {label:"Linguistic Object (E33)",        color: PT.GOLD},
  "E34_Inscription":               {label:"Inscription (E34)",              color: PT.GOLD},
  "E35_Title":                     {label:"Title (E35)",                    color: PT.GOLD},
  "E36_Visual_Item":               {label:"Visual Item (E36)",              color: PT.GOLD},
  "E37_Mark":                      {label:"Mark (E37)",                     color: PT.GOLD},

  "E39_Actor":                     {label:"Actor (E39)",                    color: PT.PURPLE},
  "E41_Appellation":               {label:"Appellation (E41)",              color: PT.GREEN},
  "E42_Identifier":                {label:"Identifier (E42)",               color: PT.GREEN},

  "E50_Date":                      {label:"Date (E50)",                     color: PT.GREY},
  "E52_Time-Span":                 {label:"Time-Span (E52)",                color: PT.GREY},
  "E53_Place":                     {label:"Place (E53)",                    color: PT.DKGREEN},
  "E54_Dimension":                 {label:"Dimension (E54)",                color: PT.GREY},

  "E55_Type":                      {label:"Type (E55)",                     color: PT.ORANGE},
  "E56_Language":                  {label:"Language (E56)",                 color: PT.ORANGE},
  "E57_Material":                  {label:"Material (E57)",                 color: PT.ORANGE},
  "E58_Measurement_Unit":          {label:"Measurement Unit (E58)",         color: PT.ORANGE},

  "E63_Beginning_Of_Existence":    {label:"Beginning of Existence (E63)",   color: PT.BLUE},
  "E63_Beginning_of_Existence":    {label:"Beginning of Existence (E63)",   color: PT.BLUE},
  "E64_End_Of_Existence":          {label:"End of Existence (E64)",         color: PT.BLUE},
  "E64_End_of_Existence":          {label:"End of Existence (E64)",         color: PT.BLUE},
  "E65_Creation":                  {label:"Creation (E65)",                 color: PT.BLUE},
  "E66_Formation":                 {label:"Formation (E66)",                color: PT.BLUE},
  "E67_Birth":                     {label:"Birth (E67)",                    color: PT.BLUE},
  "E68_Dissolution":               {label:"Dissolution (E68)",              color: PT.BLUE},
  "E69_Death":                     {label:"Death (E69)",                    color: PT.BLUE},

  "E70_Thing":                     {label:"Thing (E70)",                    color: PT.GREY},
  "E71_Human-Made_Thing":          {label:"Human-Made Thing (E71)",         color: PT.GREY},
  "E72_Legal_Object":              {label:"Legal Object (E72)",             color: PT.GREY},

  "E73_Information_Object":        {label:"Information Object (E73)",       color: PT.GOLD},
  "E74_Group":                     {label:"Group (E74)",                    color: PT.PURPLE},
  "E77_Persistent_Item":           {label:"Persistent Item (E77)",          color: PT.GREY},

  "E78_Curated_Holding":           {label:"Curated Holding (E78)",          color: PT.RED},
  "E78_Collection":                {label:"Collection (E78)",               color: PT.RED},

  "E79_Part_Addition":             {label:"Part Addition (E79)",            color: PT.BLUE},
  "E80_Part_Removal":              {label:"Part Removal (E80)",             color: PT.BLUE},
  "E81_Transformation":            {label:"Transformation (E81)",           color: PT.BLUE},
  "E82_Actor_Appellation":         {label:"Actor Appellation (E82)",        color: PT.GREEN},
  "E83_Type_Creation":             {label:"Type Creation (E83)",            color: PT.BLUE},

  "E85_Joining":                   {label:"Joining (E85)",                  color: PT.BLUE},
  "E86_Leaving":                   {label:"Leaving (E86)",                  color: PT.BLUE},
  "E87_Curation_Activity":         {label:"Curation Activity (E87)",        color: PT.BLUE},

  "E89_Propositional_Object":      {label:"Propositional Object (E89)",     color: PT.GOLD},
  "E90_Symbolic_Object":           {label:"Symbolic Object (E90)",          color: PT.GOLD},

  "E92_Spacetime_Volume":          {label:"Spacetime Volume (E92)",         color: PT.GREY},
  "E93_Presence":                  {label:"Presence (E93)",                 color: PT.BLUE},

  "E96_Purchase":                  {label:"Purchase (E96)",                 color: PT.BLUE},
  "E97_Monetary_Amount":           {label:"Monetary Amount (E97)",          color: PT.GREY},
  "E98_Currency":                  {label:"Currency (E98)",                 color: PT.ORANGE},
  "E99_Product_Type":              {label:"Product Type (E99)",             color: PT.ORANGE},

  "Type":                          {label:"Type",                           color: PT.ORANGE}
};

window.ENTITY_STYLES = ENTITY_STYLES;


  
// Escapes regex metacharacters so a plain text substring can be safely used inside new RegExp(...)
function escapeRegexSpecialChars(s){ 
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

// Renders the input text with entity highlights based on each entity's substring,
// removes overlapping matches, and builds a legend using ENTITY_STYLES (color + label).
function renderAnnotatedFromEntities(entities) {
  const text = document.getElementById("userText")?.value || "";

  const out = document.getElementById("annotated-output");   
  const legend = document.getElementById("annotated-legend");
  if (!out || !legend) return;

  const safe = (s) =>
    String(s).replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));

  out.innerHTML = `<legend>Annotated text</legend>`;
  legend.innerHTML = `<legend>Legends</legend>`;

  if (!text.trim()) {
    out.innerHTML = `<legend>Annotated text</legend><div></div>`;
    legend.innerHTML = `<legend>Legends</legend>
      <div class="legend-item"><span>—</span><span>No text</span></div>`;
    return;
  }

  const ranges = [];
  for (const e of (entities || [])) {
    const subRaw = (e.substring || "").trim();
    if (!subRaw) continue;

    const rawType = e.type || e["CIDOC-CRM class"] || "Type";
    const localType = String(rawType).startsWith("http")
      ? String(rawType).split(/[#/]/).pop()
      : String(rawType);

    const typeNorm = localType.replace(/[()]/g, "").replace(/\s+/g, "_");

    const tokenLike = /^[\p{L}\p{N}_\-]+$/u.test(subRaw);
    const pat = tokenLike
      ? new RegExp(`\\b${escapeRegexSpecialChars(subRaw)}\\b`, "gi")
      : new RegExp(escapeRegexSpecialChars(subRaw), "gi");

    let m;
    while ((m = pat.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      ranges.push({ start, end, type: typeNorm, label: e.label || "", sub: subRaw });
      if (m[0].length === 0) pat.lastIndex++;
    }
  }

  if (!ranges.length) {
    out.innerHTML = `<legend>Annotated text</legend>${safe(text)}`;
    legend.innerHTML = `<legend>Legends</legend>
      <div class="legend-item"><span>—</span><span>No entities to annotate text.</span></div>`;
    return;
  }

  ranges.sort((a, b) => (a.start - b.start) || ((b.end - b.start) - (a.end - a.start)));
  const selected = [];
  let lastEnd = -1;
  for (const r of ranges) {
    if (r.start >= lastEnd) {
      selected.push(r);
      lastEnd = r.end;
    }
  }

  let html = "";
  let cursor = 0;

  for (const e of selected) {
    if (cursor < e.start) html += safe(text.slice(cursor, e.start));

    const normKey = normalizeTypeKey(e.type) || "Type";
    const meta = ENTITY_STYLES[normKey] || ENTITY_STYLES["Type"] || { color: "#c6c6c6", label: normKey };

    const title = `${normKey}${e.label ? `: ${e.label}` : ""}`;

    html += `<span class="ent ent--${safe(normKey)}"
                  style="background:${meta.color}26; border-bottom:2px solid ${meta.color};"
                  data-sub="${safe(e.sub)}" title="${safe(title)}">` +
            `${safe(text.slice(e.start, e.end))}</span>`;

    cursor = e.end;
  }
  if (cursor < text.length) html += safe(text.slice(cursor));

  out.innerHTML = `<legend>Annotated text</legend>${html}`;

  const types = new Set();
  out.querySelectorAll(".ent").forEach((el) => {
    const m = el.className.match(/(?:^|\s)ent--([^\s]+)/);
    if (m && m[1]) types.add(m[1]);
  });

  if (!types.size) {
    legend.innerHTML = `<legend>Legends</legend>
      <div class="legend-item"><span>—</span><span>No entities to annotate text.</span></div>`;
    return;
  }

  const items = [...types].map((key) => {
    const normKey = normalizeTypeKey(key);
    const meta = ENTITY_STYLES[normKey] || ENTITY_STYLES["Type"] || { label: normKey, color: "#ccc" };

    return `<div class="legend-item">
      <span class="legend-dot" style="background:${meta.color}; border-color:${meta.color}"></span>
      <span>${meta.label}</span>
    </div>`;
  }).join("");

  legend.innerHTML = `<legend>Legends</legend>${items}`;
}
// ===== higliting  =====



// ===== Drop Down Menu for types =====
// with a colored dot
function contrastText(hex){
  const c = hex.replace('#','');
  const r = parseInt(c.substring(0,2),16),
        g = parseInt(c.substring(2,4),16),
        b = parseInt(c.substring(4,6),16);

  const L = 0.299*r + 0.587*g + 0.114*b;
  return (L > 170) ? '#222' : '#fff';
}
function makeTypeSelect(current=""){

  const keyFrom = (v)=>{
    if(!v) return "";
    return (v.includes('/') || v.includes('#')) ? v.split(/[\/#]/).pop() : v;
  };

  const raw = keyFrom(current);
  const selKey = (typeof normalizeTypeKey === "function" ? normalizeTypeKey(raw) : raw);

  const wrap = document.createElement('div');
  wrap.className = 'type-cell';

  const dot = document.createElement('span');
  dot.className = 'type-dot';

  const sel = document.createElement('select');
  sel.className = 'type-select';

const empty = document.createElement('option');
empty.value = "";
empty.textContent = "— Select CIDOC-CRM class —";
empty.disabled = true;   
empty.selected = true;   
sel.appendChild(empty);

  Object.keys(ENTITY_STYLES).forEach(key=>{
    const meta = ENTITY_STYLES[key];
    const opt  = document.createElement('option');
    opt.value = key;
    opt.textContent = meta.label || key;
    opt.style.background = meta.color + "33";
    sel.appendChild(opt);
  });

  sel.value = selKey || "";

  const meta = ENTITY_STYLES[sel.value] || ENTITY_STYLES["Type"];
  dot.style.background = (meta?.color || "#c6c6c6");

  sel.addEventListener('change', ()=>{
    const m = ENTITY_STYLES[sel.value] || ENTITY_STYLES["Type"];
    dot.style.background = (m?.color || "#c6c6c6");
  });

  wrap.append(dot, sel);
  return wrap;
}
// ===== Drop Down Menu for types =====
// ===== Entity Recognition =====


// ------ Debugging/Testing -------
//
//
 async function sendQuestionLocal(){

    const err = document.getElementById("executeError");

    if (err) { err.textContent = ""; err.classList.remove("is-visible"); }

    if (!inputText || !inputText.value.trim()) {
      if (err) {
        err.textContent = "Please insert text before executing.";
        err.classList.add("is-visible");
      }
      inputText?.focus();
      return;
    }


    const json =  {
      "message": "[\n  {\n    \"label\": \"Konstantinos Karyotakis\",\n    \"CIDOC-CRM class\": \"E21 Person\",\n    \"URI\": \"http://www.ics.forth.gr/isl/KonstantinosKaryotakis\",\n    \"substring\": \"Konstantinos Karyotakis\"\n  },\n  {\n    \"label\": \"suicide\",\n    \"CIDOC-CRM class\": \"E7 Activity\",\n    \"URI\": \"http://www.ics.forth.gr/isl/suicide\",\n    \"substring\": \"committed suicide\"\n  },\n  {\n    \"label\": \"Vathi, Preveza\",\n    \"CIDOC-CRM class\": \"E53 Place\",\n    \"URI\": \"http://www.ics.forth.gr/isl/VathiPreveza\",\n    \"substring\": \"Vathi, Preveza\"\n  },\n  {\n    \"label\": \"revolver\",\n    \"CIDOC-CRM class\": \"E22 Man-Made Object\",\n    \"URI\": \"http://www.ics.forth.gr/isl/revolver\",\n    \"substring\": \"revolver\"\n  },\n  {\n    \"label\": \"letter\",\n    \"CIDOC-CRM class\": \"E22 Man-Made Object\",\n    \"URI\": \"http://www.ics.forth.gr/isl/letter\",\n    \"substring\": \"letter\"\n  },\n  {\n    \"label\": \"Benaki Museum\",\n    \"CIDOC-CRM class\": \"E78_Collection\",\n    \"URI\": \"http://www.ics.forth.gr/isl/BenakiMuseum\",\n    \"substring\": \"Benaki Museum\"\n  }\n]"
    }


    hide("EntityRecognition");
    show("RelationExtraction");
    document.getElementById("response").style.display = "block";
    show("back-btn-entity");
    document.getElementById("back-btn-entity").style.display = "block";
    document.getElementById("promptPreview1").textContent = await loadRelationPromptTemplate();

    try {
       const entities = await displayEntitiesInTable(json);
       window.APP.entities = entities; 
       setEntitiesInTable(entities);
       renderAnnotatedFromEntities(entities);
//       console.log(getEntitiesFromTable());
    } catch (err){
       console.error(err);
       alert("Failed to build entities: " + err.message);
    }

}

const STATIC_TRIPLES_NT = `
<http://www.ics.forth.gr/isl/KonstantinosKaryotakis> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.cidoc-crm.org/cidoc-crm/E21_Person> .
<http://www.ics.forth.gr/isl/KonstantinosKaryotakis> <http://www.w3.org/2000/01/rdf-schema#label> "Konstantinos Karyotakis" .
<http://www.ics.forth.gr/isl/suicide> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.cidoc-crm.org/cidoc-crm/E7_Activity> .
<http://www.ics.forth.gr/isl/suicide> <http://www.w3.org/2000/01/rdf-schema#label> "suicide" .
<http://www.ics.forth.gr/isl/VathiPreveza> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.cidoc-crm.org/cidoc-crm/E53_Place> .
<http://www.ics.forth.gr/isl/VathiPreveza> <http://www.w3.org/2000/01/rdf-schema#label> "Vathi, Preveza" .
<http://www.ics.forth.gr/isl/revolver> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.cidoc-crm.org/cidoc-crm/E22_Man-Made_Object> .
<http://www.ics.forth.gr/isl/revolver> <http://www.w3.org/2000/01/rdf-schema#label> "revolver" .
<http://www.ics.forth.gr/isl/letter> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.cidoc-crm.org/cidoc-crm/E22_Man-Made_Object> .
<http://www.ics.forth.gr/isl/letter> <http://www.w3.org/2000/01/rdf-schema#label> "letter" .
<http://www.ics.forth.gr/isl/BenakiMuseum> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.cidoc-crm.org/cidoc-crm/E78_Curated_Holding> .
<http://www.ics.forth.gr/isl/BenakiMuseum> <http://www.w3.org/2000/01/rdf-schema#label> "Benaki Museum" .
<http://www.ics.forth.gr/isl/KonstantinosKaryotakis> <http://www.cidoc-crm.org/cidoc-crm/P100_was_death_of> <http://www.ics.forth.gr/isl/EventOfKonstantinosKaryotakisSuicide> .
<http://www.ics.forth.gr/isl/EventOfKonstantinosKaryotakisSuicide> <http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span> <http://www.ics.forth.gr/isl/DateOfKonstantinosKaryotakisSuicide> .
<http://www.ics.forth.gr/isl/EventOfKonstantinosKaryotakisSuicide> <http://www.cidoc-crm.org/cidoc-crm/P7_took_place_at> <http://www.ics.forth.gr/isl/PlaceOfKonstantinosKaryotakisSuicide> .
<http://www.ics.forth.gr/isl/EventOfKonstantinosKaryotakisSuicide> <http://www.cidoc-crm.org/cidoc-crm/P15_was_influenced_by> <http://www.ics.forth.gr/isl/RevolverUsedByKonstantinosKaryotakis> .
<http://www.ics.forth.gr/isl/EventOfKonstantinosKaryotakisSuicide> <http://www.cidoc-crm.org/cidoc-crm/P70_documents> <http://www.ics.forth.gr/isl/LetterLeftByKonstantinosKaryotakis> .
<http://www.ics.forth.gr/isl/RevolverUsedByKonstantinosKaryotakis> <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> <http://www.ics.forth.gr/isl/UniqueIdentifierOfRevolver> .
<http://www.ics.forth.gr/isl/LetterLeftByKonstantinosKaryotakis> <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> <http://www.ics.forth.gr/isl/UniqueIdentifierOfLetter> .
<http://www.ics.forth.gr/isl/BenakiMuseum> <http://www.cidoc-crm.org/cidoc-crm/P16_used_specific_object> <http://www.ics.forth.gr/isl/RevolverUsedByKonstantinosKaryotakis> .
<http://www.ics.forth.gr/isl/BenakiMuseum> <http://www.cidoc-crm.org/cidoc-crm/P16_used_specific_object> <http://www.ics.forth.gr/isl/LetterLeftByKonstantinosKaryotakis> .
`.trim();

async function RDFTriplesLocal(){

  if (updateExecuteState()) return;

  setRelBusy(true);
  setBackDisabled(true);

  try {
    document.getElementById('validation').style.display = "block";
    hide("RelationExtraction");
    lockEntitiesTab();
    unlockRdfTab();
    unlockDrawioTab();
    document.getElementById('back-btn-relation').style.display = "block";
    document.getElementById('back-btn-entity').style.display = "none";

    const nt = STATIC_TRIPLES_NT;

//    console.log("LOCAL TRIPLES\n" + nt);

    window.APP.triples = TriplesArray(nt);
    displayTriplesInTable(window.APP.triples);

    showTab(null, 'triples');
    prefixes();
  } catch (e) {
    console.error("Local conversion failed", e);
  } finally {
    setRelBusy(false);
    setBackDisabled(false);
  }
};

// ------ Debugging/Testing -------