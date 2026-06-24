import os
from fpdf import FPDF, XPos, YPos

OUTPUT_DIR = "static/learn_resources/resources/world5"

GREEN = (30, 69, 51)
WHITE = (255, 255, 255)
DARK  = (20, 35, 25)
GREY  = (60, 60, 60)
LIGHT_GREEN = (240, 253, 244)

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
        self.set_fill_color(*GREEN)
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
        self.cell(0, 8, f'Pagina {self.page_no()}  |  Mundo 5: Llamados a la Accion y Capturadores de Atencion', align='C')

    def stitle(self, t):
        """Green section title bar."""
        self.ln(3)
        self.set_fill_color(*GREEN)
        self.set_text_color(*WHITE)
        self.set_font('Helvetica', 'B', 11)
        self.set_x(15)
        self.cell(180, 8, clean(f'  {t}'), fill=True,
                  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK)
        self.ln(2)

    def sub(self, t):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*GREEN)
        self.set_x(15)
        self.cell(180, 6, clean(t), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(*DARK)

    def body(self, t):
        self.set_font('Helvetica', '', 9.5)
        self.set_x(15)
        self.multi_cell(180, 5, clean(t), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

def generate_detras_de_camaras():
    pdf = Doc("Mundo 5: Detras de Camaras", "DOCUMENTO TECNICO DE DISENO - SARA ARBELAEZ")
    pdf.add_page()
    
    pdf.stitle("1. INTRODUCCION Y OBJETIVO DEL MUNDO 5")
    pdf.body(
        "El Mundo 5 aborda la atencion como el recurso mas valioso y escaso en el entorno educativo virtual y presencial. "
        "El objetivo es capacitar a los diseñadores de motivacion para diseñar señales y llamados a la accion (Triggers) "
        "adecuados, evitando el spam y el condicionamiento negativo que genera ansiedad o fatiga por alerta en el alumno."
    )

    pdf.stitle("2. ESTRUCTURA TECNICA DEL WORKSHOP MULTIJUGADOR")
    pdf.body(
        "El taller sincrono multijugador implementa un sistema robusto de presencia en tiempo real soportado por Supabase. "
        "En lugar de una sola cola global, cada traspaso de turno genera transiciones individuales en el servidor mediante el "
        "objeto 'active_transitions', lo que permite multiples hilos activos simultaneos sin desincronizacion.\n\n"
        "Caracteristicas Clave:\n"
        " - Temporizador Individual de 15 Segundos: Si el Jugador Activo no responde a tiempo, el sistema auto-traspasa el turno.\n"
        " - Tolerancia a Fallos: El estado de la sesion del taller se guarda persistentemente en 'workshop_session_state' para "
        "permitir que los usuarios que recarguen la pagina retomen exactamente donde quedaron sin perder progreso.\n"
        " - Animaciones de Alerta: Efecto de latido (Heartbeat) y destello (Glint) en los bordes de la pantalla durante los ultimos "
        "3 segundos del temporizador para incentivar la accion inmediata."
    )

    pdf.stitle("3. ANALISIS DE LAS TRES FASES DEL TALLER")
    pdf.sub("Fase 1: Matriz de Atencion (2x2)")
    pdf.body(
        "El Jugador Activo debe ubicar estimulos en un cuadrante en base a dos ejes: Intensidad (Baja/Alta) y Coherencia (Decorativa/Integrada). "
        "Fomenta el analisis de que tipo de alertas realmente merecen la atencion del estudiante."
    )
    
    pdf.sub("Fase 2: Semaforo de Timing y Frecuencia")
    pdf.body(
        "Un reto de drag-and-drop donde se clasifican las señales en base a su urgencia (Rojo, Amarillo, Verde). "
        "Ayuda a los estudiantes a entender el ritmo de notificaciones."
    )

    pdf.sub("Fase 3: Dial de Intensidad y Subjetividad")
    pdf.body(
        "El estudiante calibra la intensidad optima de un estimulo usando sliders en vivo. El sistema compara las elecciones "
        "de los alumnos con la alineacion colectiva y las directrices tecnicas de GIOCHI."
    )

    pdf.stitle("4. ALINEACION CON GIOCHI Y JUSTIFICACION CIENTIFICA")
    pdf.body(
        "GIOCHI actua como el auditor de diseño. Todas las retroalimentaciones del taller y el entrenamiento estan validadas "
        "por la postura de GIOCHI, la cual prioriza la atencion voluntaria e intrinseca del alumno sobre disparadores "
        "punitivos o condicionamientos artificiales."
    )

    path = os.path.join(OUTPUT_DIR, "diseno_mundo5_detras_de_camaras.pdf")
    pdf.output(path)
    print(f"Generado: {path}")

def generate_resumen_conceptual():
    pdf = Doc("Resumen Conceptual: Notificadores, Timing y Ansiedad", "MANUAL DE CONSULTA RAPIDA - MUNDO 5")
    pdf.add_page()

    pdf.stitle("1. CONDICIONAMIENTO CLASICO Y EL BUCLE DEL HABITO")
    pdf.body(
        "El diseño de llamados a la accion se fundamenta en la psicologia del comportamiento. Un habito se compone de:\n"
        "  - Senal (Trigger): El disparador que capta la atencion del estudiante (timbre, notificacion push, parpadeo visual).\n"
        "  - Rutina (Comportamiento): La accion de aprendizaje real ejecutada por el alumno.\n"
        "  - Recompensa: La retroalimentacion neurologica y emocional de logro (monedas BEM, barra de progreso o fanfarria).\n\n"
        "Regla de Oro: La señal debe ser consistente y no ambigua. Señales duplicadas o que significan multiples cosas a la vez "
        "rompen el condicionamiento y generan inercia cognitiva."
    )

    pdf.stitle("2. TIMING, FRECUENCIA Y EVITACION DE LA FATIGA POR ALERTA")
    pdf.body(
        "El timing define el momento preciso del disparador:\n"
        "  - Notificaciones Push: Enviadas proactivamente por el sistema. Deben alinearse con la agenda del alumno. "
        "Enviarlas a deshoras destruye la confianza y promueve que el alumno las desactive.\n"
        "  - Notificaciones Pull: Solicitadas por el usuario al interactuar con el entorno.\n"
        "  - Zona de Amortiguacion (Buffer): Un retardo sutil en las alertas que ayuda al cerebro del alumno a desconectarse "
        "de la tarea previa y enfocarse en la nueva actividad sin estres visual."
    )

    pdf.stitle("3. IMPACTO EMOCIONAL, SEGURIDAD PSICOLOGICA Y ANSIEDAD")
    pdf.body(
        "Los llamados a la accion pueden gatillar diferentes respuestas emocionales:\n"
        "  - Alertas Punitivas: Notificaciones que usan el miedo a perder o el castigo social para obligar al estudio. "
        "Gatillan la activacion de la amigdala y promueven la evasion o el abandono del sistema.\n"
        "  - Disparadores Basados en Relatedness: Recordatorios que apelan a la conexion social o pertenencia, "
        "los cuales demuestran ser mas efectivos y menos estresantes para reactivar habitos.\n"
        "  - Disparadores Visuales por Contraste: El parpadeo de un elemento en una pantalla estatica actua como una "
        "señal implicita de alto impacto sin requerir explicaciones textuales ni interrupciones invasivas."
    )

    path = os.path.join(OUTPUT_DIR, "resumen_teorico_mundo5.pdf")
    pdf.output(path)
    print(f"Generado: {path}")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    # generate_detras_de_camaras()  # Handled by md_to_pdf_world5.py
    generate_resumen_conceptual()
