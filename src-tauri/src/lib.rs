pub fn run() {
    tauri::Builder::default()
        /*
         * 单实例必须**第一个**注册。
         *
         * 2026-09-23（第 15 轮）实测的缺陷：此前没有这个插件，用户双击两次图标
         * （或应用还开着又从命令行启动一次）会得到**两个独立进程**，
         * 各持一份内存态、写同一份存储。用 SQLite 做「读-改-写」实测：
         * 两个实例都读到 n=0、都写 n=1 —— **两次递增只生效一次，一次更新静默丢失**。
         *
         * 而本应用的核心写入（commitData → saveData 整份写）正是这个模式，
         * 所以这不是理论风险：两个实例同时用就会丢数据。
         *
         * 其他插件（sql / http）都不依赖窗口存在，放哪都行；
         * 但 single-instance 的语义是「第二个实例带着启动参数回调到这里」，
         * 按官方建议放在最前面，避免其他插件在第二个实例里做多余的初始化。
         */
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            // 第二个实例：把已有窗口带到前台，然后它自己退出（插件负责退出）。
            use tauri::Manager;
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_http::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
