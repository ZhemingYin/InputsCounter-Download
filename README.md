# InputsCounter Download

简洁的 GitHub Pages 下载页，沿用 Notion 的内容与原图。放大的截图横向排列，可左右滑动，左下方有可拖动的细滚动条；图片说明集中在滚动条下方靠左显示，点击图片可看原图。无需 npm、构建工具或服务器程序。

## 调整截图大小

修改 `style.css` 顶部的 `--screenshot-width: 450px;` 即可。三张图共用这个宽度，高度按各自原图比例自动计算；手机窄屏会缩小到画廊宽度的 88%，以露出下一张图。

## 首次上线

1. 将本目录文件提交并推送到 `main`。
2. 打开仓库 **Settings → Pages → Build and deployment**。
3. Source 选择 **Deploy from a branch**，Branch 选择 **main**，目录选择 **/(root)**，保存。
4. 等待 GitHub 的 Pages 部署完成。

预期网页地址：

https://zhemingyin.github.io/InputsCounter-Download/

预期 Sparkle 更新源地址：

https://zhemingyin.github.io/InputsCounter-Download/appcast.xml

以上地址只有在 Pages 成功部署后才可用。

## 文件说明

- `index.html`：页面内容。
- `style.css`：白底简洁布局、横向截图画廊及移动端适配。
- `gallery.js`：同步触控滑动、键盘和左下角滚动条。
- `assets/`：从你提供的 Notion 页面保存的图标与三张截图，无需依赖 Notion 附件链接。
- `download.js`：读取 `appcast.xml` 中排在最前面的稳定发布项，更新下载按钮和版本信息。
- `appcast.xml`：网页与 Sparkle 共用的更新源。当前没有发布项，页面显示 Download coming soon。
- `downloads/`：以后放置带版本号的 DMG。
- `.nojekyll`：以原始静态文件发布。

## 以后发布 DMG 与 Sparkle 更新

App 已集成 Sparkle，可在 Settings → General → Software Updates 中手动检查更新。发布签名后的安装包和 XML 后，需要从旧版实测完整更新流程。

1. 本机钥匙串已保存 Sparkle 密钥，账号为 `vmir50.InputCounter`，对应公钥已写入 App。请安全备份私钥，**不要提交私钥到仓库**，也不要重新生成无关密钥。查看现有公钥可运行 `generate_keys --account vmir50.InputCounter -p`。
2. App 的 `SUFeedURL` 已设置为上面的 `appcast.xml` 地址。每次发布递增 `CFBundleVersion`（Xcode 的 Build），并设置 `CFBundleShortVersionString`（Version）。Sparkle 比较 Build，不仅比较显示版本号。
3. 构建并打包真实的 DMG，放入 `downloads/`，例如 `InputsCounter-2.4.4.dmg`。使用带版本的文件名，不覆盖旧文件。最低系统版本和芯片架构必须匹配实际构建。
4. 使用 Sparkle 自带的 `generate_appcast` 工具为安装包签名、生成更新源。将 `/path/to/Sparkle` 替换为你的工具目录，在仓库根目录运行：

   ```sh
   /path/to/Sparkle/bin/generate_appcast \
     --account vmir50.InputCounter \
     --download-url-prefix https://zhemingyin.github.io/InputsCounter-Download/downloads/ \
     downloads
   ```

5. 检查生成的 `downloads/appcast.xml`：版本、最低系统要求、安装包 URL、字节长度和 `sparkle:edSignature` 必须正确；最新稳定版放最前面。确认后复制为仓库根目录的 `appcast.xml`。一起上传生成的差量包或更新说明（如果有），保留它们在 XML 中对应的路径；若启用了 feed 签名，也必须复制相应签名文件。
6. 将 DMG 和根目录的 XML 一起提交并推送。网页会读取 XML 更新下载按钮，无需再修改 HTML。
7. 部署后确认安装包能下载、XML 能访问，再从旧版 App 实测检查、下载、验证、安装和重启。签名完成后不要修改安装包，否则签名及文件长度会失效。

如果暂时只做网页下载，也可以在 XML 中手动填入真实安装包的信息；在 App 正式启用自动安装前，必须换成带有真实 EdDSA 签名的发布项。不要把示例签名当成有效签名。

## DMG 大小限制

GitHub 普通 Git 仓库拒绝超过 100 MiB 的单个文件。较大的 DMG 建议放到**本仓库的 Releases 附件**，而不是 Git LFS；GitHub Pages 不支持用 LFS 提供这种下载文件。

网页和 `appcast.xml` 仍留在这个仓库。将 XML 的 `enclosure url` 指向版本对应的 Release 附件，例如：

```text
https://github.com/ZhemingYin/InputsCounter-Download/releases/download/v2.4.4/InputsCounter-2.4.4.dmg
```

不要用会变化的 `releases/latest/download` 地址作为 Sparkle 某个固定版本的安装包 URL。

## 本机预览

在仓库根目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

打开 http://127.0.0.1:8765 。不要直接双击 HTML 来验证下载功能，因为浏览器可能阻止 `file://` 页面读取 XML。

## 官方文档

- [GitHub Pages 发布设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub 文件大小限制](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
- [Sparkle 接入与签名](https://sparkle-project.org/documentation/)
- [Sparkle 沙盒配置](https://sparkle-project.org/documentation/sandboxing/)
