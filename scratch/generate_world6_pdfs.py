import os
from fpdf import FPDF, XPos, YPos

OUTPUT_DIR = "static/learn_resources/resources/world6"

# Color Palette (Mundo 6 Theme - Dark Blue/Steel representation of Uncertainty and Decisions)
BLUE = (30, 58, 71)
WHITE = (255, 255, 255)
DARK  = (20, 30, 35)
GREY  = (70, 80, 85)
LIGHT_BLUE = (240, 249, 255)

def clean(s):
    """Strip characters outside latin-1 range."""
    return s.encode('latin-1', errors='replace').decode('latin-1')

class Doc(FPDF):
    def __init__(self, head1, head2):
        super().__init__()
        self.h1 = clean(head1)
        self.h2 = clean(head2)
        self.set_margins(15, 15, 15)
        self.set_auto_page_break(True, margin=20)

    def header(self):
        self.set_fill_color(*BLUE)
        self.rect(0, 0, 210, 36, 'F')
        self.set_text_color(*WHITE)
        self.set_font('Helvetica', 'B', 12)
        self.set_xy(0, 8)
        self.cell(210, 8, 'ORGANIZACION MUNDIAL DE LA INNOVACION EDUCATIVA (OMIE)', align='C',
                  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_font('Helvetica', 'I', 9)
        self.cell(210, 5, self.h2, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(15)
        self.set_text_color(*DARK)

    def footer(self):
        self.set_y(-13)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f'Pagina {self.page_no()}  |  Mundo 6: Psicologia de la toma de decision y la toma de accion', align='C')

    def stitle(self, t):
        """Green section title bar."""
        self.ln(3)
        self.set_fill_color(*BLUE)
        self.set_text_color(*WHITE)
        self.set_font('Helvetica', 'B', 11)
        self.set_x(15)
        self.cell(180, 8, clean(f'  {t}'), fill=True,
                  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK)
        self.ln(2)

    def sub(self, t):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*BLUE)
        self.set_x(15)
        self.cell(180, 6, clean(t), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK)

    def body(self, t):
        self.set_font('Helvetica', '', 9.5)
        self.set_x(15)
        self.multi_cell(180, 5, clean(t), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

def generate_resumen_conceptual():
    pdf = Doc("Resumen Conceptual: Decisiones, Heuristicas e Incertidumbre", "MANUAL DE CONSULTA RAPIDA - MUNDO 6")
    pdf.add_page()

    pdf.stitle("1. ECONOMIA CONDUCTUAL E IRRACIONALIDAD HUMANA")
    pdf.body(
        "Basado en los estudios fundamentales de Tversky & Kahneman (1974), los seres humanos no toman decisiones "
        "completamente racionales (u optimizadoras) bajo condiciones de incertidumbre. En su lugar, el cerebro emplea "
        "atajos cognitivos llamados heurísticas, las cuales pueden inducir sesgos sistemáticos:\n\n"
        " - Heurística de Disponibilidad: Juzgar la probabilidad de un evento en base a la facilidad con la que "
        "acude a la memoria (ej. recordar un examen fallido reciente).\n"
        " - Sesgo de Anclaje: Depender demasiado de la primera información recibida al tomar decisiones.\n"
        " - Aversión a la Pérdida: El dolor de perder algo es psicológicamente el doble de fuerte que el placer de ganarlo. "
        "En gamificación, esto explica por qué perder monedas BEM es un motivador tan potente (e inestable).\n"
        " - Sesgo del Presente: Tendencia a preferir recompensas inmediatas sobre beneficios futuros más grandes.\n"
        " - Efecto Señuelo: Modificar la preferencia entre dos opciones al introducir una tercera opción dominada asimétricamente."
    )

    pdf.stitle("2. ARQUITECTURA DE DECISIONES EN EL DISENO DE JUEGOS")
    pdf.body(
        "Según Salen & Zimmerman (2004) en 'Rules of Play', un juego de calidad se define por su Juego Significativo "
        "(Meaningful Play), el cual requiere que las acciones del jugador tengan consecuencias discernibles e integradas:\n\n"
        " - Discernibilidad: El jugador debe percibir de inmediato el resultado y el impacto de su acción.\n"
        " - Integración: Las decisiones tomadas en un momento del juego deben tener ramificaciones de largo plazo en la experiencia.\n\n"
        "Tipos de Decisiones Estratégicas:\n"
        " - Trade-offs (Costo de Oportunidad): Elegir un beneficio implica renunciar a otro mutuamente excluyente.\n"
        " - Riesgo vs. Recompensa: Balances donde el jugador pondera mayor dificultad a cambio de mejores botines.\n"
        " - Daño Colateral: Beneficiar un aspecto del progreso a costa de perjudicar otro recurso clave.\n"
        " - Elecciones Ciegas vs. Asimetría de Información: Gestionar la cantidad de información disponible antes de decidir."
    )

    pdf.stitle("3. AUTONOMIA ESTRUCTURADA Y MOTIVACION EN EL AULA")
    pdf.body(
        "Los aportes de Lepper & Henderlong (2000) sobre el Efecto de Sobrejustificación demuestran que las recompensas extrínsecas "
        "pueden minar el interés intrínseco si se perciben como herramientas de control. Para potenciar la motivación:\n\n"
        " - Autonomía Estructurada: Ofrecer opciones predefinidas y seguras donde cualquier camino sea pedagógicamente viable.\n"
        " - Elecciones Triviales o Ilusorias: Permitir que los estudiantes decidan sobre aspectos estéticos o de orden "
        "aumenta significativamente el compromiso intrínseco y la retención cognitiva.\n"
        " - Evitar Opciones Dominantes: Diseñar alternativas de tal forma que ninguna sea objetivamente superior, "
        "forzando al alumno a evaluar sus propias fortalezas y preferencias."
    )

    pdf.stitle("4. TENSION LUDICA Y PROCESAMIENTO COGNITIVO-EMOCIONAL")
    pdf.body(
        "Mullins & Sabherwal (2018) analizan cómo las mecánicas lúdicas de riesgo y tensión activan canales cognitivos "
        "y afectivos (emocionales) durante el proceso de toma de decisiones y acción:\n\n"
        " - Procesamiento Cognitivo: Consiste en la evaluación racional de las alternativas, cálculo de probabilidades, "
        "estimación de costos de oportunidad y planificación estratégica de la decisión.\n"
        " - Procesamiento Afectivo (Tensión y Riesgo): Consiste en la respuesta emocional (entusiasmo, nerviosismo, alerta) "
        "provocada por la posibilidad de ganar o perder recursos en el juego (ej. apostar BEM Coins). La tensión lúdica "
        "funciona como un potente estimulador de la atención e impulsor de la acción.\n"
        " - Equilibrio Pedagógico: La tensión lúdica debe diseñarse en un punto óptimo. Demasiada tensión (pérdidas excesivas o "
        "decisiones sin información) causa parálisis por ansiedad; muy poca tensión (opciones sin consecuencias) genera aburrimiento y apatía."
    )

    path = os.path.join(OUTPUT_DIR, "resumen_teorico_mundo6.pdf")
    pdf.output(path)
    print(f"Generado: {path}")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    generate_resumen_conceptual()
