"""
Generates resumen_teorico_mundo1.pdf using WeasyPrint from a styled Markdown template.
"""

import os
import markdown
from weasyprint import HTML, CSS

OUT_PATH = "static/learn_resources/resources/world1/resumen_teorico_mundo1.pdf"

# Create output dir if not exist
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

raw_markdown = """
# Resumen Conceptual: Los 7 Drivers BEM de Motivación Intrínseca

Este documento sirve como manual de consulta rápida sobre los fundamentos de motivación del Framework BEM.

---

## 1. La Psicología de la Motivación Intrínseca: BEM vs. PBL
La gamificación tradicional suele caer en lo que en el marco BEM denominamos **"gamificación perezosa"**. Esta consiste en superponer una capa superficial de incentivos extrínsecos —Puntos, Medallas y Tablas de Clasificación (PBL, por sus siglas en inglés)— sobre una actividad de aprendizaje que de origen carece de interés para el alumno. Esto funciona como una **Caja de Skinner** conductual: empuja el comportamiento mediante premios transaccionales, pero destruye la motivación intrínseca a largo plazo, generando agotamiento o conductas especulativas (farming de puntos).

El modelo **BEM (Behavior • Experience • Meaning)** propone una alternativa de **diseño sistémico**:
- **Behavior (Conducta)**: El "¿Por qué lo hago?" que estructura las intenciones del alumno.
- **Experience (Experiencia)**: La gestión de emociones y del ritmo (tensión, Flow) durante el recorrido.
- **Meaning (Sentido)**: El progreso real y la evolución cognitiva del estudiante (Key Learning Indicators - KLI).

---

## 2. Los 7 Drivers BEM de Motivación
El diseño BEM reemplaza los premios cosméticos por **hipótesis de diseño motivacional**, organizadas en 7 drivers intrínsecos de la conducta humana:

### 1. Identidad Épica y Propósito
El motor del sentido a largo plazo. Despierta cuando el estudiante siente que sus acciones contribuyen a un bien colectivo mayor, una causa social superior o una narrativa grandiosa.
- *Ejemplo*: Diseñar una campaña de reciclaje real para limpiar un parque municipal en ciencias sociales.

### 2. Descubrimiento y Creatividad
Alimentado por la curiosidad y la gestión de la incertidumbre. Empuja al alumno a explorar lo desconocido, experimentar libremente bajo dinámicas "Sandbox" y descifrar misterios.
- *Ejemplo*: Laboratorio virtual donde se combinan compuestos químicos libremente para ver las reacciones.

### 3. Empoderamiento y Control
Centrado en la autonomía externa. Apela a la necesidad del estudiante de ejercer influencia y tomar decisiones que alteren las reglas o el rumbo de la actividad de aprendizaje.
- *Ejemplo*: Debatir y definir democráticamente en el aula los criterios y puntajes de la rúbrica del periodo.

### 4. Maestría y Progreso
Impulsado por el deseo de superación personal y adquisición de competencias. Requiere curvas de dificultad calibradas para inducir el **Flow** y barras de progreso visuales del crecimiento técnico.
- *Ejemplo*: Desafíos semanales con niveles adaptativos de dificultad en plataformas de matemáticas.

### 5. Vinculación y Empatía (Relacionamiento)
Basado en la necesidad social de pertenencia. Fomenta la cohesión del grupo mediante el trabajo cooperativo, gremios, debates dialógicos y ayuda mutua.
- *Ejemplo*: Taller en parejas rotativas donde uno asume el rol de mentor y otro de aprendiz frente a un reto.

### 6. Eficiencia y Productividad
Se orienta a la optimización de recursos y tiempo. Satisface el driver al minimizar la fricción burocrática operativa y maximizar los entregables con el menor esfuerzo posible.
- *Ejemplo*: Permitir eximirse de un quiz final repetitivo si automatizan una hoja de cálculo administrativa.

### 7. Hedonismo y Placer Estético
Focalizado en el bienestar sensorial y emocional de la interfaz o el entorno. Utiliza el arte, el diseño visual, el sonido y las transiciones fluidas para generar deleite estético inmediato.
- *Ejemplo*: Personalizar avatares y entornos virtuales con paletas de colores y música agradable.

---

## 3. Principio de Alineación de Actividades
Un diseñador BEM no convierte el estudio en un videojuego infantil. Diseña **actividades serias de aprendizaje** que integran orgánicamente estas fuerzas. Al planear un curso, se recomienda ofrecer un abanico de **metas secundarias (voluntarias)** alineadas con diferentes drivers para que cada estudiante personalice su recorrido de estudio según su motivación genuina.
"""

md_html = markdown.markdown(
    raw_markdown,
    extensions=["tables", "fenced_code", "nl2br", "sane_lists"]
)

html_doc = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Resumen Conceptual Mundo 1</title>
</head>
<body>
  <div class="cover">
    <div class="cover-header">ORGANIZACIÓN MUNDIAL DE LA INNOVACIÓN EDUCATIVA (OMIE)</div>
    <h1 class="cover-title">Resumen Conceptual: Mundo 1</h1>
    <h2 class="cover-subtitle">Los 7 Drivers BEM de Motivación</h2>
    <p class="cover-desc">Manual de consulta rápida para el diseño de aprendizaje sistémico</p>
  </div>
  <div class="content">
    {md_html}
  </div>
</body>
</html>"""

css = CSS(string="""
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

@page {
  size: A4;
  margin: 22mm 18mm 20mm 18mm;
  @top-center {
    content: "OMIE · Mundo 1: Los 7 Drivers BEM de Motivación Intrínseca";
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

body {
  font-family: 'Inter', Helvetica, Arial, sans-serif;
  font-size: 10pt;
  line-height: 1.65;
  color: #1a2b1e;
  background: #fff;
}

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
  font-size: 30pt;
  font-weight: 700;
  color: #f0fdf4;
  margin: 0 0 10pt;
}
h2.cover-subtitle {
  font-size: 20pt;
  font-weight: 600;
  color: #86efac;
  margin: 0 0 24pt;
}
.cover-desc {
  font-size: 11pt;
  color: #bbf7d0;
  font-style: italic;
}

.content { padding-top: 6pt; }

h1, h2, h3, h4 {
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

p { margin: 0 0 8pt; }

ul { margin: 4pt 0 8pt 16pt; }
li { margin-bottom: 3pt; }

strong { color: #166534; }
""")

print("Generando resumen conceptual PDF...")
HTML(string=html_doc, base_url=".").write_pdf(OUT_PATH, stylesheets=[css])
print(f"[OK] PDF generado: {OUT_PATH}")
