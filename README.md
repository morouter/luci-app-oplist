# luci-app-oplist
LuCI support for OpenList
## ⬇️ Downloads
[GitHub Release](https://github.com/mokanove/luci-app-oplist/releases)
## 🚀 Features
- The musl binary file of OpenList is packaged, bypassing the older binary with OpenWrt.
- Support setting TLS, log storage location, etc. for OpenList in LuCI.
## ⚠️ Compatibility
- It is not guaranteed that it can be used on non-x86_64(amd64) and non-aarch64(arm64) architectures.
## 🛠 How to build?
[Generic Document](https://867678.xyz/doc/build)
> It is assumed that you are already in the SDK root directory.
>
> Additional operations are required on the source code:
```
cd ⚠️sdk-root/package/luci-app-oplist/root/usr/bin/
rm DONOTREMOVE
curl -LO "https://github.com/OpenListTeam/OpenList/releases/download/v⚠️OpenList Version/openlist-linux-musl-⚠️Your CPU Arch.tar.gz"
tar -xzvf *.tar.gz
rm -f *.tar.gz DONOTREMOVE
cd ../../etc/openlist
rm DONOTREMOVE
```
## ⚖️ License
> This application is licensed under the [GNU Affero General Public License Version 3 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.html).
> 
> We have included the [OpenList](https://github.com/OpenListTeam/OpenList) binary, which is developed by OpenListTeam and based on the AGPL-3.0 open source.
>
> The log shows a partial quote: <https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js> With Apache-2.0 License
