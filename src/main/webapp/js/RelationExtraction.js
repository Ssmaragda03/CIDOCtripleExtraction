
const CIDOC_CRM_CLASSES = [
  "E1_CRM_Entity",
  "E2_Temporal_Entity",
  "E3_Condition_State",
  "E4_Period",
  "E5_Event",
  "E6_Destruction",
  "E7_Activity",
  "E8_Acquisition",
  "E9_Move",
  "E10_Transfer_of_Custody",
  "E11_Modification",
  "E12_Production",
  "E13_Attribute_Assignment",
  "E14_Condition_Assessment",
  "E15_Identifier_Assignment",
  "E16_Measurement",
  "E17_Type_Assignment",
  "E18_Physical_Thing",
  "E19_Physical_Object",
  "E20_Biological_Object",
  "E21_Person",
  "E22_Human-Made_Object",
  "E24_Physical_Human-Made_Thing",
  "E25_Human-Made_Feature",
  "E26_Physical_Feature",
  "E27_Site",
  "E28_Conceptual_Object",
  "E29_Design_or_Procedure",
  "E30_Right",
  "E31_Document",
  "E32_Authority_Document",
  "E33_E41_Linguistic_Appellation",
  "E33_Linguistic_Object",
  "E34_Inscription",
  "E35_Title",
  "E36_Visual_Item",
  "E37_Mark",
  "E39_Actor",
  "E41_Appellation",
  "E42_Identifier",
  "E52_Time-Span",
  "E53_Place",
  "E54_Dimension",
  "E55_Type",
  "E56_Language",
  "E57_Material",
  "E58_Measurement_Unit",
  "E63_Beginning_of_Existence",
  "E64_End_of_Existence",
  "E65_Creation",
  "E66_Formation",
  "E67_Birth",
  "E68_Dissolution",
  "E69_Death",
  "E70_Thing",
  "E71_Human-Made_Thing",
  "E72_Legal_Object",
  "E73_Information_Object",
  "E74_Group",
  "E77_Persistent_Item",
  "E78_Curated_Holding",
  "E79_Part_Addition",
  "E80_Part_Removal",
  "E81_Transformation",
  "E83_Type_Creation",
  "E85_Joining",
  "E86_Leaving",
  "E87_Curation_Activity",
  "E89_Propositional_Object",
  "E90_Symbolic_Object",
  "E92_Spacetime_Volume",
  "E93_Presence",
  "E96_Purchase",
  "E97_Monetary_Amount",
  "E98_Currency",
  "E99_Product_Type"
];

