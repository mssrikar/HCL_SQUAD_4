import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

export default function PatientsTable({
  patients: patientsProp,
  fetchUrl,
  pageSize = 10,
  onEdit,
  onDelete,
}) {
  const [patients, setPatients] = useState(Array.isArray(patientsProp) ? patientsProp : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "PatientName", direction: "asc" });
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (Array.isArray(patientsProp)) setPatients(patientsProp);
  }, [patientsProp]);

  useEffect(() => {
    if (!fetchUrl) return;
    let mounted = true;
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(fetchUrl, { signal: controller.signal });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Fetch error ${res.status}: ${t}`);
        }
        const json = await res.json();
        // Accept either array or { items: [...] }
        const items = Array.isArray(json) ? json : json.items || [];
        if (mounted) setPatients(items);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Fetch failed");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchUrl]);

  const columns = useMemo(
    () => [
      { key: "PatientName", label: "Patient Name" },
      { key: "Age", label: "Age" },
      { key: "Sex", label: "Sex" },
      { key: "Disease", label: "Disease" },
      { key: "StepsPerWeek", label: "Steps / Week" },
      { key: "SleepPerDay", label: "Sleep / Day (hrs)" },
      { key: "HealthCondition", label: "Health Condition" },
    ],
    []
  );

  // filtering
  const filtered = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => {
      return columns.some((c) => {
        const v = p[c.key] ?? "";
        return String(v).toLowerCase().includes(q);
      });
    });
  }, [patients, search, columns]);

  // sorting
  const sorted = useMemo(() => {
    const { key, direction } = sort || {};
    if (!key) return filtered;
    const dir = direction === "asc" ? 1 : -1;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = a[key] == null ? "" : a[key];
      const vb = b[key] == null ? "" : b[key];
      // numeric sort for known numeric columns
      if (key === "Age" || key === "StepsPerWeek" || key === "SleepPerDay") {
        const na = Number(va) || 0;
        const nb = Number(vb) || 0;
        return (na - nb) * dir;
      }
      return String(va).localeCompare(String(vb)) * dir;
    });
    return copy;
  }, [filtered, sort]);

  // pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  function toggleSort(key) {
    setSort((s) => {
      if (!s || s.key !== key) return { key, direction: "asc" };
      return { key, direction: s.direction === "asc" ? "desc" : "asc" };
    });
  }

  function toggleSelectAll(e) {
    const checked = e.target.checked;
    if (checked) {
      setSelectedIds(new Set(sorted.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  function toggleRow(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDelete(id) {
    if (onDelete) {
      try {
        await onDelete(id);
      } catch (err) {
        // bubble up but continue to update local list
      }
    }
    setPatients((prev) => prev.filter((p) => String(p.id) !== String(id)));
    setSelectedIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  }

  // simple inline formatting helpers
  const formatNumber = (v) => (v == null || v === "" ? "—" : v);
  const styles = {
    container: { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'", maxWidth: "100%", margin: "0 auto" },
    toolbar: { display: "flex", gap: 8, marginBottom: 12, alignItems: "center" },
    input: { padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd", minWidth: 220 },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
    th: { textAlign: "left", padding: "10px 8px", borderBottom: "1px solid #eee", cursor: "pointer", userSelect: "none", background: "#fafafa" },
    td: { padding: "10px 8px", borderBottom: "1px solid #f6f6f6", verticalAlign: "top" },
    smallBtn: { padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                <input
                  type="checkbox"
                  aria-label="Select all"
                  onChange={toggleSelectAll}
                  checked={selectedIds.size > 0 && selectedIds.size === sorted.length}
                />
              </th>
              {columns.map((c) => (
                <th key={c.key} style={styles.th} onClick={() => toggleSort(c.key)} title={`Sort by ${c.label}`}>
                  <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    {c.label}
                    {sort && sort.key === c.key ? <span style={{ fontSize: 12 }}>{sort.direction === "asc" ? "▲" : "▼"}</span> : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 2} style={{ ...styles.td, textAlign: "center", padding: 30 }}>
                  Loading...
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} style={{ ...styles.td, textAlign: "center", padding: 30 }}>
                  No patients found.
                </td>
              </tr>
            ) : (
              pageRows.map((r) => (
                <tr key={r.id ?? Math.random()}>
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.PatientName || r.id}`}
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleRow(r.id)}
                    />
                  </td>

                  <td style={styles.td}>{r.PatientName ?? "—"}</td>
                  <td style={styles.td}>{formatNumber(r.Age)}</td>
                  <td style={styles.td}>{r.Sex ?? "—"}</td>
                  <td style={styles.td}>{r.Disease ?? "—"}</td>
                  <td style={styles.td}>{formatNumber(r.StepsPerWeek)}</td>
                  <td style={styles.td}>{formatNumber(r.SleepPerDay)}</td>
                  <td style={styles.td}>{r.HealthCondition ?? "—"}</td>

                  <td style={styles.td}>
                    <button
                      onClick={() => onEdit && onEdit(r)}
                      style={{ ...styles.smallBtn, marginRight: 8 }}
                      aria-label={`Edit ${r.PatientName || r.id}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this patient?")) handleDelete(r.id);
                      }}
                      style={{ ...styles.smallBtn, background: "#fff0f0", borderColor: "#f1c0c0", color: "#762626" }}
                      aria-label={`Delete ${r.PatientName || r.id}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

PatientsTable.propTypes = {
  patients: PropTypes.arrayOf(PropTypes.object),
  fetchUrl: PropTypes.string,
  pageSize: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};