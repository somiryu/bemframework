import os
import markdown
from weasyprint import HTML, CSS

MD_PATH = "docs/world7_design.md"
OUT_DIR = "static/learn_resources/resources/world7"

os.makedirs(OUT_DIR, exist_ok=True)

# ── 1. GENERATE DETRÁS DE CÁMARAS PDF ────────────────────────────────
with open(MD_PATH, "r", encoding="utf-8") as f:
    raw = f.read()

# Exclude Section 7 (Logros, Medallas y Recompensas)
exclude_marker = "## 🏆 7. Logros, Medallas y Recompensas"
if exclude_marker in raw:
    raw = raw.split(exclude_marker)[0]
else:
    exclude_marker_alt = "## 🏆 7."
    if exclude_marker_alt in raw:
        raw = raw.split(exclude_marker_alt)[0]

md_html = markdown.markdown(
    raw,
    extensions=["tables", "fenced_code", "nl2br", "sane_lists"]
)

html_doc_design = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Diseño del Mundo 7 — Detrás de Cámaras</title>
</head>
<body>
  <div class="cover">
    <div class="cover-header">ORGANIZACIÓN MUNDIAL DE LA INNOVACIÓN EDUCATIVA (OMIE)</div>
    <h1 class="cover-title">Diseño del Mundo 7</h1>
    <h2 class="cover-subtitle">Detrás de Cámaras</h2>
    <p class="cover-desc">Sistemas de Evaluación, Metas e Incentivos en Entornos de Aprendizaje</p>
  </div>
  <div class="content">
    {md_html}
  </div>
</body>
</html>"""

# ── 2. GENERATE RESUMEN TEÓRICO PDF ──────────────────────────────────
resumen_md = """# Resumen Teórico: Evaluación e Incentivos en Juegos

Este documento sintetiza la teoría pedagógica y lúdica del **Mundo 7: Evaluación e Incentivos**, enfocada en cómo la medición del progreso regula la motivación intrínseca y la conducta del estudiante.

---

## 🎯 1. Los Disparadores de la Evaluación (Triggers)

El disparador es el detonador conductual que activa el proceso evaluativo. Se clasifican según el nivel de control y la recurrencia del estudiante:

*   **Acción**: El estudiante tiene **control total e inmediato** sobre su comportamiento (ej: subir un reporte, publicar en el foro). Genera certeza sobre la consecuencia directa de la acción.
*   **Meta**: Introduce **incertidumbre y dependencia**. El resultado no está en el control total del alumno, ya que depende del azar, del desempeño del equipo o de la valoración subjetiva de un tercero (ej: que todo el equipo obtenga más de 8 puntos).
*   **Farmeable**: Una acción **sencilla y repetible sin límite** que acumula beneficios acumulativos de forma predecible (ej: responder preguntas libres para ganar monedas).

---

## 📏 2. Sistemas de Procesamiento de la Evaluación

Una vez disparada la evaluación, el sistema procesa la información y emite una consecuencia empleando diversas mecánicas:

*   **Criterios Dinámicos**: Evaluación subjetiva y variable, sin rúbrica predefinida. Depende enteramente del estado mental y criterio del docente en el momento (riesgo de sesgo cognitivo o "jugar al jurado").
*   **Rúbrica Multicanal**: Combina múltiples criterios cualitativos (seguridad, técnica, presentación) en una sola nota unificada. Si no se diseñan canales separados, se genera un **gap evaluativo** donde una debilidad en una dimensión queda oculta por un acierto en otra.
*   **Calificación Directa**: Consecuencia transaccional fija y directa, como puntos sumativos o sellos de aprobación.
*   **Efecto Sistémico**: No otorga puntos. En su lugar, altera los permisos, accesos o roles del estudiante en el sistema (ej: desbloquear el rol de Tutor o el modo difícil del simulador).
*   **Algoritmo Matemático**: Fórmulas lúdicas que calculan el puntaje incorporando variables dinámicas como rachas, multiplicadores temporales o penalizaciones de dificultad.
*   **Dashboard de Información**: Entrega datos estadísticos crudos sin calificar ni juzgar. Su único propósito es la **retroalimentación para la autorregulación** (autonomía y autocontrol).

---

## 🐀 3. Incentivos Perversos y Gaming the System

Cuando el sistema de evaluación premia variables desalineadas de la meta de aprendizaje real, los estudiantes adaptan su conducta tácticamente para ganar el sistema (*gaming*):

*   **Farming de baja calidad**: Provocado al recompensar solo la cantidad o el volumen (Slide 15). Los estudiantes repetirán la tarea más sencilla e inútil para acumular puntos sin esfuerzo intelectual.
*   **Deseabilidad Social**: Provocado al premiar la coincidencia de notas (Slide 19). Obliga al estudiante a imitar el criterio del docente en vez de reflexionar críticamente sobre su propio progreso.
*   **Speedrunning Cognitivo**: Provocado al penalizar severamente el tiempo extra. Induce a la entrega apresurada y a adivinar respuestas a cambio de velocidad.

---

## 🤝 4. Principios de Diseño BEM para Evaluación

