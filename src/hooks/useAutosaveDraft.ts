'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseAutosaveDraftOptions<T> {
  key: string;              // Clave única en almacenamiento (ej: 'evalia_draft_examen_c-123')
  data: T;                  // Estado actual a autoguardar
  debounceMs?: number;      // Tiempo de espera tras último cambio (default: 800ms)
  enabled?: boolean;        // Si el autoguardado está activo
  expirationDays?: number;  // TTL del borrador (default: 7 días)
  version?: number;         // Versión para control de esquema (default: 1)
  onSave?: (savedAt: Date) => void;
}

export interface StoredDraft<T> {
  data: T;
  updatedAt: number;        // Timestamp Epoch (ms)
  version: number;          // Versión para futuras migraciones
}

export interface UseAutosaveDraftReturn<T> {
  lastSavedAt: Date | null;
  isSaving: boolean;
  hasSavedDraft: boolean;
  savedDraftData: T | null;
  savedDraftMeta: { updatedAt: Date; version: number } | null;
  getSavedDraft: () => StoredDraft<T> | null;
  clearDraft: () => void;
  saveNow: () => void;
  isOnline: boolean;
}

const DRAFT_PREFIX = 'evalia_draft_';

export function useAutosaveDraft<T>({
  key,
  data,
  debounceMs = 800,
  enabled = true,
  expirationDays = 7,
  version = 1,
  onSave,
}: UseAutosaveDraftOptions<T>): UseAutosaveDraftReturn<T> {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);
  const [savedDraftData, setSavedDraftData] = useState<T | null>(null);
  const [savedDraftMeta, setSavedDraftMeta] = useState<{ updatedAt: Date; version: number } | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedSerializedRef = useRef<string | null>(null);
  const prevKeyRef = useRef<string | null>(null);
  const hasInitializedKeyRef = useRef<boolean>(false);

  // Monitor de estado online/offline
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Limpieza de borradores expirados en el namespace de evalia_draft_
  const cleanupExpiredDrafts = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const now = Date.now();
      const maxAgeMs = expirationDays * 24 * 60 * 60 * 1000;
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey && storageKey.startsWith(DRAFT_PREFIX)) {
          try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
              const parsed: StoredDraft<any> = JSON.parse(raw);
              if (parsed.updatedAt && now - parsed.updatedAt > maxAgeMs) {
                keysToRemove.push(storageKey);
              }
            }
          } catch {
            // Ignorar errores de parseo individuales
          }
        }
      }

      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Error al limpiar borradores expirados:', e);
    }
  }, [expirationDays]);

  // Función para obtener el borrador actual directamente de localStorage
  const getSavedDraft = useCallback((): StoredDraft<T> | null => {
    if (typeof window === 'undefined' || !key) return null;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const parsed: StoredDraft<T> = JSON.parse(raw);
      if (!parsed || typeof parsed.updatedAt !== 'number') return null;

      // Verificar si ha expirado
      const now = Date.now();
      const maxAgeMs = expirationDays * 24 * 60 * 60 * 1000;
      if (now - parsed.updatedAt > maxAgeMs) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed;
    } catch (e) {
      console.warn(`Error al leer borrador para la clave ${key}:`, e);
      return null;
    }
  }, [key, expirationDays]);

  // Si cambia la key, resetear tracking
  if (prevKeyRef.current !== key) {
    prevKeyRef.current = key;
    hasInitializedKeyRef.current = false;
    lastSavedSerializedRef.current = null;
  }

  // Guardado síncrono inmediato
  const saveNow = useCallback(() => {
    if (typeof window === 'undefined' || !key || !enabled) return;

    try {
      setIsSaving(true);
      const now = Date.now();
      const payload: StoredDraft<T> = {
        data,
        updatedAt: now,
        version,
      };

      const serialized = JSON.stringify(payload);
      localStorage.setItem(key, serialized);
      lastSavedSerializedRef.current = JSON.stringify(data);

      const savedDate = new Date(now);
      setLastSavedAt(savedDate);
      if (onSave) onSave(savedDate);
    } catch (e) {
      console.error('Error al guardar borrador en localStorage:', e);
    } finally {
      setIsSaving(false);
    }
  }, [key, data, enabled, version, onSave]);

  // Inicialización y ciclo de vida de autoguardado
  useEffect(() => {
    if (typeof window === 'undefined' || !key) return;

    // Solo inicializamos cuando el hook está habilitado con datos válidos
    if (!enabled) return;

    cleanupExpiredDrafts();

    // 1. Primera vez que se habilita con esta key: establecer línea base sin sobreescribir
    if (!hasInitializedKeyRef.current) {
      hasInitializedKeyRef.current = true;
      const currentSerialized = JSON.stringify(data);

      const existingDraft = getSavedDraft();
      if (existingDraft && existingDraft.data) {
        const draftSerialized = JSON.stringify(existingDraft.data);
        // Si el borrador existente es diferente al estado actual (cargado de server), ofrecer restauración
        if (draftSerialized !== currentSerialized) {
          setHasSavedDraft(true);
          setSavedDraftData(existingDraft.data);
          setSavedDraftMeta({
            updatedAt: new Date(existingDraft.updatedAt),
            version: existingDraft.version,
          });
          setLastSavedAt(new Date(existingDraft.updatedAt));
          // Importante: No sobreescribir el borrador previo en localStorage
          lastSavedSerializedRef.current = draftSerialized;
          return;
        } else {
          // Si el borrador es idéntico al estado cargado, no hay cambios pendientes
          setHasSavedDraft(false);
          setSavedDraftData(null);
          setSavedDraftMeta(null);
          setLastSavedAt(new Date(existingDraft.updatedAt));
          lastSavedSerializedRef.current = currentSerialized;
          return;
        }
      } else {
        setHasSavedDraft(false);
        setSavedDraftData(null);
        setSavedDraftMeta(null);
        lastSavedSerializedRef.current = currentSerialized;
        return;
      }
    }

    // 2. Si ya está inicializado y el usuario realizó cambios en data
    const currentSerialized = JSON.stringify(data);

    if (currentSerialized === lastSavedSerializedRef.current) {
      return;
    }

    setIsSaving(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveNow();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [key, data, enabled, debounceMs, cleanupExpiredDrafts, getSavedDraft, saveNow]);

  // Eliminar borrador
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined' || !key) return;

    try {
      localStorage.removeItem(key);
      setHasSavedDraft(false);
      setSavedDraftData(null);
      setSavedDraftMeta(null);
      setLastSavedAt(null);
      lastSavedSerializedRef.current = JSON.stringify(data);
    } catch (e) {
      console.warn('Error al eliminar borrador de localStorage:', e);
    }
  }, [key, data]);

  return {
    lastSavedAt,
    isSaving,
    hasSavedDraft,
    savedDraftData,
    savedDraftMeta,
    getSavedDraft,
    clearDraft,
    saveNow,
    isOnline,
  };
}
