import { useState, useRef, useMemo } from 'react';
import { Copy, Sparkles, Gamepad2, Check, RefreshCw } from 'lucide-react';

interface MotdEditorProps {
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const COLOR_CODES = [
  { code: '&0', hex: '#000000', name: 'Black' },
  { code: '&1', hex: '#0000AA', name: 'Dark Blue' },
  { code: '&2', hex: '#00AA00', name: 'Dark Green' },
  { code: '&3', hex: '#00AAAA', name: 'Dark Aqua' },
  { code: '&4', hex: '#AA0000', name: 'Dark Red' },
  { code: '&5', hex: '#AA00AA', name: 'Dark Purple' },
  { code: '&6', hex: '#FFAA00', name: 'Gold' },
  { code: '&7', hex: '#AAAAAA', name: 'Gray' },
  { code: '&8', hex: '#555555', name: 'Dark Gray' },
  { code: '&9', hex: '#5555FF', name: 'Blue' },
  { code: '&a', hex: '#55FF55', name: 'Green' },
  { code: '&b', hex: '#55FFFF', name: 'Aqua' },
  { code: '&c', hex: '#FF5555', name: 'Red' },
  { code: '&d', hex: '#FF55FF', name: 'Light Purple' },
  { code: '&e', hex: '#FFFF55', name: 'Yellow' },
  { code: '&f', hex: '#FFFFFF', name: 'White' },
];

const TEMPLATES = [
  {
    title: 'High-CTR Live Event',
    text: '&b&lMINECRAFT TOOLS &6★ &f&l1.21.4 SMP COMMUNITY\n&a✔ &eCustom Totems &8| &bInstant Seeds &8| &c&lNOW LIVE!',
  },
  {
    title: 'Hardcore Survival',
    text: '&4&lHARDCORE REALMS &8[1.21] &7- &c&nDEATH IS FINAL\n&6✦ &eCustom Enchants &8· &aBlood Moon &8· &fJoin Now!',
  },
  {
    title: 'Clean Minimalist',
    text: '&f&lAETHEL &8» &bPure Vanilla 1.21.4\n&7No pay-to-win &8| &eActive friendly voice &8| &a24/7',
  },
];

export default function MotdEditor({ onNotify }: MotdEditorProps) {
  const [rawText, setRawText] = useState(
    '&b&lMINECRAFT TOOLS &6★ &f&l1.21.4 SMP COMMUNITY\n&a✔ &eCustom Totems &8| &bInstant Seeds &8| &c&lNOW LIVE!'
  );
  const [serverTitle, setServerTitle] = useState('Minecraft Community Hub Server');
  const [playerCount, setPlayerCount] = useState('54/200');
  const [copiedMode, setCopiedMode] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Insert formatting code at cursor position
  const insertCode = (code: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const prev = rawText;

    const updated = prev.substring(0, start) + code + prev.substring(end);
    setRawText(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + code.length;
    }, 0);
  };

  // Copy with & codes
  const copyAmpersand = () => {
    const formatted = rawText.replace(/§([0-9a-fklmnor])/gi, '&$1');
    navigator.clipboard.writeText(formatted);
    setCopiedMode('&');
    setTimeout(() => setCopiedMode(null), 2000);
    onNotify('MOTD copied formatted with "&" codes!');
  };

  // Copy with § codes
  const copySection = () => {
    const formatted = rawText.replace(/&([0-9a-fklmnor])/gi, '§$1');
    navigator.clipboard.writeText(formatted);
    setCopiedMode('§');
    setTimeout(() => setCopiedMode(null), 2000);
    onNotify('MOTD copied formatted with native "§" codes!');
  };