1.  **Mantener Canales Separados**: Cada parámetro de evaluación debe generar su propio feedback y su propia consecuencia. No combine destrezas de naturaleza diferente en una sola ecuación.
2.  **Fomentar Efectos Sistémicos**: Utilice el desbloqueo de estatus, privilegios y responsabilidades para motivar al alumno sin inflar la economía de puntos.
3.  **Andamiar las Rachas**: Si un algoritmo utiliza mecánicas de racha (rachas de estudio o respuestas), evite la penalización total a cero por un error único, ya que la aversión a la pérdida puede aniquilar la motivación del estudiante de continuar esforzándose.
"""

resumen_html = markdown.markdown(
    resumen_md,
    extensions=["tables", "fenced_code", "nl2br", "sane_lists"]
)

html_doc_theory = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Resumen Teórico Mundo 7 — Evaluación e Incentivos</title>
</head>
<body>
  <div class="cover">
    <div class="cover-header">ORGANIZACIÓN MUNDIAL DE LA INNOVACIÓN EDUCATIVA (OMIE)</div>
    <h1 class="cover-title">Evaluación e Incentivos</h1>
    <h2 class="cover-subtitle">Manual Conceptual y Teórico</h2>
    <p class="cover-desc">Guía para el Diseño de Sistemas de Evaluación Lúdicos y Formativos</p>
  </div>
  <div class="content">
    {resumen_html}
  </div>
</body>
</html>"""

# ── 3. COMMON CSS ────────────────────────────────────────────────────
css_design = CSS(string="""
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

@page {
  size: A4;
  margin: 22mm 18mm 20mm 18mm;
  @top-center {
    content: "OMIE · Mundo 7: Sistemas de Evaluación e Incentivos";
    font-family: 'Inter', Helvetica, sans-serif;
    font-size: 8pt;
    color: #4b5563;
    border-bottom: 0.5pt solid #cbd5e1;
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
  color: #1e293b;
  background: #fff;
}

.cover {
  page-break-after: always;
  background: #0f172a;
  color: white;
  padding: 80pt 40pt 50pt;
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
  color: #e2e8f0;
  margin-bottom: 40pt;
  border-bottom: 1pt solid #475569;
  padding-bottom: 12pt;
}
h1.cover-title {
  font-size: 34pt;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 10pt;
}
h2.cover-subtitle {
  font-size: 20pt;
  font-weight: 600;
  color: #cbd5e1;
  margin: 0 0 24pt;
}
.cover-desc {
  font-size: 11pt;
  color: #94a3b8;
  font-style: italic;
}

.content {
  padding-top: 6pt;
}

h1, h2, h3, h4, h5 {
  font-family: 'Inter', Helvetica, sans-serif;
  color: #0f172a;
  margin-top: 18pt;
  margin-bottom: 6pt;
  page-break-after: avoid;
}

h1 { font-size: 18pt; font-weight: 700; border-bottom: 2pt solid #0f172a; padding-bottom: 4pt; }
h2 {
  font-size: 14pt;
  font-weight: 700;
  background: #334155;
  color: white;
  padding: 5pt 8pt;
  border-radius: 3pt;
  margin-top: 24pt;
}
h3 { font-size: 12pt; font-weight: 600; border-left: 3pt solid #64748b; padding-left: 8pt; color: #1e293b; }
h4 { font-size: 10.5pt; font-weight: 600; color: #334155; text-decoration: underline; text-decoration-color: #94a3b8; }
h5 { font-size: 10pt; font-weight: 600; color: #475569; }

p { margin: 0 0 8pt; }

blockquote {
  border-left: 4pt solid #475569;
  background: #f8fafc;
  margin: 10pt 0;
  padding: 8pt 12pt;
  border-radius: 0 4pt 4pt 0;
  color: #334155;
  font-size: 9.5pt;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
  margin: 10pt 0 14pt;
  page-break-inside: avoid;
}
th {
  background: #0f172a;
  color: white;
  padding: 5pt 8pt;
  text-align: left;
  font-weight: 600;
}
td {
  padding: 5pt 8pt;
  border-bottom: 0.5pt solid #cbd5e1;
  vertical-align: top;
}
tr:nth-child(even) td { background: #f8fafc; }

code {
  font-family: 'Courier New', monospace;
  font-size: 8.5pt;
  background: #f1f5f9;
  padding: 1pt 3pt;
  border-radius: 2pt;
  color: #0f172a;
}
pre {
  background: #f8fafc;
  border: 0.5pt solid #cbd5e1;
  border-left: 3pt solid #475569;
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
  color: #0f172a;
}

ul, ol {
  margin: 4pt 0 8pt 16pt;
  padding: 0;
}
li { margin-bottom: 3pt; }
li > ul, li > ol { margin-top: 2pt; margin-bottom: 2pt; }

hr {
  border: none;
  border-top: 1pt solid #cbd5e1;
  margin: 16pt 0;
}

strong { color: #0f172a; }
em { color: #334155; }
a { color: #475569; text-decoration: none; }
""")

# ── 4. WRITE TARGETS ─────────────────────────────────────────────────
print("Generando diseno_mundo7_detras_de_camaras.pdf...")
HTML(string=html_doc_design, base_url=".").write_pdf(
    os.path.join(OUT_DIR, "diseno_mundo7_detras_de_camaras.pdf"),
    stylesheets=[css_design]
)

print("Generando resumen_teorico_mundo7.pdf...")
HTML(string=html_doc_theory, base_url=".").write_pdf(
    os.path.join(OUT_DIR, "resumen_teorico_mundo7.pdf"),
    stylesheets=[css_design]
)
print("[OK] PDF generation complete.")
