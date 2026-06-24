import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        # Header banner
        self.set_fill_color(30, 69, 51) # Deep Forest Green
        self.rect(0, 0, 210, 40, 'F')
        
        # Header title
        self.set_text_color(255, 255, 255)
        self.set_font('Helvetica', 'B', 14)
        self.cell(0, 10, 'ORGANIZACION MUNDIAL DE LA INNOVACION EDUCATIVA (OMIE)', 0, 1, 'C')
        
        self.set_font('Helvetica', 'I', 10)
        self.cell(0, 5, 'Guia de Diseno Motivacional: Ciclo GFR, Metas BEM y Teoria RII', 0, 1, 'C')
        self.ln(15)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Pagina {self.page_no()}', 0, 0, 'C')

def create_guide():
    pdf = PDF()
    pdf.set_left_margin(15)
    pdf.set_right_margin(15)
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.ln(10)
    
    # Body text colors and fonts
    pdf.set_text_color(20, 35, 25)
    
    # Title
    pdf.set_font('Helvetica', 'B', 15)
    pdf.cell(0, 10, 'FUNDAMENTOS TEORICOS DEL DISENO MOTIVACIONAL EN EL MUNDO 2', 0, 1, 'C')
    pdf.ln(5)

    # Section 1
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, '1. El Ciclo GFR: Meta, Retroalimentacion y Recompensa', 0, 1, 'L')
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5.5, (
        "El ciclo GFR (Goal, Feedback, Reward) describe la secuencia neurologica y de comportamiento "
        "que experimenta un estudiante durante cualquier proceso de aprendizaje guiado:\n\n"
        "- GOAL (Meta / El 'Que'): Es la representacion cognitiva del estado futuro que el estudiante "
        "desea alcanzar, mantener, evitar o eliminar. Funciona como el iman atencional que moviliza "
        "el esfuerzo inicial del alumno.\n"
        "  Ejemplo: El deseo de aprobar el examen final de calculo para poder cursar fisica avanzada.\n\n"
        "- FEEDBACK (Retroalimentacion / El 'Como voy'): Consiste en el flujo de informacion pura, objetiva "
        "y sensorial que el sistema o el entorno devuelve al estudiante tras una accion. Es el retorno "
        "de datos sin sesgo emocional, percibido por la vista, el oido o la propiocepcion.\n"
        "  Ejemplo: La consola de programacion indicando un error de sintaxis en la linea 12 junto con el tiempo empleado.\n\n"
        "- REWARD (Recompensa/Castigo / El 'Que siento'): Es la reaccion neurologica y emocional gatillada "
        "al percibir y procesar el feedback en relacion con la meta (dopamina, alivio, orgullo). Consolida "
        "el ciclo motivacional y determina la disposicion a repetir la conducta.\n"
        "  Ejemplo: La oleada de orgullo y percepcion de autoeficacia intelectual al resolver correctamente un problema complejo."
    ))
    pdf.ln(6)
    
    # Section 2
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, '2. Los 4 Tipos de Metas (Cuadrantes Motivacionales BEM)', 0, 1, 'L')
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5.5, (
        "El marco teorico de BEM propone que las metas van mas alla de la obtencion simple de recompensas. "
        "Se estructuran en cuatro cuadrantes segun lo que el alumno tiene y lo que desea:\n\n"
        "1. Quiero y No Tengo (Obtencion): Metas dirigidas a conseguir un beneficio o logro futuro.\n"
        "   Ejemplo: Ganar la insignia digital de Investigador Destacado al escribir una monografia excelente.\n\n"
        "2. No Quiero y Tengo (Eliminacion): Metas orientadas a deshacerse de un estado adverso actual.\n"
        "   Ejemplo: Realizar una actividad compensatoria para remover una inasistencia registrada en la bitacora.\n\n"
        "3. Quiero y Tengo (Mantenimiento): Metas destinadas a conservar un derecho o beneficio que ya se posee.\n"
        "   Ejemplo: Mantener el derecho de acceso exclusivo al laboratorio avanzado conservando buenas calificaciones.\n\n"
        "4. No Quiero y No Tengo (Evitacion): Metas preventivas para asegurar que un perjuicio no ocurra en el futuro.\n"
        "   Ejemplo: Asistir a las tutorias obligatorias de algebra para evitar perder la racha de logros por excelencia."
    ))
    pdf.ln(6)

    # Section 3
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, '3. Niveles de Regulacion Motivacional y Teoria RII', 0, 1, 'L')
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5.5, (
        "Cruzando el ciclo GFR con la Teoria de la Autodeterminacion, evaluamos la alineacion de los "
        "incentivos con respecto al nucleo de la actividad de aprendizaje:\n\n"
        "- REGULATORIO: El incentivo y la meta estan completamente desalineados de la actividad de aprendizaje. "
        "Funciona como una condicion artificial ajena al tema que promueve atajos y disminuye el interes a largo plazo.\n"
        "  Ejemplo: Dar cupones de descuento de tiendas de ropa a cambio de completar las lecturas semanales de historia.\n\n"
        "- INTEGRADO: El incentivo es externo, pero esta alineado de manera coherente con los valores y metas "
        "profesionales del estudiante. Fomenta la utilidad instrumental consciente y la identidad academica.\n"
        "  Ejemplo: Desbloquear el acceso a simulaciones avanzadas tras dominar las formulas basicas de fisica.\n\n"
        "- INTRINSECO: La actividad se realiza por el puro placer y la curiosidad inherentes al proceso. La "
        "retroalimentacion proviene del propio organismo o del placer cognitivo/estetico de la actividad.\n"
        "  Ejemplo: Sientes como tus musculos diafragmaticos se regulan al tocar flauta traversa por el gozo del sonido."
    ))
    pdf.ln(6)
    
    # Section 4
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, '4. Diseno con Doble Condicion para Recompensas', 0, 1, 'L')
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5.5, (
        "Una recompensa bien disenada requiere conectar explicitamente una Accion de Aprendizaje (Trigger) "
        "y una Meta/Feedback, detonando una respuesta neurologica o emocional en el estudiante:\n\n"
        "- Recompensa Regulatoria: 'Si estudio quimica (Trigger) y por eso obtengo una entrada de cine gratis (Meta), "
        "entonces siento alegria y entusiasmo por ir al estreno.' (Desalineada con la materia).\n\n"
        "- Recompensa Integrada: 'Si programo un algoritmo para automatizar un proceso escolar (Trigger) y por eso "
        "recibo la insignia de Desarrollador Competente (Meta), entonces siento satisfaccion al ver validada mi "
        "habilidad tecnica.' (Alineada con el desarrollo academico).\n\n"
        "- Recompensa Intrínseca: 'Si logro comprender el origen del universo de manera autonoma para saciar mi "
        "curiosidad (Trigger/Meta), entonces experimento una inmensa sensacion de autoeficacia intelectual.' "
        "(Nace y se consume internamente)."
    ))

    output_path = "static/learn_resources/resources/world2/gfr_theory_guide.pdf"
    pdf.output(output_path)
    print("PDF generated successfully at:", output_path)

if __name__ == "__main__":
    create_guide()
