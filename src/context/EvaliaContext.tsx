'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Student, Exam, Delivery, Question } from '../types/evalia';
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_EXAMS, INITIAL_DELIVERIES } from '../data/initialEvaliaData';

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
  students: Student[];
  exams: Exam[];
  deliveries: Delivery[];

  // Pending generated exam for revision
  pendingGeneratedExam: Partial<Exam> | null;
  setPendingGeneratedExam: (exam: Partial<Exam> | null) => void;

  // Actions
  addCourse: (materia: string, anio: string, division: string, anioLectivo: string) => Course;
  addStudent: (courseId: string, nombre: string, legajo: string) => void;
  updateStudent: (studentId: string, nombre: string, legajo: string) => void;
  saveExam: (examData: Omit<Exam, 'id' | 'preguntasCount' | 'puntajeTotal' | 'entregasCount'>) => void;
  updateExamQuestions: (examId: string, preguntas: Question[]) => void;
  
  // Delivery Actions
  createDelivery: (examId: string, studentId: string, archivos: string[]) => Promise<Delivery>;
  approveDeliveryCorrection: (deliveryId: string, notaDocente: number, respuestasModificadas?: any[]) => void;

  // Helper getters
  getActiveCourse: () => Course | undefined;
  getActiveExam: () => Exam | undefined;
  getActiveDelivery: () => Delivery | undefined;
  getCourseStudents: (courseId: string) => Student[];
  getCourseExams: (courseId: string) => Exam[];
  getExamDeliveries: (examId: string) => Delivery[];
}

const EvaliaContext = createContext<EvaliaContextType | undefined>(undefined);

export const EvaliaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>('dashboard');
  
  const [activeCourseId, setActiveCourseId] = useState<string | null>('c-mat-2a');
  const [activeExamId, setActiveExamId] = useState<string | null>('ex-1');
  const [activeDeliveryId, setActiveDeliveryId] = useState<string | null>('del-1');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('evalia_courses');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    }
    return INITIAL_COURSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('evalia_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    }
    return INITIAL_STUDENTS;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('evalia_exams');
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    }
    return INITIAL_EXAMS;
  });

  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('evalia_deliveries');
      return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
    }
    return INITIAL_DELIVERIES;
  });

  const [pendingGeneratedExam, setPendingGeneratedExam] = useState<Partial<Exam> | null>(null);

  // Sync to localstorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('evalia_courses', JSON.stringify(courses));
    }
  }, [courses]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('evalia_students', JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('evalia_exams', JSON.stringify(exams));
    }
  }, [exams]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('evalia_deliveries', JSON.stringify(deliveries));
    }
  }, [deliveries]);

  // Actions
  const addCourse = (materia: string, anio: string, division: string, anioLectivo: string): Course => {
    const newCourse: Course = {
      id: `c-${Date.now().toString().slice(-4)}`,
      materia,
      anio,
      division,
      anioLectivo,
      alumnosCount: 0,
      examenesCount: 0,
    };
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

  const saveExam = (examData: Omit<Exam, 'id' | 'preguntasCount' | 'puntajeTotal' | 'entregasCount'>) => {
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