const CIDOC_CRM_PROPERTIES = [
  "P100_was_death_of",
  "P101_had_as_general_use",
  "P102_has_title",
  "P103_was_intended_for",
  "P104_is_subject_to",
  "P105_right_held_by",
  "P106_is_composed_of",
  "P107_has_current_or_former_member",
  "P109_has_current_or_former_curator",
  "P10_falls_within",
  "P110_augmented",
  "P111_added",
  "P112_diminished",
  "P113_removed",
  "P11_had_participant",
  "P121_overlaps_with",
  "P122_borders_with",
  "P123_resulted_in",
  "P124_transformed",
  "P125_used_object_of_type",
  "P126_employed",
  "P127_has_broader_term",
  "P128_carries",
  "P12_occurred_in_the_presence_of",
  "P130_shows_features_of",
  "P132_spatiotemporally_overlaps_with",
  "P133_is_spatiotemporally_separated_from",
  "P134_continued",
  "P135_created_type",
  "P136_was_based_on",
  "P137_exemplifies",
  "P138_represents",
  "P139_has_alternative_form",
  "P140_assigned_attribute_to",
  "P141_assigned",
  "P142_used_constituent",
  "P143_joined",
  "P144_joined_with",
  "P145_separated",
  "P146_separated_from",
  "P147_curated",
  "P148_has_component",
  "P14_carried_out_by",
  "P150_defines_typical_parts_of",
  "P151_was_formed_from",
  "P152_has_parent",
  "P156_occupies",
  "P157_is_at_rest_relative_to",
  "P15_was_influenced_by",
  "P160_has_temporal_projection",
  "P161_has_spatial_projection",
  "P164_is_temporally_specified_by",
  "P165_incorporates",
  "P166_was_a_presence_of",
  "P167_was_within",
  "P168_place_is_defined_by",
  "P16_used_specific_object",
  "P171_at_some_place_within",
  "P172_contains",
  "P173_starts_before_or_with_the_end_of",
  "P174_starts_before_the_end_of",
  "P175_starts_before_or_with_the_start_of",
  "P176_starts_before_the_start_of",
  "P177_assigned_property_of_type",
  "P179_had_sales_price",
  "P17_was_motivated_by",
  "P180_has_currency",
  "P182_ends_before_or_with_the_start_of",
  "P183_ends_before_the_start_of",
  "P184_ends_before_or_with_the_end_of",
  "P185_ends_before_the_end_of",
  "P186_produced_thing_of_product_type",
  "P187_has_production_plan",
  "P188_requires_production_tool",
  "P189_approximates",
  "P190_has_symbolic_content",
  "P191_had_duration",
  "P195_was_a_presence_of",
  "P196_defines",
  "P197_covered_parts_of",
  "P198_holds_or_supports",
  "P19_was_intended_use_of",
  "P20_had_specific_purpose",
  "P21_had_general_purpose",
  "P22_transferred_title_to",
  "P23_transferred_title_from",
  "P24_transferred_title_of",
  "P25_moved",
  "P26_moved_to",
  "P27_moved_from",
  "P28_custody_surrendered_by",
  "P29_custody_received_by",
  "P30_transferred_custody_of",
  "P31_has_modified",
  "P32_used_general_technique",
  "P33_used_specific_technique",
  "P34_concerned",
  "P35_has_identified",
  "P37_assigned",
  "P38_deassigned",
  "P39_measured",
  "P3_has_note",
  "P40_observed_dimension",
  "P41_classified",
  "P42_assigned",
  "P43_has_dimension",
  "P45_consists_of",
  "P46_is_composed_of",
  "P49_has_former_or_current_keeper",
  "P50_has_current_keeper",
  "P51_has_former_or_current_owner",
  "P52_has_current_owner",
  "P53_has_former_or_current_location",
  "P54_has_current_permanent_location",
  "P55_has_current_location",
  "P56_bears_feature",
  "P57_has_number_of_parts",
  "P59_has_section",
  "P5_consists_of",
  "P62_depicts",
  "P65_shows_visual_item",
  "P68_foresees_use_of",
  "P69_has_association_with",
  "P71_lists",
  "P72_has_language",
  "P73_has_translation",
  "P74_has_current_or_former_residence",
  "P75_possesses",
  "P76_has_contact_point",
  "P79_beginning_is_qualified_by",
  "P80_end_is_qualified_by",
  "P81_ongoing_throughout",
  "P81a_end_of_the_begin",
  "P81b_begin_of_the_end",
  "P82a_begin_of_the_begin",
  "P82b_end_of_the_end",
  "P86_falls_within",
  "P8_took_place_on_or_within",
  "P89_falls_within",
  "P7_took_place_at",
  "P92_brought_into_existence",
  "P93_took_out_of_existence",
  "P94_has_created",
  "P95_has_formed",
  "P96_by_mother",
  "P97_from_father",
  "P98_brought_into_life",
  "P99_dissolved",
  "P44_has_condition",
  "P108_has_produced",
  "P67_refers_to",
  "P129_is_about",
  "P1_is_identified_by",
  "P48_has_preferred_identifier",
  "P4_has_time-span",
  "P2_has_type",
  "P90a_has_lower_value_limit",
  "P90b_has_upper_value_limit",
  "P91_has_unit",
  "P9_consists_of",
  "P90_has_value",
  "P82_at_some_time_within",
  "P13_destroyed",
  "P70_documents"
];

const CORE_PREDICATES = [
  { value: "rdf:type", label: "rdf:type" },
  { value: "rdfs:label", label: "rdfs:label" }
];

