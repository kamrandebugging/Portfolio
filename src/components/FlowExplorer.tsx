import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  UserCheck,
  TestTubes,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  ArrowDownRight,
  Layers,
} from 'lucide-react';
import { portfolioData } from '../data/portfolio';

const STEP_ICONS = [UserCheck, TestTubes, FileSpreadsheet, CheckCircle2, FileText];

export const FlowExplorer: React.FC = () => {
  const { flowExplorer } = portfolioData;
  const [activeStep, setActiveStep] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(flowExplorer.steps.length - 1, prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleScrollToProjects = () => {
    const el = document.querySelector('#projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentStep = flowExplorer.steps[activeStep];

  return (
    <section
      id="flow-explorer"
      className="relative px-6 sm:px-10 md:px-14 py-20 sm:py-28 border-y border-white/10 bg-[#08080a]"
      aria-label="How LabFlow works"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="max-w-4xl">
        {/* Context badge above heading so visitors immediately understand what LabFlow is */}
        {flowExplorer.badge && (
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-wider text-[#807f78] mb-5">
            <span className="w-2 h-2 rounded-full bg-[#ff3b1d] animate-pulse" />
            <span>{flowExplorer.badge}</span>
          </div>
        )}

        <div>
          <span className="eyebrow">{flowExplorer.eyebrow}</span>
          <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl text-[#f3f1ea] mt-4 leading-[0.95]">
            {flowExplorer.title}
          </h2>
          {flowExplorer.description && (
            <p className="mt-5 text-base sm:text-lg text-[#807f78] leading-relaxed max-w-2xl">
              {flowExplorer.description}
            </p>
          )}
        </div>
      </div>

      {/* Desktop Stepper (Horizontal) */}
      <div className="hidden md:block mt-12 sm:mt-16">
        <div
          className="relative flex items-center justify-between"
          role="tablist"
          aria-label="LabFlow workflow steps"
        >
          {/* Connecting Track Line */}
          <div
            className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-white/10 z-0"
            aria-hidden="true"
          />

          {/* Active Progress Line */}
          <div
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#ff3b1d] z-0 transition-all duration-300"
            style={{
              width: `${(activeStep / (flowExplorer.steps.length - 1)) * 100}%`,
            }}
            aria-hidden="true"
          />

          {/* Step Nodes */}
          {flowExplorer.steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx] || Layers;
            const isActive = activeStep === idx;
            const isCompleted = idx < activeStep;

            return (
              <button
                key={step.step}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`step-panel-${step.step}`}
                id={`step-tab-${step.step}`}
                onClick={() => setActiveStep(idx)}
                className={`relative z-10 flex flex-col items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b1d] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08080a] rounded-xl p-1.5 transition-all duration-200 cursor-pointer`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-semibold border transition-all duration-300 ${
                    isActive
                      ? 'bg-[#ff3b1d] text-white border-[#ff3b1d] shadow-[0_0_20px_rgba(255,59,29,0.5)] scale-110'
                      : isCompleted
                      ? 'bg-[#111114] text-[#ff3b1d] border-[#ff3b1d]/40 hover:border-[#ff3b1d]'
                      : 'bg-[#111114] text-[#807f78] border-white/10 hover:border-white/25 hover:text-[#f3f1ea]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs uppercase tracking-wider font-medium max-w-[120px] text-center leading-tight transition-colors duration-200 ${
                    isActive ? 'text-[#f3f1ea] font-semibold' : 'text-[#807f78] group-hover:text-[#f3f1ea]'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Detail Card */}
        <div
          id={`step-panel-${currentStep.step}`}
          role="tabpanel"
          aria-labelledby={`step-tab-${currentStep.step}`}
          className="mt-10 rounded-2xl border border-white/10 bg-[#111114]/60 p-8 relative overflow-hidden backdrop-blur-sm"
        >
          {/* Subtle top red glow */}
          <div
            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ff3b1d] to-transparent opacity-80"
            aria-hidden="true"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.step}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col justify-between min-h-[170px]"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#ff3b1d]/15 text-[#ff3b1d] border border-[#ff3b1d]/30 font-semibold">
                      STEP 0{currentStep.step} / 05
                    </span>
                    <h3 className="font-display uppercase tracking-tight text-2xl sm:text-3xl text-[#f3f1ea]">
                      {currentStep.title}
                    </h3>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={activeStep === 0}
                      aria-label="Previous step"
                      className="p-2 rounded-lg border border-white/10 bg-white/[0.03] text-[#f3f1ea] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b1d]"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={activeStep === flowExplorer.steps.length - 1}
                      aria-label="Next step"
                      className="p-2 rounded-lg border border-white/10 bg-white/[0.03] text-[#f3f1ea] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b1d]"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-[#807f78] leading-relaxed max-w-3xl">
                  {currentStep.desc}
                </p>
              </div>

              {/* Stack tags */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#807f78] mr-2 font-sans font-semibold">
                  Stack:
                </span>
                {currentStep.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-3 py-1 rounded-full bg-white/[0.04] text-[#f3f1ea] border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Stepper (Vertical Accordion for 375px) */}
      <div className="md:hidden mt-8 flex flex-col gap-3">
        {flowExplorer.steps.map((step, idx) => {
          const Icon = STEP_ICONS[idx] || Layers;
          const isActive = activeStep === idx;
          const isCompleted = idx < activeStep;

          return (
            <div
              key={step.step}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isActive
                  ? 'border-[#ff3b1d] bg-[#111114]'
                  : 'border-white/10 bg-[#111114]/50'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveStep(idx)}
                className="w-full p-4 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b1d]"
                aria-expanded={isActive}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-semibold border transition-colors ${
                      isActive
                        ? 'bg-[#ff3b1d] text-white border-[#ff3b1d]'
                        : isCompleted
                        ? 'bg-[#111114] text-[#ff3b1d] border-[#ff3b1d]/40'
                        : 'bg-[#08080a] text-[#807f78] border-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[0.7rem] text-[#ff3b1d] block">
                      0{step.step}
                    </span>
                    <span
                      className={`text-sm font-semibold tracking-tight uppercase ${
                        isActive ? 'text-[#f3f1ea]' : 'text-[#807f78]'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono transition-transform duration-200 ${
                    isActive ? 'rotate-90 text-[#ff3b1d]' : 'text-[#807f78]'
                  }`}
                >
                  →
                </span>
              </button>

              {/* Mobile Expanded Detail */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3"
                  >
                    <p className="text-sm text-[#807f78] leading-relaxed">
                      {step.desc}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                      <span className="text-[0.7rem] uppercase tracking-wider text-[#807f78] mr-1 font-semibold">
                        Stack:
                      </span>
                      {step.stack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[0.7rem] px-2 py-0.5 rounded bg-white/[0.04] text-[#f3f1ea] border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer Info & CTA */}
      <div className="mt-10 sm:mt-12 space-y-4">
        {/* Tag row */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/10 font-mono text-xs text-[#807f78]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b1d]" />
          <span>{flowExplorer.tagline}</span>
        </div>

        {/* Money Note */}
        <p className="text-xs sm:text-sm text-[#807f78] leading-relaxed max-w-3xl bg-[#111114]/40 border border-white/5 p-4 rounded-xl">
          {flowExplorer.moneyNote}
        </p>

        {/* Bottom CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleScrollToProjects}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#f3f1ea] hover:text-[#ff3b1d] transition-colors py-1.5 px-3 rounded-lg border border-white/10 hover:border-[#ff3b1d]/40 bg-white/[0.02]"
          >
            <span>{flowExplorer.ctaText}</span>
            <ArrowDownRight className="w-4 h-4 text-[#ff3b1d] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FlowExplorer;
