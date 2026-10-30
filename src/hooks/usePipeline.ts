import { RefObject, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, motionMatchMedia } from '../engine/gsap';

export interface UsePipelineReturn {
  replay: () => void;
}

export function usePipeline(root: RefObject<HTMLElement | null>): UsePipelineReturn {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const mm = motionMatchMedia();

      mm.add(MOTION_OK, () => {
        const container = root.current?.querySelector<HTMLElement>('.pipeline-container');
        if (!container) return;

        const connectorFill = container.querySelector<HTMLElement>('.pipeline-line-fill');
        const nodes = gsap.utils.toArray<HTMLElement>('.pipeline-node', container);

        // Stage 1 elements (Ticket)
        const jiraCard = container.querySelector<HTMLElement>('.jira-card');

        // Stage 2 elements (Branch)
        const terminalTyping = container.querySelector<HTMLElement>('.terminal-typing');
        const terminalOutput = container.querySelector<HTMLElement>('.terminal-output');
        const terminalPromptNext = container.querySelector<HTMLElement>('.terminal-prompt-next');
        const fullBranchCommand = 'git checkout -b feature/tenant-provisioning';

        // Stage 3 elements (TDD)
        const tddRows = gsap.utils.toArray<HTMLElement>('.tdd-test-row', container);

        // Stage 4 elements (CI)
        const ciRows = gsap.utils.toArray<HTMLElement>('.ci-check-row', container);

        // Stage 5 elements (Ship)
        const shipBadge = container.querySelector<HTMLElement>('.ship-badge-container');

        // Helper to update node classes
        const setNodeState = (index: number, state: 'upcoming' | 'active' | 'done') => {
          const node = nodes[index];
          if (!node) return;
          node.classList.remove('is-upcoming', 'is-active', 'is-done');
          node.classList.add(`is-${state}`);
        };

        // Reset all elements to initial state
        const resetInitial = () => {
          if (connectorFill) {
            gsap.set(connectorFill, { scaleX: 0, scaleY: 0 });
          }

          nodes.forEach((_, idx) => setNodeState(idx, 'upcoming'));

          if (jiraCard) {
            const isDesktop = window.innerWidth >= 768;
            gsap.set(jiraCard, {
              autoAlpha: 0,
              x: isDesktop ? -24 : 0,
              y: isDesktop ? 0 : 20,
            });
          }

          if (terminalTyping) {
            terminalTyping.textContent = '';
          }
          if (terminalOutput) {
            gsap.set(terminalOutput, { autoAlpha: 0 });
          }
          if (terminalPromptNext) {
            gsap.set(terminalPromptNext, { autoAlpha: 0 });
          }

          tddRows.forEach((row) => {
            const dot = row.querySelector<HTMLElement>('.tdd-dot');
            const tag = row.querySelector<HTMLElement>('.tdd-status-tag');
            if (dot) dot.style.backgroundColor = '#ef4444';
            if (tag) {
              tag.textContent = 'FAIL';
              tag.className =
                'tdd-status-tag px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-red-500/15 text-red-600 border border-red-500/30';
            }
            gsap.set(row, { autoAlpha: 0, y: 10 });
          });

          ciRows.forEach((row) => {
            const spinner = row.querySelector<HTMLElement>('.ci-spinner');
            const tick = row.querySelector<HTMLElement>('.ci-tick');
            if (spinner) spinner.classList.remove('hidden');
            if (tick) tick.classList.add('hidden');
            gsap.set(row, { autoAlpha: 0, y: 8 });
          });

          if (shipBadge) {
            gsap.set(shipBadge, { autoAlpha: 0, scale: 0.95 });
          }
        };

        resetInitial();

        // Build Master Timeline
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'expo.out' },
        });

        // ================= STAGE 1: TICKET =================
        tl.addLabel('stage1')
          .call(() => setNodeState(0, 'active'))
          .to(connectorFill, { scaleX: 0.2, scaleY: 0.2, duration: 0.6 })
          .to(
            jiraCard,
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.8,
            },
            '-=0.4'
          )
          .call(() => setNodeState(0, 'done'));

        // ================= STAGE 2: BRANCH =================
        tl.addLabel('stage2')
          .call(() => setNodeState(1, 'active'))
          .to(connectorFill, { scaleX: 0.4, scaleY: 0.4, duration: 0.6 })
          .call(() => {
            if (terminalTyping) {
              terminalTyping.textContent = '';
            }
          });

        // Typewriter effect
        const textObj = { count: 0 };
        tl.to(textObj, {
          count: fullBranchCommand.length,
          duration: 0.9,
          ease: 'none',
          onUpdate: () => {
            if (terminalTyping) {
              terminalTyping.textContent = fullBranchCommand.slice(0, Math.floor(textObj.count));
            }
          },
        })
          .to(terminalOutput, { autoAlpha: 1, duration: 0.3 })
          .to(terminalPromptNext, { autoAlpha: 1, duration: 0.3 })
          .call(() => setNodeState(1, 'done'));

        // ================= STAGE 3: TDD =================
        tl.addLabel('stage3')
          .call(() => setNodeState(2, 'active'))
          .to(connectorFill, { scaleX: 0.6, scaleY: 0.6, duration: 0.6 })
          .to(tddRows, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
          });

        // Flip FAIL to PASS one by one
        tddRows.forEach((row, i) => {
          tl.call(
            () => {
              const dot = row.querySelector<HTMLElement>('.tdd-dot');
              const tag = row.querySelector<HTMLElement>('.tdd-status-tag');
              if (dot) dot.style.backgroundColor = '#10b981';
              if (tag) {
                tag.textContent = 'PASS';
                tag.className =
                  'tdd-status-tag px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30';
              }
              gsap.fromTo(row, { scale: 0.98 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
            },
            undefined,
            `+=${0.15 + i * 0.15}`
          );
        });

        tl.call(() => setNodeState(2, 'done'));

        // ================= STAGE 4: CI =================
        tl.addLabel('stage4')
          .call(() => setNodeState(3, 'active'))
          .to(connectorFill, { scaleX: 0.8, scaleY: 0.8, duration: 0.6 })
          .to(ciRows, {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
          });

        // Tick each CI check green one after another
        ciRows.forEach((row) => {
          tl.call(
            () => {
              const spinner = row.querySelector<HTMLElement>('.ci-spinner');
              const tick = row.querySelector<HTMLElement>('.ci-tick');
              if (spinner) spinner.classList.add('hidden');
              if (tick) tick.classList.remove('hidden');
              gsap.fromTo(tick, { scale: 0.4 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
            },
            undefined,
            '+=0.1'
          );
        });

        tl.call(() => setNodeState(3, 'done'));

        // ================= STAGE 5: SHIP =================
        tl.addLabel('stage5')
          .call(() => setNodeState(4, 'active'))
          .to(connectorFill, { scaleX: 1, scaleY: 1, duration: 0.6 })
          .to(shipBadge, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.35)',
          })
          .call(() => setNodeState(4, 'done'));

        tlRef.current = tl;

        // Auto-play once on scroll into view
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 75%',
          once: true,
          onEnter: () => tl.play(),
        });

        return () => {
          tl.kill();
        };
      });

      // Reduced motion fallback: set all stages to final complete state instantly
      const setReducedMotionState = () => {
        const container = root.current?.querySelector<HTMLElement>('.pipeline-container');
        if (!container) return;

        const connectorFill = container.querySelector<HTMLElement>('.pipeline-line-fill');
        if (connectorFill) {
          gsap.set(connectorFill, { scaleX: 1, scaleY: 1 });
        }

        const nodes = gsap.utils.toArray<HTMLElement>('.pipeline-node', container);
        nodes.forEach((node) => {
          node.classList.remove('is-upcoming', 'is-active');
          node.classList.add('is-done');
        });

        const jiraCard = container.querySelector<HTMLElement>('.jira-card');
        if (jiraCard) {
          gsap.set(jiraCard, { autoAlpha: 1, x: 0, y: 0 });
        }

        const terminalTyping = container.querySelector<HTMLElement>('.terminal-typing');
        if (terminalTyping) {
          terminalTyping.textContent = 'git checkout -b feature/tenant-provisioning';
        }
        const terminalOutput = container.querySelector<HTMLElement>('.terminal-output');
        if (terminalOutput) {
          gsap.set(terminalOutput, { autoAlpha: 1 });
        }
        const terminalPromptNext = container.querySelector<HTMLElement>('.terminal-prompt-next');
        if (terminalPromptNext) {
          gsap.set(terminalPromptNext, { autoAlpha: 1 });
        }

        const tddRows = gsap.utils.toArray<HTMLElement>('.tdd-test-row', container);
        tddRows.forEach((row) => {
          const dot = row.querySelector<HTMLElement>('.tdd-dot');
          const tag = row.querySelector<HTMLElement>('.tdd-status-tag');
          if (dot) dot.style.backgroundColor = '#10b981';
          if (tag) {
            tag.textContent = 'PASS';
            tag.className =
              'tdd-status-tag px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30';
          }
          gsap.set(row, { autoAlpha: 1, y: 0 });
        });

        const ciRows = gsap.utils.toArray<HTMLElement>('.ci-check-row', container);
        ciRows.forEach((row) => {
          const spinner = row.querySelector<HTMLElement>('.ci-spinner');
          const tick = row.querySelector<HTMLElement>('.ci-tick');
          if (spinner) spinner.classList.add('hidden');
          if (tick) tick.classList.remove('hidden');
          gsap.set(row, { autoAlpha: 1, y: 0 });
        });

        const shipBadge = container.querySelector<HTMLElement>('.ship-badge-container');
        if (shipBadge) {
          gsap.set(shipBadge, { autoAlpha: 1, scale: 1 });
        }
      };

      if (
        document.documentElement.dataset.motion === 'reduced' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        setReducedMotionState();
      }
    },
    { scope: root }
  );

  const replay = () => {
    if (tlRef.current) {
      tlRef.current.pause(0);
      tlRef.current.play();
    }
  };

  return { replay };
}

export default usePipeline;
