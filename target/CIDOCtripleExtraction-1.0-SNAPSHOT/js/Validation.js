/* global fetch */

// validation, about and drawio 

function validator() {
  const btn = document.getElementById("update-settings");
  const statusEl = document.getElementById("validation-status");

  function setStatus(text, cls){
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = "validation-status" + (cls ? (" " + cls) : "");
  }

  // always one is checked (as you said), but keep it safe
  const onlyPropCb = document.getElementById("only-property-errors");
  const onlyProp = !!(onlyPropCb && onlyPropCb.checked);

  if (btn) btn.disabled = true;
  setStatus("Validating…", "work");

  const ntTriples = triplesToNT(getTriplesFromTable());
  const payload = { triples: ntTriples };

  const xhr = new XMLHttpRequest();

  function done(){ if (btn) btn.disabled = false; }

  xhr.onload = function () {
    try {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        const annotations =
          (res && res.result && Array.isArray(res.result.annotations))
            ? res.result.annotations
            : [];

        // apply highlights (also respects onlyProp checkbox)
        applyValidationToRdfTable(annotations);

        // count from DOM not for servlet 
        const rowsWithErrors = document.querySelectorAll("#rdf-table-body tr.has-error").length;
        const domain = document.querySelectorAll("#rdf-table-body td.err-domain").length;
        const range  = document.querySelectorAll("#rdf-table-body td.err-range").length;
        const prop   = document.querySelectorAll("#rdf-table-body td.err-prop").length;

        if (rowsWithErrors === 0) {
          setStatus("No errors ✓", "ok");
          return;
        }

        // status message
        if (onlyProp) {
          setStatus(rowsWithErrors + " row(s) with Property errors", "bad");
        } else {
          setStatus(
            rowsWithErrors + " row(s) with errors — Domain: " + domain + ", Range: " + range + ", Property: " + prop,
            "bad"
          );
        }

        let firstErrRow = null;

        if (onlyProp) {
          const cell = document.querySelector("#rdf-table-body td.err-prop");
          firstErrRow = cell ? cell.closest("tr") : null;
        } else {
          firstErrRow = document.querySelector("#rdf-table-body tr.has-error");
        }

        if (firstErrRow) {
          firstErrRow.scrollIntoView({ behavior: "smooth", block: "center" });
        }

      } else {
        let msg = "Validation failed. Status: " + xhr.status;
        try {
          const err = JSON.parse(xhr.responseText);
          if (err && err.error) msg = err.error;
        } catch (e) {}
        setStatus("Validation failed", "bad");
        alert(msg);
      }
    } finally {
      done();
    }
  };

  xhr.onerror = function () {
    done();
    setStatus("Network error", "bad");
    alert("Network error while validating.");
  };

  xhr.open("POST", "ValidateTriples");
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(payload));
}


function norm(s) {
  if (s === null || s === undefined) s = "";
  return String(s).trim().replace(/\s+/g, " ");
}