  // Parse raw text into structured tokens for Minecraft GUI rendering
  const parsedSpans = useMemo(() => {
    const colorMap: Record<string, string> = {
      '0': '#000000',
      '1': '#0000AA',
      '2': '#00AA00',
      '3': '#00AAAA',
      '4': '#AA0000',
      '5': '#AA00AA',
      '6': '#FFAA00',
      '7': '#AAAAAA',
      '8': '#555555',
      '9': '#5555FF',
      a: '#55FF55',
      b: '#55FFFF',
      c: '#FF5555',
      d: '#FF55FF',
      e: '#FFFF55',
      f: '#FFFFFF',
    };

    interface Token {
      text: string;
      color: string;
      bold: boolean;
      italic: boolean;
      underline: boolean;
      strike: boolean;
      isNewLine?: boolean;
    }

    const lines = rawText.split('\n');
    const result: Token[][] = [];

    lines.forEach((line) => {
      const lineTokens: Token[] = [];
      let currentColor = '#FFFFFF';
      let isBold = false;
      let isItalic = false;
      let isUnderline = false;
      let isStrike = false;

      let currentBuf = '';

      const flush = () => {
        if (currentBuf) {
          lineTokens.push({
            text: currentBuf,
            color: currentColor,
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            strike: isStrike,
          });
          currentBuf = '';
        }
      };

      let i = 0;
      while (i < line.length) {
        if ((line[i] === '&' || line[i] === '§') && i + 1 < line.length) {
          flush();
          const code = line[i + 1].toLowerCase();
          if (colorMap[code]) {
            currentColor = colorMap[code];
            isBold = false;
            isItalic = false;
            isUnderline = false;
            isStrike = false;
          } else if (code === 'l') {
            isBold = true;
          } else if (code === 'o') {
            isItalic = true;
          } else if (code === 'n') {
            isUnderline = true;
          } else if (code === 'm') {
            isStrike = true;
          } else if (code === 'r') {
            currentColor = '#FFFFFF';
            isBold = false;
            isItalic = false;
            isUnderline = false;
            isStrike = false;
          }
          i += 2;
        } else {
          currentBuf += line[i];
          i++;
        }
      }
      flush();
      result.push(lineTokens);
    });

    return result;
  }, [rawText]);

