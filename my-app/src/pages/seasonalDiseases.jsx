import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";

const DEFAULT_DATA = {
  Spring: [
    {
      id: "s1",
      name: "Allergic Rhinitis (Hay Fever)",
      symptoms: "Sneezing, runny/blocked nose, itchy eyes",
      prevention: "Avoid pollen exposure, keep windows closed on high pollen days, use antihistamine as advised",
      treatment: "Antihistamines, nasal corticosteroids, allergen immunotherapy in severe cases",
      severity: "Mild–Moderate",
      peakMonths: "Mar–May",
    },
    {
      id: "s2",
      name: "Lyme Disease (tick-borne)",
      symptoms: "Erythema migrans rash, fever, fatigue, joint pain",
      prevention: "Wear protective clothing, use tick repellant, check for ticks after outdoor activities",
      treatment: "Antibiotics (doxycycline, amoxicillin depending on patient)",
      severity: "Moderate",
      peakMonths: "Apr–Jun",
    },
  ],
  Summer: [
    {
      id: "su1",
      name: "Heat Exhaustion / Heat Stroke",
      symptoms: "Heavy sweating, weakness, dizziness, nausea, high body temperature",
      prevention: "Hydration, avoid peak sun hours, wear light clothing",
      treatment: "Cool down, hydrate, seek emergency care for heat stroke",
      severity: "Moderate–Severe",
      peakMonths: "Jun–Aug",
    },
    {
      id: "su2",
      name: "Gastroenteritis (foodborne / viral)",
      symptoms: "Diarrhea, vomiting, abdominal cramps, fever",
      prevention: "Safe food handling, proper refrigeration, hand hygiene",
      treatment: "Oral rehydration, rest; antimicrobials only when indicated",
      severity: "Mild–Moderate",
      peakMonths: "Jun–Sep",
    },
  ],
  Autumn: [
    {
      id: "a1",
      name: "Seasonal Influenza (flu)",
      symptoms: "Fever, cough, sore throat, body aches, fatigue",
      prevention: "Annual vaccination, hand hygiene, respiratory etiquette",
      treatment: "Antivirals if early and high risk; supportive care",
      severity: "Mild–Severe",
      peakMonths: "Oct–Dec",
    },
    {
      id: "a2",
      name: "Norovirus",
      symptoms: "Acute vomiting, diarrhea, stomach cramps",
      prevention: "Handwashing, disinfection of contaminated surfaces, safe food handling",
      treatment: "Hydration and supportive care",
      severity: "Mild–Moderate",
      peakMonths: "Oct–Mar",
    },
  ],
  Winter: [
    {
      id: "w1",
      name: "Respiratory Syncytial Virus (RSV)",
      symptoms: "Runny nose, cough, wheeze, difficulty breathing in infants/elderly",
      prevention: "Hand hygiene, avoid close contact with sick individuals",
      treatment: "Supportive care; hospitalization for severe cases",
      severity: "Moderate–Severe (in infants/elderly)",
      peakMonths: "Dec–Feb",
    },
    {
      id: "w2",
      name: "Seasonal Influenza (flu)",
      symptoms: "Fever, cough, body aches, fatigue",
      prevention: "Vaccination, hygiene",
      treatment: "Antivirals if indicated",
      severity: "Mild–Severe",
      peakMonths: "Dec–Feb",
    },
  ],
};

export default function SeasonalDiseases({
  data,
  initialSeason = "Spring",
  showSeasonFilter = true,
  onSelectDisease,
  compact = false,
}) {
  const source = data && typeof data === "object" ? data : DEFAULT_DATA;
  const seasons = useMemo(() => Object.keys(source), [source]);

  const [season, setSeason] = useState(seasons.includes(initialSeason) ? initialSeason : seasons[0]);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(new Set());

  // Flatten list for searching
  const list = useMemo(() => {
    const items = source[season] || [];
    if (!query) return items;
    const q = query.trim().toLowerCase();
    return items.filter((d) => {
      return (
        d.name.toLowerCase().includes(q) ||
        (d.symptoms || "").toLowerCase().includes(q) ||
        (d.prevention || "").toLowerCase().includes(q)
      );
    });
  }, [source, season, query]);

  function toggleExpand(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelect(disease) {
    if (onSelectDisease) onSelectDisease(disease);
  }

  // small inline styles for portability
  const styles = {
    container: { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'", maxWidth: 900, margin: "0 auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 },
    seasons: { display: "flex", gap: 8 },
    seasonBtn: (active) => ({
      padding: "6px 10px",
      borderRadius: 8,
      border: active ? "1px solid #2563eb" : "1px solid #e5e7eb",
      background: active ? "#eff6ff" : "#fff",
      cursor: "pointer",
    }),
    search: { padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", width: 280 },
    list: { marginTop: 8, display: "grid", gap: 10 },
    card: { border: "1px solid #e6e6e6", padding: 12, borderRadius: 8, background: "#fff" },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
    title: { fontSize: 16, fontWeight: 600, margin: 0 },
    meta: { fontSize: 13, color: "#374151", marginTop: 6 },
    details: { marginTop: 10, fontSize: 14, color: "#111827" },
    btn: { padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" },
    compactRow: { display: "flex", gap: 12, alignItems: "center" },
  };

  return (
    <section style={styles.container} aria-label="Seasonal diseases">
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>Seasonal Diseases</h2>
          <div style={{ fontSize: 13, color: "#374151" }}>Season: {season}</div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {showSeasonFilter && (
            <nav style={styles.seasons} aria-label="Season filter">
              {seasons.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSeason(s);
                    setQuery("");
                  }}
                  aria-pressed={s === season}
                  style={styles.seasonBtn(s === season)}
                >
                  {s}
                </button>
              ))}
            </nav>
          )}
          <input
            type="search"
            aria-label="Search diseases"
            placeholder="Search diseases or symptoms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.search}
          />
        </div>
      </div>

      <div style={styles.list}>
        {list.length === 0 ? (
          <div style={{ padding: 12, color: "#6b7280" }}>No diseases found for this season or query.</div>
        ) : (
          list.map((d) => {
            const isOpen = expanded.has(d.id);
            return (
              <article key={d.id} style={styles.card} aria-labelledby={`d-${d.id}`}>
                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.title} id={`d-${d.id}`}>
                      {d.name}
                    </div>

                    <div style={styles.meta}>
                      <span style={{ marginRight: 12 }}>
                        <strong>Symptoms:</strong> {d.symptoms}
                      </span>
                      <span style={{ marginRight: 12 }}>
                        <strong>Peak:</strong> {d.peakMonths}
                      </span>
                      <span>
                        <strong>Severity:</strong> {d.severity}
                      </span>
                    </div>
                    {!compact && isOpen && (
                      <div style={styles.details}>
                        <div>
                          <strong>Prevention:</strong> {d.prevention}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <strong>Treatment:</strong> {d.treatment}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => toggleExpand(d.id)}
                        aria-expanded={isOpen}
                        style={styles.btn}
                      >
                        {isOpen ? "Collapse" : "Details"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelect(d)}
                        style={{ ...styles.btn, borderColor: "#2563eb", color: "#2563eb" }}
                      >
                        Select
                      </button>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280", textAlign: "right" }}>{/* placeholder for badges */}</div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

SeasonalDiseases.propTypes = {
  data: PropTypes.object, // shape: { SeasonName: [{ id, name, symptoms, prevention, treatment, severity, peakMonths }] }
  initialSeason: PropTypes.string,
  showSeasonFilter: PropTypes.bool,
  onSelectDisease: PropTypes.func,
  compact: PropTypes.bool,
};