function toFullIri(term, isObject) {
  term = norm(term);

  if (isObject && term && !term.includes(":") && !/^https?:\/\//i.test(term) && !term.startsWith("<") && !term.startsWith("_:")) {
    return '"' + term + '"';
  }

  if (term.startsWith("<") && term.endsWith(">")) return term.slice(1, -1);
  if (/^https?:\/\//i.test(term)) return term;
  if (term.startsWith("_:")) return term;

  var m = term.match(/^([\w-]+):(.+)$/);
  if (m) {
    var pfx = m[1];
    var local = m[2];
    var map = getPrefixMap();
    if (map[pfx]) return map[pfx] + local;
  }

  return term;
}

function buildRowIndexFullIri() {
  var tbody = document.getElementById("rdf-table-body");
  var index = new Map();
  if (!tbody) return index;

  Array.from(tbody.querySelectorAll("tr")).forEach(function(tr){
    var tds = tr.querySelectorAll("td");
    if (tds.length < 3) return;

    var s = toFullIri(readCellValue(tds[0]), false);
    var p = toFullIri(readCellValue(tds[1]), false);
    var o = toFullIri(readCellValue(tds[2]), true);

    var key = s + "||" + p + "||" + o;
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(tr);
  });

  return index;
}

function clearValidationHighlights() {
  const tbody = document.getElementById("rdf-table-body");
  if (!tbody) return;

  tbody.querySelectorAll("tr").forEach(tr => {
    tr.classList.remove("has-error", "rdf-row-warning");

    tr.querySelectorAll("td").forEach(td => {
      td.classList.remove(
        "err-domain",
        "err-range",
        "err-prop",
        "err-local-prop",
        "err-local-subject",
        "err-local-object"
      );
    });
  });
}

function applyValidationToRdfTable(annotations) {
  var onlyPropCb = document.getElementById("only-property-errors");
  var onlyProp = !!(onlyPropCb && onlyPropCb.checked);

  var index = buildRowIndexFullIri();

  (annotations || []).forEach(function(a) {
    var s = toFullIri(a.subject, false);
    var p = toFullIri(a.predicate, false);
    var o = toFullIri(a.object, true);

    var key = s + "||" + p + "||" + o;
    var rows = index.get(key);
    if (!rows) return;

    rows.forEach(function(tr) {
      var tds = tr.querySelectorAll("td");
      if (tds.length < 3) return;

      var errors = Array.isArray(a.errors) ? a.errors : [];

      if (onlyProp) {
        if (
          errors.indexOf("property_error") !== -1 ||
          errors.indexOf("property_not_found") !== -1
        ) {
          tds[1].classList.add("err-prop");
          tr.classList.add("has-error");
        }
        return;
      }

      if (errors.indexOf("domain_error") !== -1) {
        tds[0].classList.add("err-domain");
        tr.classList.add("has-error");
      }

      if (errors.indexOf("range_error") !== -1) {
        tds[2].classList.add("err-range");
        tr.classList.add("has-error");
      }

      if (
        errors.indexOf("property_error") !== -1 ||
        errors.indexOf("property_not_found") !== -1
      ) {
        tds[1].classList.add("err-prop");
        tr.classList.add("has-error");
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const enable = document.getElementById('enable-validation');
  const onlyProp = document.getElementById('only-property-errors');

  if (!enable || !onlyProp) return;

  function enforceExclusive(changed){
    if (changed === enable && enable.checked) onlyProp.checked = false;
    if (changed === onlyProp && onlyProp.checked) enable.checked = false;
  }

  enable.addEventListener('change', () => enforceExclusive(enable));
  onlyProp.addEventListener('change', () => enforceExclusive(onlyProp));
});






function showAbout() {
  var overlay = document.getElementById("about-overlay");
  var modal = document.getElementById("about-modal");
  if (!overlay || !modal) return;

  overlay.hidden = false;
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  var closeBtn = document.getElementById("close-about");
  if (closeBtn) closeBtn.focus();
}

function hideAbout() {
  var overlay = document.getElementById("about-overlay");
  var modal = document.getElementById("about-modal");
  if (!overlay || !modal) return;

  overlay.hidden = true;
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", function () {
  var open = document.getElementById("open-about");
  var overlay = document.getElementById("about-overlay");
  var close1 = document.getElementById("close-about");
  var close2 = document.getElementById("close-about-2");

  if (open) open.addEventListener("click", showAbout);
  if (overlay) overlay.addEventListener("click", hideAbout);
  if (close1) close1.addEventListener("click", hideAbout);
  if (close2) close2.addEventListener("click", hideAbout);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var modal = document.getElementById("about-modal");
      if (modal && !modal.hidden) hideAbout();
    }
  });
});




function downloadDrawio() {
  const ntTriples = triplesToNT(getTriplesFromTable());
  const payload = { triples: ntTriples };

//  console.log("READY N-TRIPLES (for drawio):\n", ntTriples);

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
//      console.log("Drawio file:", res.file);
//      console.log("Absolute path:", res.absolutePath);

      if (!res.file) {
        alert("Drawio generated but no file path returned.");
        return;
      }

      // Download/open the generated file
      const url = res.file; // relative to your app context
      const a = document.createElement("a");
      a.href = url;
      a.download = (res.file.split("/").pop() || "triples.drawio");
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      let msg = `Drawio generation failed. Status: ${xhr.status}`;
      try {
        const err = JSON.parse(xhr.responseText);
        if (err.error) msg = err.error;
      } catch (e) {}
      alert(msg);
    }
  };

  xhr.onerror = function () {
    alert("Network error while generating drawio.");
  };
  
  xhr.open("POST", "ProduceDrawIOServlet");
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(payload));
}



