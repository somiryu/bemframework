"""
Converts docs/world4_design.md to a styled PDF via markdown → HTML → PDF (WeasyPrint).
Sections 7 (Logros, Medallas y Recompensas) is excluded.
"""

import re
import markdown
from weasyprint import HTML, CSS

MD_PATH  = "docs/world4_design.md"
OUT_PATH = "static/learn_resoruces/resorces/world4/diseno_mundo4_detras_de_camaras.pdf"

# ── Read and strip section 7 ──────────────────────────────────
with open(MD_PATH, "r", encoding="utf-8") as f:
    raw = f.read()

# Remove everything from "## 🏆 7." onwards
raw = re.split(r"\n## 🏆 7\.", raw)[0].rstrip()

# ── Convert MD → HTML ─────────────────────────────────────────
md_html = markdown.markdown(
    raw,
    extensions=["tables", "fenced_code", "nl2br", "sane_lists"]
)

# ── Full HTML document ────────────────────────────────────────
html_doc = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Diseño del Mundo 4 — Detrás de Cámaras</title>
</head>
<body>
  <div class="cover">
    <div class="cover-header">ORGANIZACIÓN MUNDIAL DE LA INNOVACIÓN EDUCATIVA (OMIE)</div>
    <h1 class="cover-title">Diseño del Mundo 4</h1>
    <h2 class="cover-subtitle">Detrás de Cámaras</h2>
    <p class="cover-desc">Documento de diseño pedagógico y lúdico completo</p>
  </div>
  <div class="content">
    {md_html}
  </div>
</body>
</html>"""

# ── CSS ───────────────────────────────────────────────────────
css = CSS(string="""
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

@page {
  size: A4;
  margin: 22mm 18mm 20mm 18mm;
  @top-center {
    content: "OMIE · Mundo 4: Arquitectura de Metas y Expectativas";
    font-family: 'Inter', Helvetica, sans-serif;
    font-size: 8pt;
    color: #6b7280;
    border-bottom: 0.5pt solid #d1fae5;
    padding-bottom: 3pt;
  }
  @bottom-center {
    content: "Página " counter(page) " de " counter(pages);
    font-family: 'Inter', Helvetica, sans-serif;
    font-size: 8pt;
    color: #9ca3af;
  }
}

@page :first {
  @top-center { content: none; }
}

* { box-sizing: border-box; }

body {
  font-family: 'Inter', Helvetica, Arial, sans-serif;
  font-size: 10pt;
  line-height: 1.65;
  color: #1a2b1e;
  background: #fff;
}

/* ── Cover ── */
.cover {
  page-break-after: always;
  background: #1e4533;
  color: white;
  padding: 60pt 40pt 50pt;
  min-height: 260mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.cover-header {
  font-size: 9pt;
  letter-spacing: 1pt;
  text-transform: uppercase;
  color: #86efac;
  margin-bottom: 40pt;
  border-bottom: 1pt solid #4ade80;
  padding-bottom: 12pt;
}
h1.cover-title {
  font-size: 36pt;
  font-weight: 700;
  color: #f0fdf4;
  margin: 0 0 10pt;
  border: none;
}
h2.cover-subtitle {
  font-size: 22pt;
  font-weight: 600;
  color: #86efac;
  margin: 0 0 24pt;
  border: none;
}
.cover-desc {
  font-size: 11pt;
  color: #bbf7d0;
  font-style: italic;
}

/* ── Content ── */
.content {
  padding-top: 6pt;
}

h1, h2, h3, h4, h5 {
  font-family: 'Inter', Helvetica, sans-serif;
  color: #1e4533;
  margin-top: 18pt;
  margin-bottom: 6pt;
  page-break-after: avoid;
}

h1 { font-size: 18pt; font-weight: 700; border-bottom: 2pt solid #1e4533; padding-bottom: 4pt; }
h2 {
  font-size: 14pt;
  font-weight: 700;
  background: #1e4533;
  color: white;
  padding: 5pt 8pt;
  border-radius: 3pt;
  margin-top: 24pt;
}
h3 { font-size: 12pt; font-weight: 600; border-left: 3pt solid #4ade80; padding-left: 8pt; color: #166534; }
h4 { font-size: 10.5pt; font-weight: 600; color: #166534; text-decoration: underline; text-decoration-color: #86efac; }
h5 { font-size: 10pt; font-weight: 600; color: #374151; }

p { margin: 0 0 8pt; }

/* blockquotes used for NOTE/TIP markers */
blockquote {
  border-left: 4pt solid #4ade80;
  background: #f0fdf4;
  margin: 10pt 0;
  padding: 8pt 12pt;
  border-radius: 0 4pt 4pt 0;
  color: #166534;
  font-size: 9.5pt;
}

/* tables */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
  margin: 10pt 0 14pt;
  page-break-inside: avoid;
}
th {
  background: #1e4533;
  color: white;
  padding: 5pt 8pt;
  text-align: left;
  font-weight: 600;
}
td {
  padding: 5pt 8pt;
  border-bottom: 0.5pt solid #d1fae5;
  vertical-align: top;
}
tr:nth-child(even) td { background: #f0fdf4; }

/* code blocks */
code {
  font-family: 'Courier New', monospace;
  font-size: 8.5pt;
  background: #f8fafc;
  padding: 1pt 3pt;
  border-radius: 2pt;
  color: #065f46;
}
pre {
  background: #f1f5f1;
  border: 0.5pt solid #d1fae5;
  border-left: 3pt solid #4ade80;
  padding: 8pt 10pt;
  font-size: 8pt;
  line-height: 1.5;
  border-radius: 3pt;
  overflow: auto;
  page-break-inside: avoid;
  margin: 8pt 0;
}
pre code {
  background: none;
  padding: 0;
  color: #1a2b1e;
}

/* lists */
ul, ol {
  margin: 4pt 0 8pt 16pt;
  padding: 0;
}
li { margin-bottom: 3pt; }
li > ul, li > ol { margin-top: 2pt; margin-bottom: 2pt; }

/* horizontal rules */
hr {
  border: none;
  border-top: 1pt solid #d1fae5;
  margin: 16pt 0;
}

strong { color: #166534; }
em { color: #374151; }

a { color: #166534; text-decoration: none; }
""")

# ── Generate PDF ──────────────────────────────────────────────
print("Generando PDF...")
HTML(string=html_doc, base_url=".").write_pdf(OUT_PATH, stylesheets=[css])
print(f"[OK] PDF generado: {OUT_PATH}")
