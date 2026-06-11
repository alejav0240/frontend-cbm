import {AnimatePresence, motion} from "motion/react";
import {SessionHeader} from "@/modules/atencion/sesionEnProgreso/components/SessionHeader";
import {CameraPreview} from "@/modules/atencion/sesionEnProgreso/components/CameraPreview";
import {WorkspaceTabs} from "@/modules/atencion/sesionEnProgreso/components/WorkspaceTabs";
import {PlanTab} from "@/modules/atencion/sesionEnProgreso/components/PlanTab";
import {NotesTab} from "@/modules/atencion/sesionEnProgreso/components/NotesTab";
import {ResourcesTab} from "@/modules/atencion/sesionEnProgreso/components/ResourcesTab";
import {EvaluationTab} from "@/modules/atencion/sesionEnProgreso/components/EvaluationTab";

export function SesionView() {
  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-[#f8fafc] dark:bg-background flex flex-col"
      >
          <SessionHeader
              activeSession={activeSession}
              timer={timer}
              isActive={isActive}
              setIsActive={setIsActive}
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              setShowFinishConfirm={setShowFinishConfirm}
              formatTime={formatTime}
          />

          <main className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
              <CameraPreview
                  stream={stream}
                  videoRef={videoRef}
                  isRecording={isRecording}
                  videoDevices={videoDevices}
                  selectedDeviceId={selectedDeviceId}
                  switchCamera={switchCamera}
                  startRecording={startRecording}
              />

              <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0a] min-h-[500px] lg:min-h-0">
                  <WorkspaceTabs
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                  />

                  <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
                      <AnimatePresence mode="wait">
                          {activeTab === 'plan' && (
                              <PlanTab
                                  key="plan"
                                  patientPlan={patientPlan}
                                  completedSteps={completedSteps}
                                  toggleStep={toggleStep}
                              />
                          )}

                          {activeTab === 'notes' && (
                              <NotesTab
                                  key="notes"
                                  notes={notes}
                                  setNotes={setNotes}
                                  timer={timer}
                                  formatTime={formatTime}
                              />
                          )}

                          {activeTab === 'resources' && (
                              <ResourcesTab
                                  key="resources"
                                  resources={resources}
                                  selectedResources={selectedResources}
                                  toggleResource={toggleResource}
                              />
                          )}

                          {activeTab === 'forms' && (
                              <EvaluationTab
                                  key="forms"
                                  evaluationScales={evaluationScales}
                                  selectedScales={selectedScales}
                                  toggleScale={toggleScale}
                                  formTemplates={formTemplates}
                                  selectedForms={selectedForms}
                                  toggleForm={toggleForm}
                                  formResponses={formResponses}
                                  updateForm={updateForm}
                              />
                          )}
                      </AnimatePresence>
                  </div>
              </div>
          </main>

          <FinishSessionModal
              isOpen={showFinishConfirm}
              onClose={() => setShowFinishConfirm(false)}
              onConfirm={handleFinish}
          />
      </motion.div>
  );
}