function renderDrawioPreview(drawioXml, imgEl, statusEl) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "-9999px";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.style.border = "0";
  iframe.src = "https://embed.diagrams.net/?embed=1&proto=json&spin=1&noSaveBtn=1&noExitBtn=1&ui=min";
  document.body.appendChild(iframe);

  let loaded = false;

  function setStatus(t) {
    if (statusEl) statusEl.textContent = t || "";
  }

  window.addEventListener("message", function onMsg(evt) {
    if (evt.source !== iframe.contentWindow) return;

    let msg;
    try { msg = (typeof evt.data === "string") ? JSON.parse(evt.data) : evt.data; }
    catch (e) { return; }
    if (msg && msg.event === "init") {
      setStatus("Loading diagram…");

      iframe.contentWindow.postMessage(JSON.stringify({
        action: "load",
        xml: drawioXml
      }), "*");
      return;
    }

    if (msg && msg.event === "load" && !loaded) {
      loaded = true;
      setStatus("Rendering preview…");

      iframe.contentWindow.postMessage(JSON.stringify({
        action: "export",
        format: "png",
        scale: 1,
        border: 10,
        background: "transparent"
      }), "*");
      return;
    }

    if (msg && msg.event === "export" && msg.data) {
      setStatus("");

      imgEl.src = msg.data;        
      imgEl.style.display = "block";
      
      window.removeEventListener("message", onMsg);
      document.body.removeChild(iframe);
    }
  });
}


function generateDrawioAndPreview() {
  showTab(event,'drawio');
  const ntTriples = triplesToNT(getTriplesFromTable());
  const payload = { triples: ntTriples };

  const img = document.getElementById("drawio-preview");
  const statusEl = document.getElementById("drawio-preview-status");
  if (img) { img.style.display = "none"; img.removeAttribute("src"); }
  if (statusEl) statusEl.textContent = "Generating draw.io…";

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
      if (!res.file) {
        alert("No file path returned from server.");
        return;
      }

      fetch(res.file, { cache: "no-store" })
        .then(r => {
          if (!r.ok) throw new Error("Cannot fetch drawio file: " + r.status);
          return r.text();
        })
        .then(drawioXml => {
          window._lastDrawioXml = drawioXml;  
          renderDrawioPreview(drawioXml, img, statusEl);
        })
        .catch(err => {
          if (statusEl) statusEl.textContent = "";
          alert(err.message);
        });

    } else {
      let msg = `Drawio generation failed. Status: ${xhr.status}`;
      try {
        const err = JSON.parse(xhr.responseText);
        if (err.error) msg = err.error;
      } catch (e) {}
      if (statusEl) statusEl.textContent = "";
      alert(msg);
    }
  };

  xhr.onerror = function () {
    if (statusEl) statusEl.textContent = "";
    alert("Network error while generating drawio.");
  };

  xhr.open("POST", "ProduceDrawIOServlet"); 
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(payload));
}

let drawioZoom = 1;

function applyDrawioZoom() {
  const img = document.getElementById("drawio-preview");
  const label = document.getElementById("drawio-zoom-label");
  if (!img) return;

  img.style.transform = "scale(" + drawioZoom.toFixed(2) + ")";
  if (label) label.textContent = Math.round(drawioZoom * 100) + "%";
}

function zoomInDrawio() {
  drawioZoom = Math.min(4, drawioZoom + 0.15);
  applyDrawioZoom();
}

function zoomOutDrawio() {
  drawioZoom = Math.max(0.25, drawioZoom - 0.15);
  applyDrawioZoom();
}

