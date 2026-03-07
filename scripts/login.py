from playwright.sync_api import sync_playwright
import requests


def login_cas_system(username, password):
    """
    使用 Playwright 模拟真实浏览器登录统一身份认证系统，并获取教务系统的 Cookie，并完成下载
    """
    output_filename = 'csu.xls'
    login_url = "https://ca.csu.edu.cn/authserver/login?service=http%3A%2F%2Fcsujwc.its.csu.edu.cn%2Fsso.jsp"
    search_url = "http://csujwc.its.csu.edu.cn/tkglAction.do?method=tzkb&first=yes&type=1&isview=1&findType=cx"
    schedule_page_url = "http://csujwc.its.csu.edu.cn/PublicListPrintServlet?TblName=%E8%AF%BE%E8%A1%A8%E4%BF%A1%E6%81%AF"

    print("启动浏览器内核中...")
    with sync_playwright() as p:
        # 建议调试时保持 headless=False，看着它操作。没问题了再改成 True
        browser = p.chromium.launch(headless=False)

        # 【重要新增】必须加上 accept_downloads=True 才能接管下载
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            accept_downloads=True
        )
        page = context.new_page()

        print("1. 正在访问统一身份认证页面...")
        page.goto(login_url)

        print("2. 正在输入账号和密码...")
        page.fill("#username", username)
        page.fill("#password", password)
        page.press("#password", "Enter")

        print("提交登录中，等待系统验证和跳转...")
        try:
            page.wait_for_url("**/csujwc.its.csu.edu.cn/**", timeout=15000)
            print("✅ 登录成功！已成功跳转至教务系统。")
        except Exception as e:
            print("❌ 登录失败或超时。可能是密码错误，或者出现了验证码。")
            page.screenshot(path="login_error.png")
            print("错误截图已保存为 login_error.png")
            browser.close()
            return None

        # ================= 业务操作阶段 =================
        print(f"3. 正在前往课表查询页面...")
        page.goto(search_url)

        # 等待框架加载出来
        page.wait_for_selector("#ftop1")
        print("🔍 发现嵌套框架 ftop1，正在进入...")

        # 定位到这个名为 ftop1 的框架
        frame_ftop1 = page.frame_locator("#ftop1")

        print("4. 点击查询按钮，系统正在全力检索全校课表...")
        # 注意：这里要用 frame_ftop1 来点击，而不是 page
        frame_ftop1.locator("input[name='CmdOK']").click()

        # 因为查询非常慢，设置超长等待
        print("⏳ 系统处理中，请耐心等待（约 1 分钟）...")
        try:
            # 同样在框架内等待加载完成
            page.wait_for_load_state("networkidle", timeout=120000)
        except:
            print("⚠️ 等待超时，尝试强行继续...")
        print("⏳ 系统查询中，等待【打印】按钮出现...")
        # 1. 不要 goto，要在当前页面找那个“打印”按钮
        # 根据你之前的截图，打印按钮是一个包含 'printSetupByServlet2' 的 a 标签
        print("当前页面所有框架:", [f.name for f in page.frames])
        current_frame = page.frame_locator("#fbuttom")
        print_btn_selector = "a[onclick*='printSetupByServlet2']"
        # 遍历所有框架找按钮
        for f in page.frames:
            try:
                # 尝试在当前框架找按钮，设置一个极短的超时
                if f.locator(print_btn_selector).count() > 0:
                    target_frame = f
                    print(f"✅ 在框架 '{f.name}' 中找到了打印按钮！")
                    break
            except:
                continue
        try:

            # 2. 关键：点击“打印”会弹出新窗口，我们需要捕获这个新窗口对象
            print("5. 发现打印按钮，正在点击并捕获弹出窗口...")
            with context.expect_page(timeout=20000) as popup_info:
                current_frame.locator(print_btn_selector).click()

            # config_page 就是那个弹出来的、让你填表名的小窗口
            config_page = popup_info.value
            config_page.wait_for_load_state("networkidle")

            # 3. 在弹出的窗口里操作（保存结构、填表名、点确定）
            print("6. 正在弹出窗口中填写表名...")

            # 保存一下这个弹窗的结构备查
            with open('popup_structure.html', 'w', encoding='utf-8') as f:
                f.write(config_page.content())

            config_page.fill("input[name='TblName2']", "csu_report")

            print("7. 点击弹窗里的【确定】，接收文件...")
            with config_page.expect_download(timeout=120000) as download_info:
                # 注意：这里是用 config_page 去点，而不是原来的 page
                config_page.click("input[name='cmdok']")

            download = download_info.value
            download.save_as(output_filename)
            print(f"🎉 任务全流程完成！文件已保存至: {output_filename}")

        except Exception as e:
            print(f"❌ 流程中断: {e}")
            # 失败时保存主页面和框架源码供分析
            page.screenshot(path="error_state.png")

        # 任务完成，关闭浏览器
        page.wait_for_timeout(2000)
        browser.close()


# ================= 测试运行 =================
if __name__ == "__main__":
    USER_ID = "8210222517"
    PASSWORD = "1572878897qqab"

    login_cas_system(USER_ID, PASSWORD)
