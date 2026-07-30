export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Course {
  id: string;
  materia: string;
  anio: string; // e.g. "2°"
  division: string; // e.g. "A"
  anioLectivo: string; // e.g. "2026"
  alumnosCount?: number;
  examenesCount?: number;
}

export interface Student {
  id: string;
  courseId: string;
  nombre: string;
  legajo: string;
}

export interface Question {
  id: string;
  numero: number;
  consigna: string;
  respuestaEsperada: string;
  puntajeMaximo: number;
}

export interface Exam {
  id: string;
  courseId: string;
  titulo: string;
  fecha: string;
  preguntasCount: number;
  puntajeTotal: number;
  entregasCount: number;
  preguntas: Question[];
  criteriosIA?: string;
}

export interface EvaluatedQuestion {
  questionId: string;
  questionNumero: number;
  consigna: string;
  respuestaEsperada: string;
  textoDetectado: string;
  comentarioIA: string;
  puntajeIA: number;
  puntajeDocente: number;
  puntajeMaximo: number;
  requiereRevisionManual?: boolean;
  motivoRevision?: string;
}

export interface Delivery {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  fechaEntrega: string;
  estado: 'Publicada' | 'Pendiente' | 'Revisión';
  archivos: string[]; // Image URLs or filenames
  respuestasEvaluadas: EvaluatedQuestion[];
  notaIA: number;
  notaDocente: number;
  tokensConsumidos: number;
  modeloUtilizado: string;
  requiereRevisionManual?: boolean;
  motivoRevision?: string;
}
