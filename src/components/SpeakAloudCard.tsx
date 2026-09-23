import { useState } from "react";
import { Play } from "lucide-react";
import { useAppData } from "../AppContext";
import { isSpeechSupported, speakText } from "../services/speechService";
import { appendGrammarEvent } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";

/**
 * R-UX5 开口跟读块（2026-09-19 优化 PRD Package B）。
 *
 * 「说」段出答案句后的可选跟读：播本句 → 用户跟读 → 三档自评（说顺了/磕磕绊绊/再读一遍）。
 * 纪律：零判分、零麦克风权限（纯 TTS + 自评）、可跳过、不阻塞下一题——
 * 「AI/语音不进必经路径」红线在这里同样成立：整块不渲染也不影响作答流程。
 * 每次交互记 say_aloud_event，读采用率（Gate-3 判 v2 语音识别是否立项）。
 */
export default function SpeakAloudCard({ lessonId, step, sentence }: { lessonId: string; step: number; sentence: string }) {
  const { data } = useAppData();
  // hooks 全部在条件返回前（React 规则）：supported 为 false 时整个块不渲染
  const [playedOnce, setPlayedOnce] = useState(false);
  const [rated, setRated] = useState<"smooth" | "halting" | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (!isSpeechSupported() || !sentence.trim() || dismissed) return null;

  const track = (action: "played" | "smooth" | "halting" | "replay" | "skipped") => {
    appendGrammarEvent({ kind: "say_aloud_event", lessonId, step, action, ts: nowIso() });
  };

  const play = () => {
    track(playedOnce ? "replay" : "played");
    setPlayedOnce(true);
    void speakText(sentence, {
      lang: data.settings.speechLang,
      rate: data.settings.speechRate,
      voiceURI: data.settings.speechVoice
    });
  };

  return (
    <div className="speak-aloud-card" aria-label="开口跟读">
      <span className="speak-aloud-label">敢开口试一试？</span>
      <button type="button" className="icon-button" onClick={play} aria-label="播放这句，跟着读" title="播放这句，跟着读">
        <Play size={15} />
      </button>
      {playedOnce && !rated && (
        <span className="speak-aloud-rate">
          <span>读一遍，感觉如何：</span>
          <button type="button" className="lesson-ask-rate" onClick={() => { track("smooth"); setRated("smooth"); }}>说顺了</button>
          <button type="button" className="lesson-ask-rate" onClick={() => { track("halting"); setRated("halting"); }}>磕磕绊绊</button>
          <button
            type="button"
            className="ghost-link"
            onClick={() => { track("skipped"); setDismissed(true); }}
          >
            先跳过
          </button>
        </span>
      )}
      {rated && (
        <span className="speak-aloud-done">
          {rated === "smooth" ? "说得不错——下次试着更快一点。" : "多读两遍就顺了——明天复习时再试。"}
        </span>
      )}
      {!playedOnce && <span className="speak-aloud-hint">点一下听这句，跟着说出来。不算分，随时跳过。</span>}
    </div>
  );
}
