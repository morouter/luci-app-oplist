# LuCI-APP-Op(en)List

LuCI support for OpenList

## 🚀 Features

- Simple LuCI interface for OpenList
- With rebuilt-in **high performance** OpenList
- No any others depends!

## ⬇️ Downloads

[GitHub Release](https://github.com/morouter/luci-app-oplist/releases)
[High performance Openlist](https://github.com/morouter/luci-app-oplist/releases/tag/openlist)

## ⚠️ Warning

- If you change name to `luci-app-openlist`, compile will be creat some unrelated things.
- It only supports the x86_64 and aarch64_generic platforms(Because binary only support them).
- If you need to compile for another platform, change `x86_64` on line `LUCI_PKGARCH` of `./Makefile` to your platform target.

## 📚 Help

[Install, Compile and init-SDK Generic Guide](https://867678.xyz/docs/openwrt)

### Forgot your password?

- Use this command to reset it to a random password.
- OpenList passwords are encrypted and cannot be recovered, so they can only be reset.
- Replace `[username]` and `[password]` with the actual username and password.

```bash
openlist --data /etc/openlist [username] random
```

Or set a password with you.

```bash
openlist --data /etc/openlist [username] set [password]
```

### Cannot start the service?

- Check the configured port and make sure it is not already in use.
- View the log page for more details.
- Alternatively, open an issue for this project.

### 🛠 How to self-build?

- It is assumed that you are already in the SDK root directory.

Additional operations on the source code are required before compilation:

```bash
cd ⚠️sdk-root/package/luci-app-oplist/root/usr/bin/
rm DONOTREMOVE
wget -O openlist https://github.com/morouter/luci-app-oplist/releases/download/openlist/openlist-linux-⚠️ARCH-⚠️LibC
# Or try Mirror by MoAEIOU ⚠️Domain/openlist/openlist-⚠️ARCH-⚠️LibC
chmod +x ./openlist
cd ../../etc/openlist
rm DONOTREMOVE
```

And start compile

## 🙏 Acknowledgements

Project: MoAEIOU

OpenList: [OpenList](https://github.com/OpenListTeam/OpenList)

Inspired by <https://github.com/Internet1235/luci-app-openlist>

## ⚖️ License

This application was licensed under the [GNU Affero General Public License Version 3 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.html).

We also have included the [OpenList](https://github.com/OpenListTeam/OpenList) binary, the OpenListTeam aslo based on the `AGPL-v3.0`.

The log viewer contains code adapted from <https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js>, licensed under Apache-2.0. Here change to `AGPL-v3.0`.
