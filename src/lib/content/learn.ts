export type LearnLang = 'en' | 'es';

export const learnTranslations = {
	en: {
		login: {
			pageTitle: 'OMIE Initiation | Agent Registration',
			invalidTitle: 'Initiation Interrupted',
			invalidDesc: 'The course code does not correspond to any active class. Check with your mentor.',
			contactMentor: 'If you are an official OMIE trainee, contact your mentor to obtain a valid invitation link or active class code.',
			goHome: '⬅ Back to Home',
			agencyTag: 'OMIE CENTRAL • ACADEMY',
			agentRegistration: 'Agent Registration',
			codeDetected: 'Bip-bop! Class code successfully detected.',
			giochiSpeechTitle: '🤖 GIOCHI says:',
			giochiGreeting: 'Greetings, Agent in training! I am ready to accompany you. To start your missions and configure your 7-Driver RPG sheet, create your system profile.',
			emailLabel: 'Official Email Address',
			emailTip: 'We will use your email to save your course progress uniquely.',
			emailPlaceholder: 'e.g. yourname@university.edu',
			nameLabel: 'First and Last Name',
			namePlaceholder: 'e.g. Sara Gomez',
			aliasLabel: 'Agent Alias (RPG Nickname)',
			aliasPlaceholder: 'e.g. BioHacker, SolarKnight',
			aliasTip: 'This will be your alias in the leaderboard and course central roster.',
			submitting: '🔑 Linking Device...',
			submit: '🚀 Start Course Initiation',
			requiredFields: 'All fields are required.'
		},
		dashboard: {
			pageTitle: 'OMIE Gamification Missions',
			activeClass: 'Active Class:',
			roleBadge: 'AGENT IN TRAINING',
			coins: 'Coins',
			journalBtn: 'Journal',
			misionesTitle: 'BEM Gamification Missions',
			misionesDesc: 'Complete the missions in order. Interact in real-time with your classmates in synchronous Workshops.',
			backToMap: 'Back to Map',
			emptyMode: 'in development.',
			floatingJournalTip: 'Open your travel journal'
		},
		feedback: {
			title: 'Workshop Completed! Feedback',
			subtitle: 'Help us improve the OMIE Academy experience by evaluating this workshop.',
			metrics: {
				engagement: {
					label: 'Engagement & Fun',
					desc: 'Did you find it engaging and exciting?'
				},
				difficulty: {
					label: 'Difficulty Level',
					desc: 'Was it too easy or too challenging?'
				},
				pace: {
					label: 'Pacing & Flow',
					desc: 'How was the speed and rhythm of the slides?'
				},
				relevance: {
					label: 'Content Relevance',
					desc: 'Did the content add real pedagogical value?'
				}
			},
			testimonyLabel: 'Share your experience (Optional)',
			testimonyPlaceholder: 'What did you like most? What can we do better?',
			allowPublicLabel: 'Allow my comments to be shared publicly in the gallery.',
			submitting: 'Saving feedback...',
			submitBtn: 'Submit Feedback'
		}
	},
	es: {
		login: {
			pageTitle: 'Iniciación OMIE | Registro de Agente',
			invalidTitle: 'Iniciación Interrumpida',
			invalidDesc: 'El código de curso no corresponde a ninguna clase activa. Verifica con tu mentor.',
			contactMentor: 'Si eres estudiante oficial de la OMIE, contacta a tu mentor para obtener un enlace de invitación válido o un código de clase activo.',
			goHome: '⬅ Volver a Inicio',
			agencyTag: 'OMIE CENTRAL • ACADEMIA',
			agentRegistration: 'Registro de Agente',
			codeDetected: '¡Bip-bop! Código de clase detectado con éxito.',
			giochiSpeechTitle: '🤖 GIOCHI dice:',
			giochiGreeting: '¡Saludos, Agente en entrenamiento! Estoy listo para acompañarte. Para iniciar tus misiones y configurar tu ficha RPG de 7 Drivers, crea tu perfil del sistema.',
			emailLabel: 'Correo Electrónico Oficial',
			emailTip: 'Usaremos tu correo para guardar tu progreso del curso de forma única.',
			emailPlaceholder: 'ej: tuemail@universidad.edu',
			nameLabel: 'Nombre y Apellido',
			namePlaceholder: 'ej: Sara Gómez',
			aliasLabel: 'Alias de Agente (Nickname RPG)',
			aliasPlaceholder: 'ej: BioHacker, SolarKnight',
			aliasTip: 'Este será tu alias en la tabla de clasificación y Roster central del curso.',
			submitting: '🔑 Vinculando Dispositivo...',
			submit: '🚀 Iniciar Iniciación del Curso',
			requiredFields: 'Todos los campos son obligatorios.'
		},
		dashboard: {
			pageTitle: 'Misiones de Gamificación BEM',
			activeClass: 'Clase Activa:',
			roleBadge: 'AGENTE EN ENTRENAMIENTO',
			coins: 'Coins',
			journalBtn: 'Bitácora',
			misionesTitle: 'Misiones de Gamificación BEM',
			misionesDesc: 'Completa las misiones en orden. Interactúa en real-time con tus compañeros de clase en Workshops síncronos.',
			backToMap: 'Volver a Mapa',
			emptyMode: 'en desarrollo.',
			floatingJournalTip: 'Abrir tu bitácora de viaje'
		},
		feedback: {
			title: '¡Workshop Completado! Evaluación',
			subtitle: 'Ayúdanos a mejorar la academia OMIE evaluando este workshop.',
			metrics: {
				engagement: {
					label: 'Compromiso y Diversión',
					desc: '¿Qué tan entretenido y emocionante te pareció?'
				},
				difficulty: {
					label: 'Nivel de Dificultad',
					desc: '¿Fue muy sencillo o requirió mucho esfuerzo?'
				},
				pace: {
					label: 'Ritmo y Fluidez',
					desc: '¿Cómo sentiste la velocidad de paso de las diapositivas?'
				},
				relevance: {
					label: 'Relevancia del Contenido',
					desc: '¿El contenido te aportó un valor real pedagógico?'
				}
			},
			testimonyLabel: 'Comparte tu testimonio (Opcional)',
			testimonyPlaceholder: '¿Qué fue lo que más te gustó? ¿Qué podemos mejorar?',
			allowPublicLabel: 'Permitir que mis comentarios sean compartidos en la galería pública.',
			submitting: 'Guardando retroalimentación...',
			submitBtn: 'Enviar Retroalimentación'
		}
	}
};
