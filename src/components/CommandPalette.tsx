import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { portfolioData } from '../data/portfolio';
import { goToSection } from '../engine/scroll';
import { playPaletteOpen, playPaletteClose, playNavTick, playConfirm } from '../engine/sound';

interface Command {
  id: string;
  label: string;
  glyph: string;
  hint: string;
  keywords: string;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<Props> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const onHome = useLocation().pathname === '/';

  const go = useCallback(
    (href: string) => {
      goToSection(navigate, onHome, href);
      onClose();
    },
    [navigate, onHome, onClose],
  );

  const { email } = portfolioData.personal;

  const commands = useMemo<Command[]>(
    () => [
      {
        id: 'about',
        label: 'Go to About',
        glyph: '-->',
        hint: '#about',
        keywords: 'about who story principles',
        run: () => go('#about'),
      },
      {
        id: 'labflow-nav',
        label: 'Go to LabFlow',
        glyph: '-->',
        hint: '/projects/labflow',
        keywords: 'labflow saas django react',
        run: () => {
          navigate('/projects/labflow');
          onClose();
        },
      },
      {
        id: 'projects',
        label: 'Go to Projects',
        glyph: '-->',
        hint: '#projects',
        keywords: 'projects portfolio work featured',
        run: () => go('#projects'),
      },
      {
        id: 'proof',
        label: 'Go to Proof',
        glyph: '-->',
        hint: '#proof',
        keywords: 'proof stats numbers codeexcellence',
        run: () => go('#proof'),
      },
      {
        id: 'experience',
        label: 'Go to Experience',
        glyph: '-->',
        hint: '#experience',
        keywords: 'experience work jobs roles',
        run: () => go('#experience'),
      },
      {
        id: 'contact',
        label: 'Go to Contact',
        glyph: '-->',
        hint: '#contact',
        keywords: 'contact email hire internship',
        run: () => go('#contact'),
      },
      {
        id: 'cs-labflow',
        label: 'Open LabFlow case study',
        glyph: '[*]',
        hint: 'case-study',
        keywords: 'labflow case study open multi-tenant',
        run: () => {
          navigate('/projects/labflow');
          onClose();
        },
      },
      {
        id: 'cs-fbr',
        label: 'Open FBR case study',
        glyph: '[*]',
        hint: 'case-study',
        keywords: 'fbr invoicing laravel production case study',
        run: () => {
          navigate('/projects/fbr');
          onClose();
        },
      },
      {
        id: 'cs-fundora',
        label: 'Open FundoraGlobal case study',
        glyph: '[*]',
        hint: 'case-study',
        keywords: 'fundora global trading nextjs nestjs case study',
        run: () => {
          navigate('/projects/fundoraglobal');
          onClose();
        },
      },
      {
        id: 'copy-email',
        label: 'Copy email address',
        glyph: '[c]',
        hint: 'clipboard',
        keywords: 'copy email clipboard kamran',
        run: () => {
          // Confirm only after the clipboard write actually resolves.
          navigator.clipboard
            .writeText(email)
            .then(() => {
              playConfirm();
              setNotice('email copied to clipboard');
              window.setTimeout(onClose, 900);
            })
            .catch(() => onClose());
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        glyph: '[^]',
        hint: 'external',
        keywords: 'github code repo kamrandebugging',
        run: () => {
          window.open('https://github.com/kamrandebugging', '_blank', 'noopener');
          onClose();
        },
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        glyph: '[^]',
        hint: 'external',
        keywords: 'linkedin profile social network',
        run: () => {
          window.open('https://linkedin.com/in/kamran-debug', '_blank', 'noopener');
          onClose();
        },
      },
    ],
    [go, navigate, onClose, email],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) => cmd.label.toLowerCase().includes(q) || cmd.keywords.includes(q),
    );
  }, [query, commands]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setNotice(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // The palette stays mounted and renders null when closed — fire the
  // open/close family on the `open` transition so every close path
  // (Esc, backdrop, command) is covered.
  const wasOpen = useRef(open);
  useEffect(() => {
    if (open && !wasOpen.current) playPaletteOpen();
    else if (!open && wasOpen.current) playPaletteClose();
    wasOpen.current = open;
  }, [open ]);

  useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, filtered.length - 1));
        playNavTick(false);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        playNavTick(true);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[active]?.run();
      }
    },
    [filtered, active],
  );

  if (!open) return null;

  return (
    <div className="cmdk-backdrop" role="presentation" onClick={onClose}>
      <div
        className="cmdk"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cmdk-input-row">
          <span className="cmdk-prompt" aria-hidden="true">&gt;_</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            type="text"
            placeholder="type a command..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={handleKey}
            aria-autocomplete="list"
            aria-controls="cmdk-list"
            aria-activedescendant={
              filtered[active] ? `cmdk-item-${filtered[active].id}` : undefined
            }
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="cmdk-esc-badge">Esc</kbd>
        </div>
        <div className="cmdk-divider" role="separator" />
        <ul
          id="cmdk-list"
          ref={listRef}
          className="cmdk-list"
          role="listbox"
          aria-label="Commands"
        >
          {filtered.length === 0 && (
            <li className="cmdk-empty" role="option" aria-selected="false">
              no commands match.
            </li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              id={`cmdk-item-${cmd.id}`}
              role="option"
              aria-selected={i === active}
              className={`cmdk-item${i === active ? ' cmdk-item--active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={cmd.run}
            >
              <span className="cmdk-glyph" aria-hidden="true">
                {cmd.glyph}
              </span>
              <span className="cmdk-label">{cmd.label}</span>
              <span className="cmdk-hint">{cmd.hint}</span>
            </li>
          ))}
        </ul>
        <div className="cmdk-footer" aria-hidden={notice === null}>
          {notice ? (
            <span role="status">{notice} ✓</span>
          ) : (
            <>
              <span>
                <kbd>↑↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> run
              </span>
              <span>
                <kbd>Esc</kbd> close
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
