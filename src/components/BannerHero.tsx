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
  /**
   * 「为什么推荐这个」说明行（2026-09-24 首页重规划新增，仅今日页传入）。
   *
   * 存在的理由是可解释性：首屏只给一个主 CTA，就必须回答「为什么是它」——
   * 否则用户（这里同时是产品的唯一用户与作者）看到的是一个不可质疑的指令。
   * 它同时是守门测试的同源锚点：说明行与主 CTA 必须来自同一个决策返回值。
   */
  note?: ReactNode;
}

/**
 * 通栏图片 Hero——与冒险板块（adv-hero）同语言：
 * 照片压满窗口宽度、左侧提亮保证文字可读、底部渐变融入页面底色。
 * 仅今日 / 训练两页使用；其余页面保持素色 PageHeader。
 */
export default function BannerHero({
  eyebrow,
  title,
  description,
  image,
  position = "64% 40%",
  action,
  note
}: BannerHeroProps) {
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
          {note && <p className="ui-banner-note">{note}</p>}
        </div>
        {action && <div className="ui-banner-actions">{action}</div>}
      </div>
    </header>
  );
}