function makeSimpleCrmSelect(values = [], current = "", placeholder = "— Select —") {
  const sel = document.createElement("select");
  sel.className = "crm-select";

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = placeholder;
  empty.style.textDecoration = "none";
  empty.disabled = true;
  sel.appendChild(empty);

  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = "crm:" + v;
    opt.textContent = "crm:" + v.replace(/_/g, " ");
    sel.appendChild(opt);
  });

  if (current && values.includes(current.replace(/^crm:/, ""))) {
    sel.value = current.startsWith("crm:") ? current : "crm:" + current;
  } else {
    empty.selected = true;
  }

  return sel;
}

function makeCrmClassSelect(current = "") {
  return makeSimpleCrmSelect(
    CIDOC_CRM_CLASSES,
    current,
    "— Select CIDOC-CRM class —"
  );
}

function isKnownCrmProperty(value) {
  if (!value) return false;
  const v = value.trim();
  if (!v.startsWith("crm:")) return false;

  const local = v.replace(/^crm:/, "");
  return CIDOC_CRM_PROPERTIES.includes(local);
}

function isAllowedPredicate(value) {
  if (!value) return false;

  const v = value.trim();

  if (v === "rdf:type" || v === "rdfs:label") return true;
  if (isKnownCrmProperty(v)) return true;

  return false;
}

function makePredicateSelect(current = "") {
  const sel = document.createElement("select");
  sel.className = "crm-select";
  

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "— Select predicate —";
  empty.style.textDecoration = "none";
  empty.disabled = true;
  sel.appendChild(empty);

  CORE_PREDICATES.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.value;
    opt.textContent = p.label;
    sel.appendChild(opt);
  });

  CIDOC_CRM_PROPERTIES.forEach(v => {
    const opt = document.createElement("option");
    opt.value = "crm:" + v;
    opt.textContent = "crm:" + v.replace(/_/g, " ");
    sel.appendChild(opt);
  });

  if (current && isAllowedPredicate(current)) {
    sel.value = current;
  } else {
    empty.selected = true;
  }
  
  return sel;
}

function applyObjectInputLinkBehavior(input) {
  if (!input) return;

  function refresh() {
    const value = (input.value || "").trim();
    const url = expandPrefixedUrl(value);

    if (url) {
      input.style.textDecoration = "underline";
      input.style.cursor = "pointer";
      input.title = "Double-click to open link";
    } else {
      input.style.textDecoration = "none";
      input.style.cursor = "text";
      input.title = "";
    }
  }

  input.addEventListener("input", refresh);
  input.addEventListener("change", refresh);

  input.addEventListener("dblclick", function () {
    const value = (input.value || "").trim();
    const url = expandPrefixedUrl(value);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });

  refresh();
}

function makeObjectInputWithTypes(current = "") {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "object-type-input";
  input.value = current || "";
  input.placeholder = "Write label, URI, or choose a type";

  const listId = "crm-types-" + Math.random().toString(36).slice(2);
  input.setAttribute("list", listId);

  const datalist = document.createElement("datalist");
  datalist.id = listId;

  const empty = document.createElement("option");
  empty.value = "";
  datalist.appendChild(empty);

  CIDOC_CRM_CLASSES.forEach(cls => {
    const opt = document.createElement("option");
    opt.value = "crm:" + cls;
    datalist.appendChild(opt);
  });

  const wrap = document.createElement("div");
  wrap.append(input, datalist);
  
  applyObjectInputLinkBehavior(input);
  return wrap;
}


