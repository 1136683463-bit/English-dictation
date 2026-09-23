import { Link } from "react-router-dom";
import EmptyState from "./EmptyState";

/** R-UX1：全局 404 兜底——此前无匹配路由渲染空白 main，任何路径笔误都像页面坏了。 */
export default function NotFoundPage() {
  return (
    <div className="page">
      <EmptyState
        title="走岔了"
        description="这个地址没有对应的页面——功能还在，路标丢了。"
        action={
          <>
            <Link to="/today" className="primary-button">回首页</Link>
            <Link to="/grammar" className="secondary-button">回语法路径</Link>
          </>
        }
      />
    </div>
  );
}
