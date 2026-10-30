import React, { useRef } from 'react';
import { portfolioData, WorkflowStage } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';
import { usePipeline } from '../hooks/usePipeline';

export const About: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { story } = portfolioData;
  useReveals(root);
  usePipeline(root);

  const renderStageVisual = (stageId: string) => {
    switch (stageId) {
      case 'ticket':
        return (
          <div className="jira-card rounded-lg border border-[var(--line)] bg-[var(--color-paper)] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="jira-icon inline-flex items-center justify-center w-5 h-5 rounded bg-blue-500/10 text-blue-600 font-mono text-[10px] font-bold">
                  TASK
                </span>
                <span className="jira-key font-mono text-xs font-semibold text-[var(--color-forest)]">
                  KAN-53
                </span>
              </div>
              <span className="jira-tag rounded px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/15 text-amber-700 border border-amber-500/30">
                IN PROGRESS
              </span>
            </div>
            <div className="jira-title font-medium text-sm text-[var(--color-ink)]">
              KAN-53 · Tenant provisioning
            </div>
            <div className="jira-meta mt-3 flex items-center justify-between text-[11px] text-[var(--fg-muted)] font-mono">
              <span>Assignee: MK</span>
              <span>Priority: High</span>
            </div>
          </div>
        );

      case 'branch':
        return (
          <div className="terminal-mockup rounded-lg border border-[var(--line)] bg-[var(--color-ink)] text-[var(--color-paper)] p-3 font-mono text-xs shadow-sm">
            <div className="terminal-header flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-white/40 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-2 font-mono text-[10px] text-white/50">zsh — labflow</span>
            </div>
            <div className="terminal-body space-y-1.5 leading-relaxed">
              <div className="terminal-command-line flex items-center flex-wrap">
                <span className="terminal-prompt text-[var(--color-leaf)] mr-2 select-none">$</span>
                <span className="terminal-typing text-[var(--color-paper)] font-mono">
                  git checkout -b feature/tenant-provisioning
                </span>
                <span className="terminal-cursor inline-block w-2 h-4 ml-0.5 bg-[var(--color-leaf)] animate-pulse" />
              </div>
              <div className="terminal-output text-white/60 text-[11px] pl-4">
                Switched to a new branch &apos;feature/tenant-provisioning&apos;
              </div>
              <div className="terminal-prompt-next flex items-center text-white/40">
                <span className="text-[var(--color-leaf)] mr-2 select-none">$</span>
                <span className="text-white/40 font-mono">ready</span>
              </div>
            </div>
          </div>
        );

      case 'tdd':
        return (
          <div className="tdd-test-list rounded-lg border border-[var(--line)] bg-[var(--color-paper)] p-3 shadow-sm space-y-2 font-mono text-xs">
            {[
              { name: 'test_tenant_create', file: 'tests/test_tenancy.py' },
              { name: 'test_schema_isolation', file: 'tests/test_isolation.py' },
              { name: 'test_quota_limits', file: 'tests/test_quotas.py' },
            ].map((test) => (
              <div
                key={test.name}
                data-test={test.name}
                className="tdd-test-row flex items-center justify-between p-2 rounded bg-black/[0.03] border border-black/[0.06]"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="tdd-dot w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="tdd-name font-mono text-xs text-[var(--color-ink)] truncate">
                    {test.name}
                  </span>
                </div>
                <span className="tdd-status-tag px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-red-500/15 text-red-600 border border-red-500/30">
                  FAIL
                </span>
              </div>
            ))}
          </div>
        );

      case 'ci':
        return (
          <div className="ci-checks-list rounded-lg border border-[var(--line)] bg-[var(--color-paper)] p-3 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            {[
              { id: 'lint', label: 'lint' },
              { id: 'typecheck', label: 'typecheck' },
              { id: 'unit-tests', label: 'unit-tests' },
              { id: 'schema-validate', label: 'schema-validate' },
              { id: 'security-audit', label: 'security-audit' },
              { id: 'build-artifacts', label: 'build-artifacts' },
            ].map((check) => (
              <div
                key={check.id}
                data-ci-check={check.id}
                className="ci-check-row flex items-center justify-between p-2 rounded bg-black/[0.03] border border-black/[0.06]"
              >
                <span className="ci-name font-mono text-[11px] text-[var(--color-ink)]">
                  {check.label}
                </span>
                <div className="ci-status-icons flex items-center justify-center w-5 h-5 relative">
                  <svg
                    className="ci-spinner w-3.5 h-3.5 animate-spin text-amber-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <svg
                    className="ci-tick w-4 h-4 text-emerald-600 hidden"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        );

      case 'ship':
        return (
          <div className="ship-badge-container rounded-lg border border-[var(--line)] bg-[var(--color-paper)] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="ship-badge-wrapper flex items-center gap-3">
              <div className="ship-pulse-ring relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="ship-pill font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                merged into main · deployed
              </div>
            </div>
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">
              Production v1.4.2
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section
      id="about"
      ref={root}
      data-chapter="02"
      data-chapter-title="About"
      data-tone="light"
      className="sheet-top tone-light px-[var(--pad-x)] pb-28 pt-24 md:pb-36 md:pt-32"
    >
      <div className="mx-auto grid max-w-[88rem] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 data-split className="display text-[clamp(3.5rem,9vw,8.5rem)]">
            {story.heading[0]} <em>{story.heading[1]}</em>
          </h2>
          <p data-fade className="muted mt-8 max-w-[32rem] text-lg leading-relaxed">
            {story.lead}
          </p>
        </div>

        <div className="pipeline-container lg:col-span-7 lg:pt-4">
          <div className="pipeline-header flex items-center justify-end pb-4 border-b border-[var(--line)]">
            
            <span className="pipeline-scroll-hint font-mono text-xs text-[var(--fg-muted)] tracking-wider">scroll to run ↓</span>
          </div>

          <div className="pipeline-track relative w-full h-1 bg-[var(--line)] rounded-full overflow-hidden my-4" aria-hidden="true">
            <div className="pipeline-line absolute inset-0 w-full h-full">
              <div
                className="pipeline-line-fill w-full h-full bg-[var(--accent)] origin-left scale-x-0"
                style={{ transformOrigin: '0% 50%' }}
              />
            </div>
          </div>

          <div className="pipeline-stages flex flex-col divide-y divide-[var(--line)]">
            {story.workflow.map((stage: WorkflowStage, index: number) => (
              <div
                key={stage.id}
                data-stage={stage.id}
                className="pipeline-stage relative flex flex-col gap-3 py-6"
              >
                <div className="pipeline-node flex items-center gap-3 is-upcoming">
                  <span className="pipeline-node-dot relative flex items-center justify-center w-7 h-7 rounded-full border border-[var(--line)] bg-[var(--color-paper)] font-mono text-xs font-bold text-[var(--color-forest)] transition-colors">
                    <span className="pipeline-node-num">{index + 1}</span>
                    <svg
                      className="pipeline-node-check hidden w-3.5 h-3.5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="pipeline-node-label font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                    {stage.label}
                  </span>
                </div>

                <div className="pipeline-visual pl-10">
                  {renderStageVisual(stage.id)}
                </div>

                <div className="pipeline-caption pl-10 font-mono text-xs text-[var(--fg-muted)] leading-relaxed">
                  {stage.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
