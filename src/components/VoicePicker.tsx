import AppSelect, { type AppSelectOption } from "./AppSelect";

interface VoicePickerProps {
  id?: string;
  options: AppSelectOption[];
  value: string;
  onChange: (value: string) => void;
}

const groupOf = (label: string) => {
  if (label.includes("en-US")) return "美式英语";
  if (label.includes("en-GB")) return "英式英语";
  return "其他英语";
};

const GROUP_ORDER = ["美式英语", "英式英语", "其他英语"];

/** 自定义系统声音选择器：基于通用 AppSelect，按口音分组展示。 */
export default function VoicePicker({ id, options, value, onChange }: VoicePickerProps) {
  // 为不带分组的"自动选择"占位项保留未分组，其他按口音分组
  const withGroups: AppSelectOption[] = options.map((option) =>
    option.value === "" ? option : { ...option, group: groupOf(option.label) }
  );

  return (
    <AppSelect
      id={id}
      options={withGroups}
      value={value}
      onChange={onChange}
      ariaLabel="系统声音"
      placeholder="自动选择（优先自然音色）"
      groupOrder={GROUP_ORDER}
    />
  );
}
