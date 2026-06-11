'use client';

import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client/react';
import { useDashboard } from '../DashboardContext';
import { useClinical } from '@/api/hooks/useClinical';
import { useResources } from '@/api/hooks/useResources';
import { useEvaluations } from '@/api/hooks/useEvaluations';
import { UPDATE_SESSION, ADD_SESSION_RESOURCE } from '@/api/mutations/sessions';
import { UPDATE_STEP_PROGRESS } from '@/api/mutations/clinical';
import { toast } from 'sonner';

export function useSessionInProgress() {
    const { activeSession, setActiveSession } = useDashboard();

    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [notes, setNotes] = useState('');
    const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'forms' | 'plan'>('plan');
    const [selectedResources, setSelectedResources] = useState<string[]>([]);
    const [selectedScales, setSelectedScales] = useState<number[]>([]);
    const [selectedForms, setSelectedForms] = useState<number[]>([]);
    const [formResponses, setFormResponses] = useState<Record<string, any>>({});
    const [isRecording, setIsRecording] = useState(false);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);

    // Backend hooks
    const { interventionPlans } = useClinical(activeSession?.patientId ?? undefined);
    const patientPlan = interventionPlans[0] ?? null;

    const { resources } = useResources(undefined, undefined, 1, 100);
    const { scales: evaluationScales, forms: formTemplates } = useEvaluations();

    const [updateSessionMutation] = useMutation(UPDATE_SESSION);
    const [addSessionResourceMutation] = useMutation(ADD_SESSION_RESOURCE);
    const [updateStepProgressMutation] = useMutation(UPDATE_STEP_PROGRESS);

    // Timer
    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, [isActive]);

    // Enumerate video devices
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoInputs = devices.filter(d => d.kind === 'videoinput');
            setVideoDevices(videoInputs);
            if (videoInputs.length > 0) setSelectedDeviceId(prev => prev || videoInputs[0].deviceId);
        }).catch(console.error);
    }, []);

    const startRecording = async (deviceId?: string) => {
        try {
            setRecordedChunks([]);
            const targetId = deviceId || selectedDeviceId;
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: targetId ? { exact: targetId } : undefined, width: 1280, height: 720 },
                audio: true,
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;

            const recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm;codecs=vp8,opus' });
            recorder.ondataavailable = e => { if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]); };
            recorder.start(1000);
            setMediaRecorder(recorder);
            setIsRecording(true);
            toast.success('Grabación iniciada');
        } catch {
            toast.error('Error: verifica permisos de cámara y micrófono');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder?.state !== 'inactive') mediaRecorder?.stop();
        stream?.getTracks().forEach(t => t.stop());
        setIsRecording(false);
        toast.success('Grabación detenida');
    };

    const toggleRecording = () => isRecording ? stopRecording() : startRecording();

    const switchCamera = async (deviceId: string) => {
        setSelectedDeviceId(deviceId);
        if (isRecording || stream) {
            stream?.getTracks().forEach(t => t.stop());
            await startRecording(deviceId);
        }
    };

    const toggleStep = (id: string) => {
        const willBeCompleted = !completedSteps.includes(id);
        setCompletedSteps(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
        updateStepProgressMutation({ variables: { stepId: id, isCompleted: willBeCompleted } })
            .catch(() => toast.error('Error al actualizar el paso'));
    };

    const handleFinish = async () => {
        if (!activeSession?.id) return;

        try {
            // 1. Subir video si existe
            let videoUrl: string | undefined;
            if (recordedChunks.length > 0) {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const formData = new FormData();
                formData.append('file', blob, `session-${activeSession.id}-${Date.now()}.webm`);
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) videoUrl = data.url;
            }

            // 2. Actualizar sesión en backend
            await updateSessionMutation({
                variables: {
                    id: activeSession.id,
                    notes,
                    durationMinutes: Math.floor(timer / 60),
                    sessionStatus: 'completa',
                    ...(videoUrl && { videoUrl }),
                },
            });

            // 3. Vincular recursos seleccionados
            if (selectedResources.length > 0) {
                await Promise.all(
                    selectedResources.map(resourceId =>
                        addSessionResourceMutation({ variables: { sessionId: activeSession.id, resourceId } })
                    )
                );
            }

            // 4. Limpiar y cerrar
            stream?.getTracks().forEach(t => t.stop());
            setActiveSession(null);
            toast.success('Sesión finalizada y guardada');
        } catch {
            toast.error('Error al finalizar la sesión');
        }
    };

    const toggleResource = (id: string) => {
        setSelectedResources(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const toggleScale = (id: number) => {
        setSelectedScales(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const toggleForm = (id: number) => {
        setSelectedForms(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const updateForm = (key: string, value: any) => {
        setFormResponses(prev => ({ ...prev, [key]: value }));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return {
        activeSession,
        timer,
        isActive,
        setIsActive,
        notes,
        setNotes,
        activeTab,
        setActiveTab,
        selectedResources,
        selectedScales,
        selectedForms,
        formResponses,
        isRecording,
        showFinishConfirm,
        setShowFinishConfirm,
        completedSteps,
        stream,
        videoDevices,
        selectedDeviceId,
        videoRef,
        patientPlan,
        resources,
        evaluationScales,
        formTemplates,
        startRecording,
        toggleRecording,
        switchCamera,
        handleFinish,
        toggleResource,
        toggleScale,
        toggleForm,
        toggleStep,
        updateForm,
        formatTime,
    };
}