function resetZoomDrawio() {
  drawioZoom = 1;
  applyDrawioZoom();
}

(function enableWheelZoom(){
  const wrap = document.getElementById("drawio-preview-wrap");
  if (!wrap) return;

  wrap.addEventListener("wheel", function(e){
    if (e.ctrlKey) return;
    e.preventDefault();

    const delta = (e.deltaY < 0) ? 0.10 : -0.10;
    drawioZoom = Math.min(4, Math.max(0.25, drawioZoom + delta));
    applyDrawioZoom();
  }, { passive: false });
})();



function openPreviewInDiagramsNet() {
  var xml = window._lastDrawioXml;

  var w = window.open("https://embed.diagrams.net/?embed=1&proto=json&spin=1&ui=atlas", "_blank");
  if (!w) {
    alert("Popup blocked.");
    return;
  }

  function onMsg(evt) {
    if (evt.source !== w) return;

    var msg;
    try { msg = (typeof evt.data === "string") ? JSON.parse(evt.data) : evt.data; }
    catch (e) { return; }

    if (msg && msg.event === "init") {
      w.postMessage(JSON.stringify({ action: "load", xml: xml }), "*");
      window.removeEventListener("message", onMsg);
    }
  }

  window.addEventListener("message", onMsg);
}


function initDrawioFrame(forceReload=false) {
  const frame = document.getElementById("drawio-frame");
  if (!frame) return;

  const url = "https://embed.diagrams.net/?embed=1&proto=json&spin=1&ui=atlas&noSaveBtn=1&noExitBtn=1";

  if (forceReload) {
    frame.src = "about:blank";
    setTimeout(() => { frame.src = url; }, 30);
    return;
  }

  if (!frame.src || frame.src === "about:blank") {
    frame.src = url;
  }
}



function loadDrawioIntoFrame(drawioXml) {
  const frame = document.getElementById("drawio-frame");
  const statusEl = document.getElementById("drawio-preview-status");
  if (!frame) return;
  if (statusEl) statusEl.textContent = "Loading diagram in editor…";
  
  function onMsg(evt) {
    if (evt.source !== frame.contentWindow) return;

    let msg;
    try { msg = (typeof evt.data === "string") ? JSON.parse(evt.data) : evt.data; }
    catch (e) { return; }

    if (msg && msg.event === "init") {
      frame.contentWindow.postMessage(JSON.stringify({
        action: "load",
        xml: drawioXml
      }), "*");

      window.removeEventListener("message", onMsg);
      if (statusEl) statusEl.textContent = "";
    }
  }

  window.addEventListener("message", onMsg);
}

function hideStatusLater(statusEl, ms = 1500){
  if (!statusEl) return;
  clearTimeout(statusEl._hideTimer);
  statusEl._hideTimer = setTimeout(() => {
    statusEl.style.display = "none";
    statusEl.textContent = "";
  }, ms);
}

function generateDrawioAndOpenFrame() {
  initDrawioFrame(true);

  const ntTriples = triplesToNT(getTriplesFromTable());
  const payload = { triples: ntTriples };

  const statusEl = document.getElementById("drawio-preview-status");
  statusEl.style.display = "block";
  if (statusEl) statusEl.textContent = "Generating draw.io…";

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
      
      if (!res.file) { alert("No file path returned."); return; }

      fetch(res.file, { cache: "no-store" })
        .then(r => {
          if (!r.ok) throw new Error("Cannot fetch drawio file: " + r.status);
          return r.text();
        })
        .then(drawioXml => {
          window._lastDrawioXml = drawioXml; 
          loadDrawioIntoFrame(drawioXml);  
          if (statusEl){
            hideStatusLater(statusEl, 1200);
          }
        })
        .catch(err => {
          if (statusEl) statusEl.textContent = "";
          alert(err.message);
        });

    } else {
      let msg = `Drawio generation failed. Status: ${xhr.status}`;
      try { const err = JSON.parse(xhr.responseText); if (err.error) msg = err.error; } catch(e){}
      if (statusEl) statusEl.textContent = "";
      alert(msg);
    }
  };

  xhr.onerror = function () {
    if (statusEl) statusEl.textContent = "";
    alert("Network error while generating drawio.");
  };

  xhr.open("POST", "ProduceDrawIOServlet"); 
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(payload));
}