function expandPrefixedUrl(value) {
  if (!value) return "";

  const v = value.trim();

  if (v.startsWith("http://") || v.startsWith("https://")) {
    return v;
  }

  const colonIndex = v.indexOf(":");
  if (colonIndex <= 0) return "";

  const prefix = v.slice(0, colonIndex);
  const local = v.slice(colonIndex + 1);

  const prefixes = getPrefixesFromUI();
  if (prefixes[prefix]) {
    return prefixes[prefix] + local;
  }

  return "";
}


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
    document.getElementById('execute-warning').style.display = "none";
    
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
            lockEntitiesTab();
            unlockRdfTab();
            unlockDrawioTab();
            lockRelationStep1();
            const responseSection = document.getElementById("response");
            if (responseSection) {
              responseSection.scrollIntoView({ behavior: "smooth", block: "start" });
              window.location.hash = "response";
            }
            
            const res = JSON.parse(xhr.responseText);  
            const nt = res.triples;
            const lockedCount = res.lockedCount;
            
            window.APP.triples = TriplesArray(nt);
            displayTriplesInTable(window.APP.triples, lockedCount);
//            console.log(json.model + "\n"+nt);

            showTab(null, 'triples');
            prefixes();
            validator();
            
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
function displayTriplesInTable(triples) {
  const tbody = document.getElementById("rdf-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  (triples || []).forEach((triple) => {
    addRdfRow(triple || {});
  });

  validateRdfTableWarnings();
}

// Appends one editable RDF triple row (subject/predicate/object)
// with double-click link opening and prefix-locking, plus a delete action.
function styleSelectAsLink(sel) {
  sel.style.textDecoration = "underline";
  sel.style.cursor = "pointer";
  sel.title = "Double-click to open link";
}

function attachOpenLinkOnDblClick(el) {
  el.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rawValue = "value" in el ? el.value : (el.textContent || "").trim();
    const url = expandPrefixedUrl(rawValue);

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });
}

function addRdfRow(triple = {}) {
  const tbody = document.getElementById("rdf-table-body");
  if (!tbody) return;

  const tr = document.createElement("tr");

  // SUBJECT
  const tdS = document.createElement("td");
  tdS.className = "rdf-col-subject";
  tdS.contentEditable = "true";
  styleSelectAsLink(tdS);
  tdS.textContent = triple.subject || "";
  attachOpenLinkOnDblClick(tdS);

  // OBJECT
  const tdO = document.createElement("td");
  tdO.className = "rdf-col-object";

  // PREDICATE
  const tdP = document.createElement("td");
  tdP.className = "rdf-col-predicate";

  const predicateValue = (triple.predicate || "").trim();
  const invalidPredicate = predicateValue && !isAllowedPredicate(predicateValue);

  if (!invalidPredicate) {
    const selP = makePredicateSelect(predicateValue);
    
    styleSelectAsLink(selP);
    attachOpenLinkOnDblClick(selP);

    selP.addEventListener("change", () => {
      const currentObjectValue = getCellValue(tdO);
      renderObjectCell(tdO, selP.value, currentObjectValue);
      validateRdfTableWarnings();
    });

    tdP.appendChild(selP);
  } else {
    const wrap = document.createElement("div");
    wrap.className = "predicate-inline-wrap";

    const valueSpan = document.createElement("span");
    valueSpan.dataset.role = "cell-value";
    valueSpan.className = "predicate-inline-text";
    valueSpan.contentEditable = "true";
    valueSpan.textContent = predicateValue;
    

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn predicate-edit-btn";
    editBtn.type = "button";
    editBtn.title = "Fix predicate";
    editBtn.textContent = "✎";

    editBtn.addEventListener("click", () => {
      const currentValue = (valueSpan.textContent || "").trim();
      turnPredicateIntoSelect(tdP, currentValue, tdO);
    });

    wrap.append(valueSpan, editBtn);
    tdP.appendChild(wrap);
  }

  // Initial render object
  renderObjectCell(tdO, predicateValue, (triple.object || "").trim());

  // ACTIONS
  const tdActions = document.createElement("td");

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  delBtn.type = "button";
  delBtn.title = "Delete";
  delBtn.textContent = "🗑";

  delBtn.addEventListener("click", () => {
    tr.remove();

    const entities = getEntitiesFromTable();
    renderAnnotatedFromEntities(entities);

    validator();
    validateRdfTableWarnings();
  });

  tdActions.append(delBtn);

  tr.append(tdS, tdP, tdO, tdActions);
  tbody.appendChild(tr);
}

