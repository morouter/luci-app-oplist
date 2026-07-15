# luci-app-oplist
LuCI support for OpenList
## ⬇️ Downloads
[GitHub Release](https://github.com/morouter/luci-app-oplist/releases)
[Mirror by MoKanove](https://867678.xyz/doc/Mirror)
## 🚀 Features
- A simple LuCI interface for OpenList
- With high performance rebuild OpenList binary
## ⚠️ Warn
- It only support x86_64 and aarch64_generic paltform.

If you need to complie the other paltforms, change ./Makefile line `9` **x86_64** to your paltform.
# 📚 Help
- Forgot password?
> Using this command to reset a random password
>
> Because OpenList password is encrypted, so only can reset.
>
> You need change the [username] and [password] to real username and password
```
openlist [username] random --data /etc/openlist
```
> Or any password you want
```
openlist --data /etc/openlist set [username] [password]
```
- Cannot be start?
Check your port and make sure not already in use

View log page to get detail info

Or give this project an issue.
## 🛠 How to self-build?
[Generic Document](https://867678.xyz/doc/OpenWrt)

> It is assumed that you are already in the SDK root directory.
>
> Additional operations are required on the source code before compile:
```
cd ⚠️sdk-root/package/luci-app-oplist/root/usr/bin/
rm DONOTREMOVE
wget -O openlist https://github.com/morouter/luci-app-oplist/releases/latest/download/openlist-⚠️ARCH-⚠️LibC
# Also can try https://l.867678.xyz/openlist-⚠️ARCH-⚠️LibC
rm -f DONOTREMOVE
cd ../../etc/openlist
rm DONOTREMOVE
```
## ⚖️ License
> This application is licensed under the [GNU Affero General Public License Version 3 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.html).
> 
> We have included the [OpenList](https://github.com/OpenListTeam/OpenList) binary, which is developed by OpenListTeam and based on the AGPL-3.0 open source.
>
> The log shows a partial quote: <https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js> With Apache-2.0 License
