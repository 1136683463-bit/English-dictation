import type { CSSProperties, ReactNode } from "react";

interface BannerHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** 背景图地址（import 资源） */
  image: string;
  /** 背景图焦点，默认偏右让左侧留给文字 */
  position?: string;
  /** 右下角行动区（按钮等） */
  action?: ReactNode;
}

/**
 * 通栏图片 Hero——与冒险板块（adv-hero）同语言：
 * 照片压满窗口宽度、左侧提亮保证文字可读、底部渐变融入页面底色。
 * 仅今日 / 训练两页使用；其余页面保持素色 PageHeader。
 */
export default function BannerHero({ eyebrow, title, description, image, position = "64% 40%", action }: BannerHeroProps) {
  return (
    <header
      className="ui-banner"
      aria-label={title}
      style={{ "--banner-image": `url(${image})`, "--banner-position": position } as CSSProperties}
    >
      <span className="ui-banner-photo" aria-hidden="true" />
      <div className="ui-banner-inner">
        <div className="ui-banner-copy">
          <span className="ui-banner-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {action && <div className="ui-banner-actions">{action}</div>}
      </div>
    </header>
  );
}
