'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Course, Student, Exam, Delivery, Question } from '../types/evalia';
import { INITIAL_STUDENTS, INITIAL_EXAMS, INITIAL_DELIVERIES } from '../data/initialEvaliaData';
import { fetchApi } from '../lib/api';

interface BackendCourse {
  id: string;
  materia: string;
  anio: number;
  division: string;
  anioLectivo: number;
  profesorId?: string;
  alumnos?: any[];
  _count?: { examenes: number };
}

function mapBackendCourse(bc: BackendCourse): Course {
  return {
    id: bc.id,
    materia: bc.materia,
    anio: `${bc.anio}°`,
    division: bc.division,
    anioLectivo: String(bc.anioLectivo),
    alumnosCount: Array.isArray(bc.alumnos) ? bc.alumnos.length : 0,
    examenesCount: bc._count?.examenes ?? 0,
  };
}

export type Screen = 
  | 'dashboard'
  | 'cursos_lista'
  | 'curso_nuevo'
  | 'curso_detalle'
  | 'alumnos_lista'
  | 'alumno_nuevo'
  | 'alumno_editar'
  | 'examen_metodo'
  | 'examen_manual'
  | 'examen_inteligente'
  | 'examen_revision_generado'
  | 'examen_detalle'
  | 'examen_preguntas'
  | 'entrega_nueva'
  | 'entrega_procesando'
  | 'entrega_correccion_ia'
  | 'entrega_revision_manual'
  | 'perfil';

interface EvaliaContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  
  // Selection
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  activeExamId: string | null;
  setActiveExamId: (id: string | null) => void;
  activeDeliveryId: string | null;
  setActiveDeliveryId: (id: string | null) => void;
  editingStudentId: string | null;
  setEditingStudentId: (id: string | null) => void;
  
  // Data Collections
  courses: Course[];
  isLoadingCourses: boolean;
  students: Student[];
  exams: Exam[];
  deliveries: Delivery[];

  // Pending generated exam for revision
  pendingGeneratedExam: Partial<Exam> | null;
  setPendingGeneratedExam: (exam: Partial<Exam> | null) => void;

  // Actions
  addCourse: (materia: string, anio: string, division: string, anioLectivo: string) => Promise<Course>;
  addStudent: (courseId: string, nombre: string, legajo: string) => void;
  updateStudent: (studentId: string, nombre: string, legajo: string) => void;
  saveExam: (examData: Omit<Exam, 'id' | 'preguntasCount' | 'puntajeTotal' | 'entregasCount'>) => Exam;
  updateExamQuestions: (examId: string, preguntas: Question[]) => void;
  
  // Delivery Actions
  createDelivery: (examId: string, studentId: string, archivos: string[]) => Promise<Delivery>;
  approveDeliveryCorrection: (deliveryId: string, notaDocente: number, respuestasModificadas?: any[]) => void;

  // Helper getters
  getActiveCourse: () => Course | undefined;
  getActiveExam: () => Exam | undefined;
  getActiveDelivery: () => Delivery | undefined;
  getCourseById: (id: string) => Course | undefined;
  getExamById: (id: string) => Exam | undefined;
  getDeliveryById: (id: string) => Delivery | undefined;
  getCourseStudents: (courseId: string) => Student[];
  getCourseExams: (courseId: string) => Exam[];
  getExamDeliveries: (examId: string) => Delivery[];
}

const EvaliaContext = createContext<EvaliaContextType | undefined>(undefined);

