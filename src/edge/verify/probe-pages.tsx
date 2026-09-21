/** 探针页：把全局共享组件（SpeakButton 等）挂进一个最小页面，便于扫描其可读名。 */
import SpeakButton from "../../components/SpeakButton";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function ProbePages() {
  return (
    <div className="page">
      <h1>探针</h1>
      <SpeakButton text="I am drawing a picture." />
      <ConfirmDialog open={false} title="t" message="m" onConfirm={() => undefined} onCancel={() => undefined} />
    </div>
  );
}