function turnPredicateIntoSelect(tdP, currentValue = "", tdO = null) {
  if (!tdP) return;

  tdP.innerHTML = "";
  tdP.classList.remove("err-prop", "err-local-prop");

  const tr = tdP.closest("tr");
  if (tr) {
    tr.classList.remove("has-error", "rdf-row-warning");
  }

  const sel = makePredicateSelect(
    isAllowedPredicate(currentValue) ? currentValue : ""
  );

  const v = (sel.value || "").trim();
  
  sel.addEventListener("change", () => {
    if (tdO) {
      const currentObjectValue = getCellValue(tdO);
      renderObjectCell(tdO, sel.value, currentObjectValue);
    } 
    styleSelectAsLink(sel);
    attachOpenLinkOnDblClick(sel);
    validateRdfTableWarnings();
  });

  tdP.appendChild(sel);
}

function renderObjectCell(tdO, predicateValue, objectValue = "") {
  if (!tdO) return;

  tdO.innerHTML = "";
  tdO.className = "rdf-col-object";

  const pred = (predicateValue || "").trim();
  const isRdfType = pred === "rdf:type" || pred.endsWith("#type");
  const isCrmProperty = pred.startsWith("crm:") && isKnownCrmProperty(pred);

  if (isRdfType) {
    const selO = makeCrmClassSelect(objectValue);
    styleSelectAsLink(selO);
    attachOpenLinkOnDblClick(selO);
    selO.addEventListener("change", validateRdfTableWarnings);

    tdO.appendChild(selO);
    return;
  }
  
  if (isCrmProperty) {
    const wrap = makeObjectInputWithTypes(objectValue);
    const input = wrap.querySelector("input");
      tdO.contentEditable = "false";

    if (input) {
      input.addEventListener("input", validateRdfTableWarnings);
      input.addEventListener("change", validateRdfTableWarnings);
    }

    tdO.appendChild(wrap);
    return;
  }
  
  tdO.contentEditable = "true";
  tdO.textContent = objectValue || "";

}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-rdf-row");
  if (addBtn) addBtn.addEventListener("click", () => addRdfRow({}));
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
  refreshEntityRowsAfterPrefixAdd(prefixId);
}

function refreshEntityRowsAfterPrefixAdd(newPrefixId) {
  const tbody = document.getElementById("entities-table-body");
  if (!tbody || !newPrefixId) return;

  const rows = tbody.querySelectorAll("tr");

  rows.forEach(tr => {
    const tdURI = tr.querySelector(".col-uri");
    if (!tdURI) return;

    const raw = (tdURI.textContent || "").trim();
    if (!raw) return;

    // Ελέγχουμε αν το κείμενο ξεκινάει με το συγκεκριμένο prefix (π.χ. "crm:")
    // Χρησιμοποιούμε startsWith για μεγαλύτερη ακρίβεια
    if (raw.startsWith(newPrefixId + ":")) {
      
      // Βρίσκουμε το input του συγκεκριμένου prefix για επιβεβαίωση
      const prefixInput = document.getElementById(`prefix-${newPrefixId}`);

      if (prefixInput) {
        // Μαρκάρουμε τη σειρά ως dirty μόνο αν ταιριάζει το prefix
        markRowDirty(tr, true);
        
        // Προαιρετικά: Αν θέλεις να ανανεώσεις και το UI της συγκεκριμένης σειράς 
        // ώστε να φανεί αμέσως η αλλαγή (αν έχεις τέτοια συνάρτηση)
        // renderEntityRow(tr); 
      }
    }
  });

  updateExecuteState();
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
        if (footerLeftEl) footerLeftEl.textContent = "Method Preview";
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
  document.getElementById("loading").textContent = "Method Preview  loading...";
  const prompt = await loadRelationPromptTemplate();
  if (pre) pre.textContent = prompt;
  document.getElementById("loading").textContent = "Method Preview";
}

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("promptTemplate");

  sel?.addEventListener("change", () => {
    updateRelationPromptPreview();
  });

//  setMode("relation", "text");
});
