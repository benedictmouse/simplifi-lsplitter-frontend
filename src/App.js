import { useState, useRef, useCallback } from "react";

const API_URL = "https://simplifi-lsplitter.onrender.com/api/split-by-sku/";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --orange:       #f26522;
    --orange-light: #ff8c4a;
    --orange-pale:  #fff4ee;
    --orange-soft:  #ffe8d9;
    --bg:           #fafaf9;
    --surface:      #ffffff;
    --ink:          #1a1612;
    --ink-2:        #6b6560;
    --border:       #ede9e4;
    --success:      #2a7d52;
    --error:        #c0392b;
    --radius:       16px;
    --radius-sm:    10px;
    --shadow-card:  0 8px 40px rgba(242,101,34,0.08), 0 2px 8px rgba(26,22,18,0.06);
    --shadow-btn:   0 4px 20px rgba(242,101,34,0.35);
    --transition:   all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body { background: var(--bg); }

  .root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: 'Sora', sans-serif;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 60% 50% at 70% 10%, rgba(242,101,34,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 10% 90%, rgba(242,101,34,0.05) 0%, transparent 70%);
  }

  .card {
    background: var(--surface);
    border-radius: var(--radius);
    width: 100%;
    max-width: 500px;
    box-shadow: var(--shadow-card);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .card-header {
    padding: 2.25rem 2.25rem 1.75rem;
    background: linear-gradient(135deg, #fff 60%, var(--orange-pale) 100%);
    border-bottom: 1px solid var(--border);
  }

  .brand-row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 0.9rem;
  }

  .brand-icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: linear-gradient(135deg, var(--orange), var(--orange-light));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 2px 10px rgba(242,101,34,0.3);
    flex-shrink: 0;
  }

  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .brand-name em {
    font-style: italic;
    color: var(--orange);
  }

  .card-subtitle {
    font-size: 0.8rem;
    color: var(--ink-2);
    line-height: 1.65;
    font-weight: 400;
  }

  .card-body {
    padding: 1.75rem 2.25rem 2.25rem;
  }

  /* Drop Zone */
  .drop-zone {
    border: 1.5px dashed var(--border);
    border-radius: var(--radius-sm);
    padding: 2.25rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
    background: var(--bg);
  }

  .drop-zone:hover,
  .drop-zone.dragging {
    border-color: var(--orange);
    background: var(--orange-pale);
    transform: scale(1.005);
  }

  .drop-zone.has-file {
    border-style: solid;
    border-color: var(--orange);
    background: var(--orange-pale);
  }

  .dz-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--surface);
    border: 1.5px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    transition: var(--transition);
    box-shadow: 0 2px 8px rgba(26,22,18,0.06);
  }

  .drop-zone:hover .dz-icon-wrap,
  .drop-zone.dragging .dz-icon-wrap,
  .drop-zone.has-file .dz-icon-wrap {
    border-color: var(--orange);
    background: var(--orange-soft);
    transform: scale(1.07);
  }

  .dz-main {
    font-size: 0.83rem;
    color: var(--ink);
    font-weight: 500;
    margin-bottom: 0.22rem;
  }

  .dz-sub {
    font-size: 0.72rem;
    color: var(--ink-2);
  }

  .dz-formats {
    margin-top: 0.6rem;
    font-size: 0.64rem;
    color: #c5bdb5;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .dz-filename {
    font-size: 0.83rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 0.2rem;
    word-break: break-all;
  }

  .dz-meta { font-size: 0.7rem; color: var(--ink-2); }

  .dz-swap {
    margin-top: 0.6rem;
    font-size: 0.68rem;
    color: var(--orange);
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* Messages */
  .msg {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    line-height: 1.55;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideup 0.3s cubic-bezier(0.4,0,0.2,1) both;
  }

  .msg-error  { background: rgba(192,57,43,0.06);  color: var(--error);   border: 1px solid rgba(192,57,43,0.15); }
  .msg-success{ background: rgba(42,125,82,0.06);  color: var(--success); border: 1px solid rgba(42,125,82,0.15); }

  /* Progress */
  .progress-wrap {
    margin-top: 1.1rem;
    height: 3px;
    background: var(--orange-soft);
    border-radius: 99px;
    overflow: hidden;
    animation: slideup 0.3s ease both;
  }

  .progress-fill {
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, var(--orange), var(--orange-light));
    border-radius: 99px;
    position: relative;
    overflow: hidden;
  }

  @keyframes shimmer {
    0%   { transform: translateX(-200%); }
    100% { transform: translateX(400%); }
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 35%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    animation: shimmer 1.1s ease-in-out infinite;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 1.6rem 0;
    opacity: 0.7;
  }

  /* Buttons */
  .btn-row {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    font-family: 'Sora', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: var(--transition);
    padding: 0;
    letter-spacing: 0.01em;
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
    filter: none !important;
  }

  .btn-primary {
    flex: 1;
    background: linear-gradient(135deg, var(--orange) 0%, var(--orange-light) 100%);
    color: #fff;
    padding: 0.9rem 1.5rem;
    box-shadow: var(--shadow-btn);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(242,101,34,0.45);
    filter: brightness(1.05);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-btn);
  }

  .btn-secondary {
    background: var(--orange-pale);
    color: var(--orange);
    border: 1.5px solid var(--orange-soft);
    padding: 0.9rem 1.25rem;
    animation: slideup 0.3s cubic-bezier(0.4,0,0.2,1) both;
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--orange-soft);
    border-color: var(--orange);
    transform: translateY(-1px);
  }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }

  .spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
    flex-shrink: 0;
  }

  /* Footer */
  .card-footer {
    padding: 0.9rem 2.25rem;
    border-top: 1px solid var(--border);
    background: var(--bg);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .footer-pip {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--orange), var(--orange-light));
    flex-shrink: 0;
  }

  .footer-text {
    font-size: 0.65rem;
    color: #b0a89e;
    letter-spacing: 0.04em;
  }

  @keyframes slideup {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fadein { animation: slideup 0.3s cubic-bezier(0.4,0,0.2,1) both; }
`;

function formatBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ color: "var(--orange)" }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default function App() {
  const [file,     setFile]     = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [results,  setResults]  = useState(null);
  const [error,    setError]    = useState(null);
  const [zipBlob,  setZipBlob]  = useState(null);
  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["ods","xlsx","xls"].includes(ext)) {
      setError("Unsupported file type. Please upload an .ods, .xlsx, or .xls file.");
      return;
    }
    setFile(f); setError(null); setResults(null); setZipBlob(null);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleSplit = async () => {
    setLoading(true); setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const resp = await fetch(API_URL, { method: "POST", body: fd });
      if (!resp.ok) throw new Error("Server error — is Django running?");
      const blob = await resp.blob();
      setZipBlob(blob); setResults(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url; a.download = "sku_split_files.zip"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{style}</style>
      <div className="root">
        <div className="card">

          {/* Header */}
          <div className="card-header">
            <div className="brand-row">
              <div className="brand-icon">⚡</div>
              <div className="brand-name">Simpli<em>fi</em></div>
            </div>
            <p className="card-subtitle">
              Upload a spreadsheet and get individual files per SKU — delivered as one clean ZIP.
            </p>
          </div>

          {/* Body */}
          <div className="card-body">

            {/* Drop Zone */}
            <div
              className={`drop-zone${dragging ? " dragging" : ""}${file ? " has-file" : ""}`}
              onClick={() => inputRef.current.click()}
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
            >
              <input
                ref={inputRef} type="file" accept=".ods,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={e => handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="fadein">
                  <div className="dz-icon-wrap">📄</div>
                  <div className="dz-filename">{file.name}</div>
                  <div className="dz-meta">{formatBytes(file.size)}</div>
                  <div className="dz-swap">Replace file</div>
                </div>
              ) : (
                <>
                  <div className="dz-icon-wrap"><UploadIcon /></div>
                  <div className="dz-main">Drop your file here</div>
                  <div className="dz-sub">or click to browse</div>
                  <div className="dz-formats">ODS &nbsp;·&nbsp; XLSX &nbsp;·&nbsp; XLS</div>
                </>
              )}
            </div>

            {error && (
              <div className="msg msg-error">
                <span>✕</span>{error}
              </div>
            )}

            {results && (
              <div className="msg msg-success">
                <span>✓</span>Split complete — your ZIP archive is ready to download.
              </div>
            )}

            {loading && (
              <div className="progress-wrap">
                <div className="progress-fill" />
              </div>
            )}

            <div className="divider" />

            <div className="btn-row">
              <button className="btn btn-primary" onClick={handleSplit} disabled={!file || loading}>
                {loading
                  ? <><span className="spinner" />Processing…</>
                  : "Split by SKU"}
              </button>
              {results && (
                <button className="btn btn-secondary" onClick={handleDownload}>
                  <DownloadIcon /> ZIP
                </button>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="card-footer">
            <div className="footer-pip" />
            <span className="footer-text">Accepts .ods · .xlsx · .xls &nbsp;·&nbsp; Processed via Django</span>
          </div>

        </div>
      </div>
    </>
  );
}