  return (
    <section className="relative mt-20" id="motd-color">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#1d2022] text-[#00f5d4] text-[11px] font-mono tracking-widest uppercase border border-cyan-500/20">
              MODULE // 03
            </span>
            <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider">
              // MULTIPLAYER PROTOCOL
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            MOTD &amp; CHAT COLOR ENCODER
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md">
          Format your server banner in real-time. Instantly exports both legacy{' '}
          <code className="text-[#00f5d4] bg-cyan-950 px-1 py-0.5">&amp;</code> Ampersand and native{' '}
          <code className="text-emerald-400 bg-emerald-950 px-1 py-0.5">§</code> Section codes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Workbench */}
        <div className="lg:col-span-6 bg-[#1d2022] border border-cyan-500/20 p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-[#00f5d4] uppercase tracking-widest">
              FORMAT CODE PALETTE
            </span>
            <div className="flex items-center gap-2">
              {TEMPLATES.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRawText(t.text);
                    onNotify(`Loaded: ${t.title}`);
                  }}
                  className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  {t.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Color Swatches */}
          <div className="grid grid-cols-8 gap-1.5 p-2 bg-[#0c0f11] border border-slate-800">
            {COLOR_CODES.map((item) => (
              <button
                key={item.code}
                onClick={() => insertCode(item.code)}
                title={`${item.name} (${item.code})`}
                style={{ backgroundColor: item.hex }}
                className="h-6 w-full border border-slate-700/60 hover:scale-110 active:scale-95 transition-transform cursor-pointer relative group"
              >
                <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-mono px-1 py-0.5 pointer-events-none z-10 whitespace-nowrap">
                  {item.code}
                </span>
              </button>
            ))}
          </div>

          {/* Format Modifiers */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => insertCode('&l')}
              className="px-2.5 py-1 bg-[#272a2c] hover:bg-[#323537] text-white hover:text-[#00f5d4] text-xs font-mono font-bold border border-slate-700 cursor-pointer"
            >
              BOLD (&amp;l)
            </button>
            <button
              onClick={() => insertCode('&o')}
              className="px-2.5 py-1 bg-[#272a2c] hover:bg-[#323537] text-white hover:text-[#00f5d4] text-xs font-mono italic border border-slate-700 cursor-pointer"
            >
              ITALIC (&amp;o)
            </button>
            <button
              onClick={() => insertCode('&n')}
              className="px-2.5 py-1 bg-[#272a2c] hover:bg-[#323537] text-white hover:text-[#00f5d4] text-xs font-mono underline border border-slate-700 cursor-pointer"
            >
              UNDERLINE (&amp;n)
            </button>
            <button
              onClick={() => insertCode('&m')}
              className="px-2.5 py-1 bg-[#272a2c] hover:bg-[#323537] text-white hover:text-[#00f5d4] text-xs font-mono line-through border border-slate-700 cursor-pointer"
            >
              STRIKE (&amp;m)
            </button>
            <button
              onClick={() => insertCode('&r')}
              className="px-2.5 py-1 bg-[#272a2c] hover:bg-[#323537] text-red-400 hover:text-red-300 text-xs font-mono border border-slate-700 cursor-pointer"
            >
              RESET (&amp;r)
            </button>
          </div>

          {/* Textarea */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
              <span className="uppercase">RAW MOTD EDITOR (2 LINES MAX)</span>
              <span className="text-slate-500">{rawText.length} chars</span>
            </div>
            <textarea
              ref={textareaRef}
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full bg-[#0c0f11] text-white font-mono text-xs sm:text-sm p-3 border border-slate-700 focus:border-cyan-400 focus:outline-none shadow-inner resize-none leading-relaxed select-text"
              placeholder="&b&lMy Minecraft Server..."
            />
          </div>

          {/* Copy Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={copyAmpersand}
              className="bg-[#272a2c] hover:bg-[#323537] text-white font-mono text-xs uppercase py-2 px-3 flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
            >
              {copiedMode === '&' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy with &amp; Codes</span>
                </>
              )}
            </button>

            <button
              onClick={copySection}
              className="bg-[#3cb043] hover:bg-[#48c94f] text-black font-heading font-bold text-xs uppercase py-2 px-3 flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              {copiedMode === '§' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-black" />
                  <span>Copy with § Codes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Minecraft Server List Simulation */}
        <div className="lg:col-span-6 bg-[#1d2022] border border-cyan-500/20 p-5 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-3">
              CLIENT MULTIPLAYER PREVIEW (JAVA GUI)
            </span>

            {/* Mock Client Server Entry Row */}
            <div className="bg-[#0b0e14] border border-slate-800 p-4 shadow-2xl relative">
              <div className="flex items-start gap-3.5">
                {/* Server Icon (64x64 pixel box) */}
                <div className="w-16 h-16 bg-[#191c1e] border border-slate-700 flex-shrink-0 relative overflow-hidden flex items-center justify-center group">
                  <Gamepad2 className="w-8 h-8 text-[#00f5d4]" />
                  <span className="absolute bottom-0 right-0 px-1 text-[9px] bg-[#3cb043] text-black font-mono font-bold">
                    1.21
                  </span>
                </div>

                {/* Main MOTD Area */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={serverTitle}
                      onChange={(e) => setServerTitle(e.target.value)}
                      className="text-sm font-heading font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none truncate w-full"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-mono text-xs text-[#6cde6b]">{playerCount}</span>

                      {/* Minecraft 5-bar green ping indicator */}
                      <div className="flex items-end gap-0.5 h-3 cursor-pointer" title="Ping: 22ms">
                        <div className="w-0.5 h-1 bg-[#6cde6b]"></div>
                        <div className="w-0.5 h-1.5 bg-[#6cde6b]"></div>
                        <div className="w-0.5 h-2 bg-[#6cde6b]"></div>
                        <div className="w-0.5 h-2.5 bg-[#6cde6b]"></div>
                        <div className="w-0.5 h-3 bg-[#6cde6b]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Rendered MOTD Display */}
                  <div className="font-mono text-xs sm:text-[13px] mt-2 p-2.5 bg-[#06090e] border border-slate-900 shadow-inner leading-normal break-words min-h-[54px]">
                    {parsedSpans.map((lineTokens, lineIdx) => (
                      <div key={lineIdx} className="min-h-[16px]">
                        {lineTokens.length === 0 ? (
                          <span>&nbsp;</span>
                        ) : (
                          lineTokens.map((token, tokIdx) => {
                            const styles: React.CSSProperties = {
                              color: token.color,
                              fontWeight: token.bold ? 700 : 400,
                              fontStyle: token.italic ? 'italic' : 'normal',
                              textDecoration: [
                                token.underline ? 'underline' : '',
                                token.strike ? 'line-through' : '',
                              ]
                                .filter(Boolean)
                                .join(' '),
                              textShadow: '1px 1px 0px rgba(0,0,0,0.85)',
                            };
                            return (
                              <span key={tokIdx} style={styles}>
                                {token.text}
                              </span>
                            );
                          })
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-[#191c1e] border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">COMPATIBILITY:</span>
            <span className="text-slate-200">PAPER, SPIGOT, FABRIC, VELOCITY &amp; BUNGEE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
