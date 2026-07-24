# luci-app-oplist

LuCI support for OpenList

## 🚀 Features

- Simple LuCI interface for OpenList
- With built-in **high performance** OpenList binary kernel

## ⬇️ Downloads

[GitHub Release](https://github.com/morouter/luci-app-oplist/releases)

## ⚠️ Warning

- It only supports the x86_64 and aarch64_generic platforms.

If you need to compile for another platform, change **x86_64** on line `9` of `./Makefile` to your target platform.

## 📚 Help

[Install, Compile and init-SDK Generic Guide](https://867678.xyz/doc/OpenWrt)

### Forgot your password?

- Use this command to reset it to a random password.
- OpenList passwords are encrypted and cannot be recovered, so they can only be reset.
- Replace `[username]` and `[password]` with the actual username and password.

```
openlist --data /etc/openlist [username] random
```

Or set a password with you.

```
openlist --data /etc/openlist [username] set [password]
```

### Cannot start the service?

- Check the configured port and make sure it is not already in use.
- View the log page for more details.
- Alternatively, open an issue for this project.

### 🛠 How to self-build?

- It is assumed that you are already in the SDK root directory.
  Additional operations on the source code are required before compilation:

```
cd ⚠️sdk-root/package/luci-app-oplist/root/usr/bin/
rm DONOTREMOVE
wget -O openlist https://github.com/morouter/luci-app-oplist/releases/download/openlist/openlist-linux-⚠️ARCH-⚠️LibC
# Or try Mirror by MoAEIOU https://l.867678.xyz/openlist-⚠️ARCH-⚠️LibC
chmod +x ./openlist
rm -f DONOTREMOVE
cd ../../etc/openlist
rm DONOTREMOVE
```

And start compile

## 🙏 Acknowledgements

Project: MoAEIOU

AI: <https://claude.ai> <https://chatgpt.com>

## ⚖️ License

This application was licensed under the [GNU Affero General Public License Version 3 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.html).

We also have included the [OpenList](https://github.com/OpenListTeam/OpenList) binary, which is developed by OpenListTeam and based on the AGPL-3.0 open source.

The log viewer contains code adapted from <https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js>, licensed under Apache-2.0.
