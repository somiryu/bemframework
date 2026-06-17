import os
from fpdf import FPDF, XPos, YPos

OUTPUT_DIR = "/Users/freetoplay/Dev/Svelte/bem-framework/static/learn_resoruces/resorces/world4"

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
        self.cell(0, 8, f'Pagina {self.page_no()}  |  Mundo 4: Arquitectura de Metas y Expectativas', align='C')

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
        self.set_text_color(*GREY)
        self.set_x(15)
        self.multi_cell(180, 5.5, clean(t))
        self.ln(2)

    def bullets(self, items):
        self.set_font('Helvetica', '', 9.5)
        self.set_text_color(*GREY)
        for it in items:
            self.set_x(15)
            self.multi_cell(180, 5.5, clean(f'  - {it}'))
        self.ln(2)

    def note(self, t):
        self.set_font('Helvetica', 'I', 9)
        self.set_fill_color(*LIGHT_GREEN)
        self.set_draw_color(*GREEN)
        self.set_text_color(*GREEN)
        self.set_x(15)
        self.multi_cell(180, 5.5, clean(f'[Nota] {t}'), border=1, fill=True)
        self.ln(3)
        self.set_draw_color(0, 0, 0)
        self.set_text_color(*DARK)

    def main_title(self, line1, line2, sub):
        self.set_font('Helvetica', 'B', 18)
        self.set_text_color(*GREEN)
        self.set_x(15)
        self.cell(180, 12, clean(line1), align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_font('Helvetica', 'B', 14)
        self.set_x(15)
        self.cell(180, 8, clean(line2), align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_font('Helvetica', 'I', 10)
        self.set_text_color(80, 80, 80)
        self.set_x(15)
        self.cell(180, 6, clean(sub), align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(8)
        self.set_text_color(*DARK)


# ─────────────────────────────────────────────────────────────
# PDF 1
# ─────────────────────────────────────────────────────────────
def pdf_behind_scenes():
    d = Doc('Diseno del Mundo 4', 'Mundo 4 | Diseno del Mundo: Detras de Camaras')
    d.add_page()
    d.main_title('Diseno del Mundo 4:', 'Detras de Camaras',
                 'Documento interno de diseno pedagogico y ludico')

    d.stitle('1. Informacion General')
    d.bullets([
        'Numero de Mundo: Mundo 4',
        'Titulo: Arquitectura de Metas y Expectativas',
        'Tema Central: Diseno de objetivos narrativos, principales y secundarios, y alineacion de la matriz de expectativas.',
        'Mentor Asignado: Kira (tono pausado, sabio y claro)',
        'Locacion narrativa: El Faro de la Orientacion',
    ])

    d.stitle('2. Capa Narrativa e Introduccion')
    d.body(
        'La narrativa de apertura esta a cargo de Kira. Su rol es contextualizar al estudiante '
        'en la mision de trazar un rumbo claro en el diseno motivacional. Los dialogos guian al '
        'alumno desde la metafora del Faro de la Orientacion hacia la comprension de por que los '
        'objetivos mal estructurados dispersan la energia del estudiante.'
    )
    d.sub('Dialogos de apertura:')
    d.bullets([
        '"Bienvenido al Faro de la Orientacion, Agente. Aqui trazamos el rumbo correcto." (Pose: base)',
        '"Un objetivo confuso es como navegar sin brujula. Si el jugador no sabe a donde va, su energia se dispersara." (Pose: animated)',
        '"Analizaremos como estructurar las metas: lo que queremos y tenemos vs. lo que evitamos o deseamos alcanzar." (Pose: animated)',
    ])

    d.stitle('3. Taller Sincronico: Estructura de Slides (3 Partes)')

    d.sub('PARTE 1: Calibracion de Expectativas (Slides 1 a 8)')
    d.body(
        'Los slides 1 a 7 usan un unico componente reutilizable. En cada slide, los estudiantes '
        'evaluan 4 metas con un slider del 1 al 5 para la variable de expectativa activa. '
        'El slide 8 es de priorizacion: el estudiante distribuye 10 puntos entre las 7 variables. '
        'El feedback colectivo muestra el promedio de la clase en tiempo real.'
    )
    d.bullets([
        'Slide 1: Deseabilidad (atraccion inicial hacia la meta)',
        'Slide 2: Progreso Visible (retroalimentacion del avance)',
        'Slide 3: Probabilidad de Logro / Dificultad (desafio equilibrado)',
        'Slide 4: Plazo / Termino (proximidad del logro)',
        'Slide 5: Consistencia de Medicion (objetividad vs subjetividad)',
        'Slide 6: Agencia vs Incertidumbre (autonomia vs azar)',
        'Slide 7: Esfuerzo / Trabajo Requerido (carga cognitiva)',
        'Slide 8: Priorizacion de las 7 variables (10 puntos distribuibles)',
    ])

    d.sub('PARTE 2: Matriz Quiero/Tengo (8 escenarios)')
    d.body(
        'El estudiante clasifica 8 escenarios de metas de aprendizaje en los 4 cuadrantes '
        'de la Matriz Quiero/Tengo. Todos involucran agencia del docente y contextos realistas.'
    )
    d.bullets([
        'Quiero y Tengo (x2): Exencion del examen final, Multiplicador x2 por racha activa.',
        'No Quiero y Tengo (x2): Penalizacion de laboratorio, Alerta de inasistencia.',
        'Quiero y No Tengo (x2): Pase de apuntes en parcial, Rol de lider del proyecto.',
        'No Quiero y No Tengo (x2): Reporte de plagio, Tutorias de sabado por bajo rendimiento.',
    ])

    d.sub('PARTE 3: Tipos de Metas (Slides 1 a 5)')
    d.bullets([
        'Slide 1: Alineacion de Metas Narrativas. 10 metas, slider de alineacion 1-5.',
        'Slide 2: Metas Principales. 8 metas (Aproximacion y Evasion), slider de frustracion 1-5.',
        'Slide 3: Metas Secundarias Grupo A: Maestria, Descubrimiento, Eficiencia. Slider de incentivo.',
        'Slide 4: Metas Secundarias Grupo B: Relacionamiento, Empoderamiento, Hedonismo. Slider de incentivo.',
        'Slide 5: Micro-juego de clasificacion. 6 metas, 3 casillas: Narrativa / Principal / Secundaria.',
    ])

    d.stitle('4. Entrenamiento Asincrono: Trivia (21 preguntas)')
    d.body(
        '21 preguntas de opcion multiple (4 opciones), en 3 bloques tematicos de 7. '
        'Cada pregunta presenta una meta de aprendizaje real y pide al estudiante clasificarla.'
    )
    d.bullets([
        'Bloque A (7): Variables de Expectativa. Que variable afecta principalmente esta meta?',
        'Bloque B (7): Tipos de Meta. Es Narrativa, Principal de Aproximacion, de Evasion o Secundaria?',
        'Bloque C (7): Matriz Quiero/Tengo. En cual de los 4 cuadrantes va este escenario?',
        'Recompensa: Hasta 50 BEM Coins (5 por estrella de calibracion, segun puntaje neto).',
    ])

    d.stitle('5. Modulo de Diseno: Disenador de Metas')
    d.body(
        'Canvas de dos columnas. El estudiante redacta una meta libre (~280 caracteres) '
        'y la analiza en 7 sliders de expectativa y 2 dropdowns de clasificacion. '
        'Puede crear multiples metas. Todas se guardan en su bitacora con analisis completo.'
    )
    d.sub('Dropdowns de clasificacion:')
    d.bullets([
        'Tipo de Meta: Narrativa / Principal Aproximacion / Principal Evasion / Secundaria.',
        'Cuadrante Matriz: Quiero y Tengo / No Quiero y Tengo / Quiero y No Tengo / No Quiero y No Tengo.',
    ])
    d.sub('Bitacora:')
    d.body(
        'Tarjeta expandible con tags de clasificacion, texto de la meta y (al expandir) '
        '7 barras de progreso + texto diagnostico automatico segun umbrales de los sliders. '
        'Recompensa: 15 BEM Coins al guardar 3 o mas metas con todos los campos completos.'
    )

    out = os.path.join(OUTPUT_DIR, 'diseno_mundo4_detras_de_camaras.pdf')
    d.output(out)
    print(f'[OK] PDF 1: {out}')


# ─────────────────────────────────────────────────────────────
# PDF 2
# ─────────────────────────────────────────────────────────────
def pdf_theory():
    d = Doc('Resumen Teorico Mundo 4', 'Mundo 4 | Resumen Teorico: Arquitectura de Metas y Expectativas')
    d.add_page()
    d.main_title('Resumen Teorico: Mundo 4',
                 'Arquitectura de Metas y Expectativas',
                 'Conceptos clave vistos en clase | Framework BEM')

    d.stitle('1. Variables de Expectativa: Los 7 Ejes de Evaluacion de una Meta')
    d.body(
        'Antes de activarse ante una meta, el estudiante realiza una evaluacion subjetiva '
        'que determina si vale la pena el esfuerzo. Esta evaluacion ocurre a traves de '
        '7 variables de expectativa:'
    )
    d.bullets([
        'DESEABILIDAD: Que tan atractiva es la meta. Una meta muy deseable activa el compromiso inicial incluso antes de evaluar si es posible.',
        'PROGRESO VISIBLE: Que tan claramente se ve el avance. Sin hitos ni retroalimentacion, la persistencia disminuye aunque la meta sea alcanzable.',
        'PROBABILIDAD DE LOGRO: La percepcion subjetiva de poder tener exito. Penalizaciones muy altas por fallar inhiben la activacion.',
        'PLAZO / TERMINO: Que tan cercano en el tiempo se percibe el logro. Los ciclos cortos activan mas que las metas de largo plazo.',
        'CONSISTENCIA DE MEDICION: Que tan objetivos y transparentes son los criterios. La subjetividad percibida reduce la motivacion.',
        'AGENCIA VS INCERTIDUMBRE: El nivel de control sentido sobre el resultado. Mayor autonomia y menor azar = mayor motivacion.',
        'ESFUERZO REQUERIDO: La carga cognitiva y temporal percibida. Metas desproporcionadas en esfuerzo inhiben la activacion.',
    ])
    d.note(
        'Principio de diseno: Una meta bien disenada no maximiza todas las variables a la vez. '
        'Las identifica, las calibra estrategicamente y las comunica con claridad al estudiante.'
    )

    d.stitle('2. Tipos de Metas en el Framework BEM')

    d.sub('A) Metas Narrativas')
    d.body(
        'Una Meta Narrativa no define una accion concreta ni un criterio de logro. '
        'Su funcion es establecer un rol, una ficcion o un contexto epico que da significado '
        'e identidad a las actividades que vienen despues. No es medible por si sola: es el marco de sentido.\n\n'
        'Meta Narrativa ALINEADA: El rol o ficcion usa la actividad real de aprendizaje como fuente del drama. '
        'Ejemplo: "Somos editores literarios compitiendo por publicar la mejor antologia de cuento colombiano."\n\n'
        'Meta Narrativa DESALINEADA: La ficcion es decorativa y ajena a la actividad real. '
        'Ejemplo: "Pilotamos un cohete a Saturno resolviendo ecuaciones de algebra." '
        'Esto genera incoherencia motivacional a mediano plazo.'
    )

    d.sub('B) Metas Principales (Obligatorias)')
    d.body('Son las metas que todos los estudiantes deben alcanzar. Se dividen en dos subtipos:')
    d.bullets([
        'APROXIMACION: El estudiante busca alcanzar un estado positivo. Tiene criterio de logro claro y plazo definido. Ejemplo: "Aprobar con minimo 7/10 el quiz de comprension lectora antes del miercoles."',
        'EVASION: El estudiante busca evitar o eliminar un estado negativo. El motor es la prevencion de consecuencias adversas. Ejemplo: "No acumular mas de 2 inasistencias para mantener el derecho a parciales."',
    ])
    d.body(
        'Las metas de evasion son poderosas, pero si la consecuencia se percibe como injusta '
        'o desproporcionada, generan rechazo al sistema en lugar de motivacion hacia el aprendizaje.'
    )

    d.sub('C) Metas Secundarias (Voluntarias)')
    d.body(
        'Las metas secundarias son opcionales y apelan a un driver BEM especifico. '
        'Su poder radica en que activan la motivacion intrinseca sin coercion. '
        'Tres propositos clave:'
    )
    d.bullets([
        'Personalizar la experiencia para diferentes perfiles de estudiantes.',
        'Generar datos limpios sobre preferencias motivacionales (quien las elige revela su driver genuino).',
        'Crear estados de flujo que la meta principal sola no puede sostener.',
    ])
    d.body(
        'Ley del incentivo: Mayor incentivo = mayor probabilidad de activacion = menor esfuerzo interno. '
        'Menor incentivo = menor probabilidad de activacion = mayor esfuerzo intrinseco requerido.'
    )

    d.stitle('3. La Matriz Quiero / Tengo: Cuatro Arquitecturas de Motivacion')
    d.body(
        'Toda meta se puede definir segun la relacion del estudiante con un estado deseado o no deseado. '
        'Este marco de 2x2 organiza las metas en cuatro cuadrantes:'
    )
    d.bullets([
        'QUIERO Y TENGO (Mantenimiento): El estudiante posee algo valioso y la meta es conservarlo. Activa el miedo a la perdida. Ejemplo: Mantener multiplicador x2 de puntos participando semanalmente.',
        'NO QUIERO Y TENGO (Eliminacion): El estudiante tiene algo indeseable y busca librarse de ello. Activa el alivio como recompensa. Ejemplo: Entregar resumenes para borrar una penalizacion de laboratorio.',
        'QUIERO Y NO TENGO (Adquisicion): El estudiante no tiene un beneficio deseado y trabaja para obtenerlo. Activa la esperanza. Ejemplo: Completar 5 retos para obtener el pase de apuntes en el parcial.',
        'NO QUIERO Y NO TENGO (Prevencion): El estudiante no tiene un problema y quiere asegurar que no aparezca. Activa la prudencia. Ejemplo: Mantener promedio > 3.0 para evitar tutoria obligatoria los sabados.',
    ])
    d.note(
        'Los cuadrantes de Mantenimiento y Prevencion (loss-framing) suelen activar mas '
        'estudiantes a corto plazo. Los de Adquisicion generan mayor identificacion positiva '
        'con el sistema a largo plazo.'
    )

    d.stitle('4. Metas Secundarias por Driver BEM')
    d.body('Cada driver BEM define un tipo diferente de meta secundaria:')
    d.bullets([
        'MAESTRIA: Metas de desempeno, reto de dificultad escalonada, perfeccionamiento tecnico.',
        'DESCUBRIMIENTO: Metas de exploracion, curiosidad, investigacion libre.',
        'EFICIENCIA: Metas de optimizacion, entrega anticipada, organizacion del equipo.',
        'RELACIONAMIENTO: Metas de colaboracion, co-creacion, apoyo mutuo entre pares.',
        'EMPODERAMIENTO: Metas de competencia, dominio social, autonomia de criterio.',
        'HEDONISMO: Metas de diseno estetico, experiencia sensorial, goce del proceso.',
    ])
    d.note(
        'Al disenar el menu de metas secundarias de una actividad, lo ideal es ofrecer '
        'al menos una meta por cada driver para que el estudiante encuentre algo que resuene '
        'con su perfil motivacional genuino.'
    )

    out = os.path.join(OUTPUT_DIR, 'resumen_teorico_mundo4.pdf')
    d.output(out)
    print(f'[OK] PDF 2: {out}')


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    pdf_behind_scenes()
    pdf_theory()
    print('Listo.')
