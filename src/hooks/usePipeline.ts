import { RefObject } from 'react';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  MOTION_OK,
  SCENES_ON,
  MOBILE_SCENES,
  motionMatchMedia,
} from '../engine/gsap';

export function usePipeline(root: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      if (!root.current) return;
      const mm = motionMatchMedia();

      mm.add(MOTION_OK, () => {
        const container = root.current?.querySelector<HTMLElement>('.pipeline-container');
        if (!container || !root.current) return;

        const scrollHint = container.querySelector<HTMLElement>('.pipeline-scroll-hint');
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

        // Node states derive ONLY from timeline progress (0.0 to 1.0)
        // Stage boundaries at 0.0 / 0.2 / 0.4 / 0.6 / 0.8 / 1.0
        const updateNodeStates = (p: number) => {
          // Stage 1: TICKET (0.0 .. 0.2)
          if (p < 0.005) setNodeState(0, 'upcoming');
          else if (p < 0.2) setNodeState(0, 'active');
          else setNodeState(0, 'done');

          // Stage 2: BRANCH (0.2 .. 0.4)
          if (p < 0.2) setNodeState(1, 'upcoming');
          else if (p < 0.4) setNodeState(1, 'active');
          else setNodeState(1, 'done');

          // Stage 3: TDD (0.4 .. 0.6)
          if (p < 0.4) setNodeState(2, 'upcoming');
          else if (p < 0.6) setNodeState(2, 'active');
          else setNodeState(2, 'done');

          // Stage 4: CI (0.6 .. 0.8)
          if (p < 0.6) setNodeState(3, 'upcoming');
          else if (p < 0.8) setNodeState(3, 'active');
          else setNodeState(3, 'done');

          // Stage 5: SHIP (0.8 .. 1.0)
          if (p < 0.8) setNodeState(4, 'upcoming');
          else if (p < 0.999) setNodeState(4, 'active');
          else setNodeState(4, 'done');
        };

        // Reset all elements to initial state
        const resetInitial = () => {
          if (connectorFill) {
            gsap.set(connectorFill, { scaleX: 0, scaleY: 0 });
          }

          nodes.forEach((_, idx) => setNodeState(idx, 'upcoming'));

          if (scrollHint) {
            gsap.set(scrollHint, { autoAlpha: 1 });
          }

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
            gsap.set(terminalOutput, { autoAlpha: 0, y: 4 });
          }
          if (terminalPromptNext) {
            gsap.set(terminalPromptNext, { autoAlpha: 0, y: 4 });
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
            gsap.set(row, { autoAlpha: 0, y: 8 });
          });

          ciRows.forEach((row) => {
            const spinner = row.querySelector<HTMLElement>('.ci-spinner');
            const tick = row.querySelector<HTMLElement>('.ci-tick');
            if (spinner) spinner.classList.remove('hidden');
            if (tick) tick.classList.add('hidden');
            gsap.set(row, { autoAlpha: 0, y: 6 });
          });

          if (shipBadge) {
            gsap.set(shipBadge, { autoAlpha: 0, scale: 0.94, boxShadow: 'none' });
          }
        };

        resetInitial();

        // ---- Mobile helpers: replayable per-stage reveal (no pin on phones) ----
        // Pending delayedCalls are tracked so a fast reverse scroll can't leave stale flips behind.
        let stageTimers: gsap.core.Tween[] = [];
        const killStageTimers = () => {
          stageTimers.forEach((t) => t.kill());
          stageTimers = [];
        };

        const resetStage = (id: string) => {
          killStageTimers();
          if (id === 'ticket' && jiraCard) {
            gsap.killTweensOf(jiraCard);
            gsap.set(jiraCard, { autoAlpha: 0, x: 0, y: 20 });
          } else if (id === 'branch') {
            if (terminalTyping) terminalTyping.textContent = '';
            if (terminalOutput) gsap.set(terminalOutput, { autoAlpha: 0, y: 4 });
            if (terminalPromptNext) gsap.set(terminalPromptNext, { autoAlpha: 0, y: 4 });
          } else if (id === 'tdd') {
            tddRows.forEach((row) => {
              gsap.killTweensOf(row);
              const dot = row.querySelector<HTMLElement>('.tdd-dot');
              const tag = row.querySelector<HTMLElement>('.tdd-status-tag');
              if (dot) dot.style.backgroundColor = '#ef4444';
              if (tag) {
                tag.textContent = 'FAIL';
                tag.className = 'tdd-status-tag px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-red-500/15 text-red-600 border border-red-500/30';
              }
              gsap.set(row, { autoAlpha: 0, y: 8 });
            });
          } else if (id === 'ci') {
            ciRows.forEach((row) => {
              gsap.killTweensOf(row);
              const spinner = row.querySelector<HTMLElement>('.ci-spinner');
              const tick = row.querySelector<HTMLElement>('.ci-tick');
              if (spinner) spinner.classList.remove('hidden');
              if (tick) tick.classList.add('hidden');
              gsap.set(row, { autoAlpha: 0, y: 6 });
            });
          } else if (id === 'ship' && shipBadge) {
            gsap.killTweensOf(shipBadge);
            gsap.set(shipBadge, { autoAlpha: 0, scale: 0.94, boxShadow: 'none' });
          }
        };

        const revealStage = (id: string) => {
          if (id === 'ticket' && jiraCard) {
            gsap.to(jiraCard, { autoAlpha: 1, x: 0, y: 0, duration: 0.7, ease: 'expo.out' });
          } else if (id === 'branch') {
            if (terminalTyping) {
              const o = { n: 0 };
              gsap.to(o, {
                n: fullBranchCommand.length,
                duration: 0.9,
                ease: 'none',
                onUpdate: () => {
                  if (terminalTyping)
                    terminalTyping.textContent = fullBranchCommand.slice(0, Math.round(o.n));
                },
              });
            }
            if (terminalOutput)
              gsap.to(terminalOutput, { autoAlpha: 1, y: 0, duration: 0.4, delay: 0.9 });
            if (terminalPromptNext)
              gsap.to(terminalPromptNext, { autoAlpha: 1, y: 0, duration: 0.4, delay: 1.0 });
          } else if (id === 'tdd') {
            const passTag =
              'tdd-status-tag px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30';
            tddRows.forEach((row, i) => {
              gsap.to(row, { autoAlpha: 1, y: 0, duration: 0.4, delay: i * 0.12, ease: 'expo.out' });
              stageTimers.push(gsap.delayedCall(i * 0.12 + 0.35, () => {
                const dot = row.querySelector<HTMLElement>('.tdd-dot');
                const tag = row.querySelector<HTMLElement>('.tdd-status-tag');
                if (dot) dot.style.backgroundColor = '#10b981';
                if (tag) {
                  tag.textContent = 'PASS';
                  tag.className = passTag;
                }
              }));
            });
          } else if (id === 'ci') {
            ciRows.forEach((row, i) => {
              gsap.to(row, { autoAlpha: 1, y: 0, duration: 0.4, delay: i * 0.12, ease: 'expo.out' });
              stageTimers.push(gsap.delayedCall(i * 0.12 + 0.45, () => {
                const spinner = row.querySelector<HTMLElement>('.ci-spinner');
                const tick = row.querySelector<HTMLElement>('.ci-tick');
                if (spinner) spinner.classList.add('hidden');
                if (tick) tick.classList.remove('hidden');
              }));
            });
          } else if (id === 'ship' && shipBadge) {
            gsap.to(shipBadge, {
              autoAlpha: 1,
              scale: 1,
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.45)',
              duration: 0.5,
              ease: 'back.out(1.6)',
            });
          }
        };

        // ---- Desktop / tablet: pinned scrub timeline (unchanged behaviour) ----
        mm.add(SCENES_ON, () => {

        // PIN the section during sequence:
        // ScrollTrigger on section#about: pin: true, pinSpacing: true, start: "top top", end: "+=300%", scrub: 0.5.
        // Timeline duration is normalized to 5.0 seconds so time / 5.0 maps 1:1 to timeline progress.
        // Stage boundaries are exactly at 0.0 / 0.2 / 0.4 / 0.6 / 0.8 / 1.0 (times 0.0, 1.0, 2.0, 3.0, 4.0, 5.0).
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            pinSpacing: true,
            start: 'top top',
            end: '+=300%',
            scrub: 0.5,
            onUpdate: (self) => {
              updateNodeStates(self.progress);
            },
          },
          defaults: { ease: 'none' },
        });

        // 1. Scroll hint: fades out once timeline progress > 0.05 (time > 0.25)
        if (scrollHint) {
          tl.fromTo(
            scrollHint,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.25, ease: 'none' },
            0
          );
        }

        // 2. Connector fill: maps 1:1 to timeline progress from 0 to 1 across 5.0s
        if (connectorFill) {
          tl.fromTo(
            connectorFill,
            { scaleX: 0, scaleY: 0 },
            { scaleX: 1, scaleY: 1, duration: 5.0, ease: 'none' },
            0
          );
        }

        // ================= STAGE 1: TICKET (0.0 -> 1.0, progress 0.0 -> 0.2) =================
        if (jiraCard) {
          const isDesktop = window.innerWidth >= 768;
          tl.fromTo(
            jiraCard,
            {
              autoAlpha: 0,
              x: isDesktop ? -24 : 0,
              y: isDesktop ? 0 : 20,
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.7,
              ease: 'expo.out',
            },
            0.15
          );
        }

        // ================= STAGE 2: BRANCH (1.0 -> 2.0, progress 0.2 -> 0.4) =================
        // scrub-driven: tween {n: 0 -> full length}, onUpdate slices the string - proportional to timeline progress
        const typeState = { n: 0 };
        tl.fromTo(
          typeState,
          { n: 0 },
          {
            n: fullBranchCommand.length,
            duration: 0.7,
            ease: 'none',
            onUpdate: () => {
              if (terminalTyping) {
                terminalTyping.textContent = fullBranchCommand.slice(0, Math.round(typeState.n));
              }
            },
          },
          1.15
        );

        if (terminalOutput) {
          tl.fromTo(
            terminalOutput,
            { autoAlpha: 0, y: 4 },
            { autoAlpha: 1, y: 0, duration: 0.12, ease: 'expo.out' },
            1.86
          );
        }

        if (terminalPromptNext) {
          tl.fromTo(
            terminalPromptNext,
            { autoAlpha: 0, y: 4 },
            { autoAlpha: 1, y: 0, duration: 0.12, ease: 'expo.out' },
            1.94
          );
        }

        // ================= STAGE 3: TDD (2.0 -> 3.0, progress 0.4 -> 0.6) =================
        // 3 test lines appear red as "FAIL", then flip one by one to green "PASS"
        if (tddRows.length) {
          tl.fromTo(
            tddRows,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.04, ease: 'expo.out' },
            2.05
          );

          tddRows.forEach((row, i) => {
            const dot = row.querySelector<HTMLElement>('.tdd-dot');
            const tag = row.querySelector<HTMLElement>('.tdd-status-tag');
            const flipObj = { val: 0 };
            const flipTime = 2.32 + i * 0.18;

            if (dot) {
              tl.fromTo(
                dot,
                { backgroundColor: '#ef4444' },
                { backgroundColor: '#10b981', duration: 0.12, ease: 'none' },
                flipTime
              );
            }

            if (tag) {
              tl.fromTo(
                flipObj,
                { val: 0 },
                {
                  val: 1,
                  duration: 0.12,
                  ease: 'none',
                  onUpdate: () => {
                    if (flipObj.val >= 0.5) {
                      tag.textContent = 'PASS';
                      tag.className =
                        'tdd-status-tag px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30';
                    } else {
                      tag.textContent = 'FAIL';
                      tag.className =
                        'tdd-status-tag px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-red-500/15 text-red-600 border border-red-500/30';
                    }
                  },
                },
                flipTime
              );
              tl.fromTo(
                row,
                { scale: 0.98 },
                { scale: 1, duration: 0.12, ease: 'back.out(2)' },
                flipTime
              );
            }
          });
        }

        // ================= STAGE 4: CI (3.0 -> 4.0, progress 0.6 -> 0.8) =================
        // 6 check rows; each shows a spinner then ticks green, one after another, GitHub-Actions style
        if (ciRows.length) {
          tl.fromTo(
            ciRows,
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.02, ease: 'expo.out' },
            3.05
          );

          ciRows.forEach((row, i) => {
            const spinner = row.querySelector<HTMLElement>('.ci-spinner');
            const tick = row.querySelector<HTMLElement>('.ci-tick');
            const checkObj = { val: 0 };
            const checkTime = 3.25 + i * 0.09;

            tl.fromTo(
              checkObj,
              { val: 0 },
              {
                val: 1,
                duration: 0.08,
                ease: 'none',
                onUpdate: () => {
                  if (checkObj.val >= 0.5) {
                    if (spinner) spinner.classList.add('hidden');
                    if (tick) tick.classList.remove('hidden');
                  } else {
                    if (spinner) spinner.classList.remove('hidden');
                    if (tick) tick.classList.add('hidden');
                  }
                },
              },
              checkTime
            );

            if (tick) {
              tl.fromTo(
                tick,
                { scale: 0.3, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.09, ease: 'back.out(2)' },
                checkTime
              );
            }
          });
        }

        // ================= STAGE 5: SHIP (4.0 -> 5.0, progress 0.8 -> 1.0) =================
        // "merged into main · deployed" with glow pulse
        if (shipBadge) {
          tl.fromTo(
            shipBadge,
            { autoAlpha: 0, scale: 0.94 },
            { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' },
            4.1
          );

          tl.fromTo(
            shipBadge,
            { boxShadow: '0 0 0px rgba(16, 185, 129, 0)' },
            { boxShadow: '0 0 24px rgba(16, 185, 129, 0.45)', duration: 0.6, ease: 'sine.inOut' },
            4.35
          );
        }

        return () => {
          tl.kill();
        };
        });

        // ---- Phones: no pin. Each stage reveals once as it scrolls into view.
        // Permanent fix: the pinned scrub timeline gets stuck on mobile. ----
        mm.add(MOBILE_SCENES, () => {
          if (scrollHint) gsap.set(scrollHint, { autoAlpha: 0 });

          if (connectorFill) {
            gsap.fromTo(
              connectorFill,
              { scaleX: 0, scaleY: 0 },
              {
                scaleX: 1,
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: container, start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
              }
            );
          }

          const stages = gsap.utils.toArray<HTMLElement>('.pipeline-stage', container);
          stages.forEach((stage) => {
            const id = stage.dataset.stage ?? '';
            const node = stage.querySelector<HTMLElement>('.pipeline-node');
            const setNode = (cls: 'is-upcoming' | 'is-done') => {
              if (!node) return;
              node.classList.remove('is-upcoming', 'is-active', 'is-done');
              node.classList.add(cls);
            };
            ScrollTrigger.create({
              trigger: stage,
              start: 'top 80%',
              onEnter: () => {
                resetStage(id);
                setNode('is-done');
                revealStage(id);
              },
              onLeaveBack: () => {
                resetStage(id);
                setNode('is-upcoming');
              },
            });
          });
        });
      });

    },
    { scope: root }
  );
}

export default usePipeline;