function togglePeriodicFrame() {
  const wrap = document.getElementById("periodic-wrap");
  const frame = document.getElementById("periodic-frame");
  const btn = document.getElementById("btn-open-periodic");

  if (!wrap || !frame || !btn) return;

  const isOpen = !wrap.hidden;

  if (isOpen) {
    wrap.hidden = true;
    btn.textContent = "Open CIDOC-CRM periodic table (E42)";
    return;
  }

  wrap.hidden = false;
  btn.textContent = "Hide CIDOC-CRM periodic table";

  if (!frame.src || frame.src === "about:blank") {
    frame.src = "https://remogrillo.github.io/cidoc-crm_periodic_table/?code=E42";
  }
}

function getCellValue(td) {
  if (!td) return "";

  const input = td.querySelector("input");
  if (input) return (input.value || "").trim();

  const sel = td.querySelector("select");
  if (sel) return (sel.value || "").trim();

  const valueEl = td.querySelector('[data-role="cell-value"]');
  if (valueEl) return (valueEl.textContent || "").trim();

  return (td.textContent || "").trim();
}

function validateRdfTableWarnings() {
  const tbody = document.getElementById("rdf-table-body");
  const warningBox = document.getElementById("rdf-table-warning");
  if (!tbody || !warningBox) return;

  const prefixes = getPrefixesFromUI();
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const warnings = [];

  rows.forEach((tr, index) => {
    const tds = tr.querySelectorAll("td");
    if (tds.length < 3) return;

    const subject = getCellValue(tds[0]);
    const predicate = getCellValue(tds[1]);
    const object = getCellValue(tds[2]);
    const rowNum = index + 1;

    const rowErrors = [];
    tr.classList.remove("rdf-row-warning");

    if (predicate.startsWith("rdf:") && predicate !== "rdf:type") {
      rowErrors.push('if predicate uses "rdf:", it must be exactly "rdf:type"');
    }

    if (predicate.startsWith("rdfs:") && predicate !== "rdfs:label") {
      rowErrors.push('if predicate uses "rdfs:", it must be exactly "rdfs:label"');
    }

    if (hasUnknownPrefix(subject, prefixes)) {
      rowErrors.push(`unknown prefix in Subject: "${getPrefixName(subject)}"`);
    }

    if (hasUnknownPrefix(predicate, prefixes)) {
      rowErrors.push(`unknown prefix in Predicate: "${getPrefixName(predicate)}"`);
    }

    if (!object.startsWith('"') && hasUnknownPrefix(object, prefixes)) {
      rowErrors.push(`unknown prefix in Object: "${getPrefixName(object)}"`);
    }

    if (rowErrors.length) {
      warnings.push(
        `Row ${rowNum}: ${rowErrors.join(", ")}. This triple will not be included.`
      );
      tr.classList.add("rdf-row-warning");
    }
  });

  if (warnings.length) {
    warningBox.style.display = "block";
    warningBox.textContent = warnings.join("\n");
  } else {
    warningBox.style.display = "none";
    warningBox.textContent = "";
  }
}

function getPrefixName(value) {
  const colonIndex = value.indexOf(":");
  if (colonIndex <= 0) return value;
  return value.slice(0, colonIndex);
}

function hasUnknownPrefix(value, prefixes) {
  if (!value) return false;

  value = value.trim();

  if (value.startsWith("<") && value.endsWith(">")) return false;
  if (value.startsWith("http://") || value.startsWith("https://")) return false;
  if (value.startsWith('"')) return false;

  const colonIndex = value.indexOf(":");
  if (colonIndex <= 0) return false;

  const prefix = value.slice(0, colonIndex);
  return !prefixes || !prefixes[prefix];
}

document.getElementById("rdf-table-body").addEventListener("input", () => {
  validateRdfTableWarnings();
});