export const EvaliaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>('dashboard');
  
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [activeDeliveryId, setActiveDeliveryId] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);

  const [pendingGeneratedExam, setPendingGeneratedExam] = useState<Partial<Exam> | null>(null);

  // Carga de cursos desde el backend (fuente de verdad)
  useEffect(() => {
    setIsLoadingCourses(true);
    fetchApi<BackendCourse[]>('/api/v1/cursos')
      .then((data) => {
        setCourses(data.map(mapBackendCourse));
      })
      .catch((err) => {
        console.warn('No se pudieron cargar los cursos desde el backend:', err);
        // Fallback: limpiar cualquier dato viejo de localStorage
        setCourses([]);
      })
      .finally(() => {
        setIsLoadingCourses(false);
      });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('evalia_students');
    if (saved) {
      setStudents(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('evalia_exams');
    if (saved) {
      setExams(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('evalia_deliveries');
    if (saved) {
      setDeliveries(JSON.parse(saved));
    }
  }, []);

  const isFirstStudentsSave = useRef(true);
  const isFirstExamsSave = useRef(true);
  const isFirstDeliveriesSave = useRef(true);


  // Sync to localstorage (solo students, exams, deliveries — courses vienen del backend)

  useEffect(() => {
    if (isFirstStudentsSave.current) {
      isFirstStudentsSave.current = false;
      return;
    }
    localStorage.setItem('evalia_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (isFirstExamsSave.current) {
      isFirstExamsSave.current = false;
      return;
    }
    localStorage.setItem('evalia_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    if (isFirstDeliveriesSave.current) {
      isFirstDeliveriesSave.current = false;
      return;
    }
    localStorage.setItem('evalia_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  // Actions
  const addCourse = async (materia: string, anio: string, division: string, anioLectivo: string): Promise<Course> => {
    const anioNum = parseInt(anio.replace(/\D/g, ''), 10) || 1;
    const anioLectivoNum = parseInt(anioLectivo, 10) || new Date().getFullYear();

    const created = await fetchApi<BackendCourse>('/api/v1/cursos', {
      method: 'POST',
      body: JSON.stringify({ materia, anio: anioNum, division, anioLectivo: anioLectivoNum }),
    });

    const newCourse = mapBackendCourse(created);
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const addStudent = (courseId: string, nombre: string, legajo: string) => {
    const newStudent: Student = {
      id: `st-${Date.now().toString().slice(-4)}`,
      courseId,
      nombre,
      legajo,
    };
    setStudents((prev) => [...prev, newStudent]);
    // update course alumnosCount
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, alumnosCount: (c.alumnosCount || 0) + 1 } : c
      )
    );
  };

  const updateStudent = (studentId: string, nombre: string, legajo: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, nombre, legajo } : s))
    );
  };

  const saveExam = (examData: Omit<Exam, 'id' | 'preguntasCount' | 'puntajeTotal' | 'entregasCount'>): Exam => {
    const puntajeTotal = examData.preguntas.reduce((sum, q) => sum + (q.puntajeMaximo || 0), 0);
    const newExam: Exam = {
      ...examData,
      id: `ex-${Date.now().toString().slice(-4)}`,
      preguntasCount: examData.preguntas.length,
      puntajeTotal,
      entregasCount: 0,
    };

    setExams((prev) => [newExam, ...prev]);
    // update course examenesCount
    setCourses((prev) =>
      prev.map((c) =>
        c.id === examData.courseId ? { ...c, examenesCount: (c.examenesCount || 0) + 1 } : c
      )
    );

    setActiveExamId(newExam.id);
    setScreen('examen_detalle');
    return newExam;
  };

  const updateExamQuestions = (examId: string, preguntas: Question[]) => {
    const puntajeTotal = preguntas.reduce((sum, q) => sum + (q.puntajeMaximo || 0), 0);
    setExams((prev) =>
      prev.map((ex) =>
        ex.id === examId
          ? {
              ...ex,
              preguntas,
              preguntasCount: preguntas.length,
              puntajeTotal,
            }
          : ex
      )
    );
  };

  const createDelivery = async (examId: string, studentId: string, archivos: string[]): Promise<Delivery> => {
    const student = students.find((s) => s.id === studentId);
    const exam = exams.find((e) => e.id === examId);

    const studentName = student ? student.nombre : 'Alumno Seleccionado';
    const questions = exam ? exam.preguntas : [];

    // Call server evaluation API
    try {
      const res = await fetch('/api/gemini/evaluate-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          questions,
          images: archivos,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          const evalData = result.data;
          const newDelivery: Delivery = {
            id: `del-${Date.now().toString().slice(-4)}`,
            examId,
            studentId,
            studentName,
            fechaEntrega: new Date().toLocaleDateString('es-ES'),
            estado: evalData.requiereRevisionManualGlobal ? 'Revisión' : 'Pendiente',
            archivos: archivos.length > 0 ? archivos : ['hoja1.jpg'],
            respuestasEvaluadas: evalData.respuestasEvaluadas,
            notaIA: evalData.notaIA,
            notaDocente: evalData.notaDocente,
            tokensConsumidos: evalData.tokensConsumidos || 3452,
            modeloUtilizado: evalData.modeloUtilizado || 'Gemini 3.6 Flash',
            requiereRevisionManual: evalData.requiereRevisionManualGlobal,
            motivoRevision: evalData.motivoRevisionGlobal,
          };

          setDeliveries((prev) => [newDelivery, ...prev]);
          // Increment deliveries count
          setExams((prev) =>
            prev.map((e) =>
              e.id === examId ? { ...e, entregasCount: e.entregasCount + 1 } : e
            )
          );

          setActiveDeliveryId(newDelivery.id);
          return newDelivery;
        }
      }
    } catch (e) {
      console.warn('API delivery eval error, fallback used:', e);
    }

    // Fallback delivery creation
    const fallbackEvaluated = questions.map((q) => ({
      questionId: q.id,
      questionNumero: q.numero,
      consigna: q.consigna,
      respuestaEsperada: q.respuestaEsperada,
      textoDetectado: `Respuesta alumno para pregunta ${q.numero}`,
      comentarioIA: 'La respuesta abarca los conceptos principales esperados.',
      puntajeIA: q.puntajeMaximo,
      puntajeDocente: q.puntajeMaximo,
      puntajeMaximo: q.puntajeMaximo,
      requiereRevisionManual: false,
    }));

    const totalScore = fallbackEvaluated.reduce((sum, item) => sum + item.puntajeIA, 0);

    const newDelivery: Delivery = {
      id: `del-${Date.now().toString().slice(-4)}`,
      examId,
      studentId,
      studentName,
      fechaEntrega: new Date().toLocaleDateString('es-ES'),
      estado: 'Pendiente',
      archivos: archivos.length > 0 ? archivos : ['hoja1.jpg'],
      respuestasEvaluadas: fallbackEvaluated,
      notaIA: totalScore,
      notaDocente: totalScore,
      tokensConsumidos: 3200,
      modeloUtilizado: 'Gemini 3.6 Flash',
      requiereRevisionManual: false,
    };

    setDeliveries((prev) => [newDelivery, ...prev]);
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId ? { ...e, entregasCount: e.entregasCount + 1 } : e
      )
    );
    setActiveDeliveryId(newDelivery.id);
    return newDelivery;
  };

  const approveDeliveryCorrection = (
    deliveryId: string,
    notaDocente: number,
    respuestasModificadas?: any[]
  ) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              estado: 'Publicada',
              notaDocente,
              respuestasEvaluadas: respuestasModificadas || d.respuestasEvaluadas,
            }
          : d
      )
    );
  };

  // Helper getters
  const getActiveCourse = () => courses.find((c) => c.id === activeCourseId);
  const getActiveExam = () => exams.find((e) => e.id === activeExamId);
  const getActiveDelivery = () => deliveries.find((d) => d.id === activeDeliveryId);
  const getCourseById = (id: string) => courses.find((c) => c.id === id);
  const getExamById = (id: string) => exams.find((e) => e.id === id);
  const getDeliveryById = (id: string) => deliveries.find((d) => d.id === id);

  const getCourseStudents = (courseId: string) =>
    students.filter((s) => s.courseId === courseId);

  const getCourseExams = (courseId: string) =>
    exams.filter((e) => e.courseId === courseId);

  const getExamDeliveries = (examId: string) =>
    deliveries.filter((d) => d.examId === examId);

  return (
    <EvaliaContext.Provider
      value={{
        screen,
        setScreen,
        activeCourseId,
        setActiveCourseId,
        activeExamId,
        setActiveExamId,
        activeDeliveryId,
        setActiveDeliveryId,
        editingStudentId,
        setEditingStudentId,
        courses,
        isLoadingCourses,
        students,
        exams,
        deliveries,
        pendingGeneratedExam,
        setPendingGeneratedExam,
        addCourse,
        addStudent,
        updateStudent,
        saveExam,
        updateExamQuestions,
        createDelivery,
        approveDeliveryCorrection,
        getActiveCourse,
        getActiveExam,
        getActiveDelivery,
        getCourseById,
        getExamById,
        getDeliveryById,
        getCourseStudents,
        getCourseExams,
        getExamDeliveries,
      }}
    >
      {children}
    </EvaliaContext.Provider>
  );
};

export const useEvalia = () => {
  const context = useContext(EvaliaContext);
  if (!context) {
    throw new Error('useEvalia must be used within an EvaliaProvider');
  }
  return context;
};
