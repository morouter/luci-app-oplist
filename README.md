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
- The `openlist` binary is NOT bundled. It is provided by the `openlist` package
  (`net/openlist` in the packages feed), which is compiled from source by the
  buildroot, so this LuCI package itself is architecture-independent.

## 📚 Help

[Install, Compile and init-SDK Generic Guide](https://867678.xyz/docs/openwrt)

On the first start, open the OpenList web page (port 5244 by default) and set the admin username and password.

### Forgot your password?

- Use this command to reset it to a random password.
- OpenList passwords are encrypted and cannot be recovered, so they can only be reset.
- Replace `NEW_PASSWORD` with the password you want to set.

```bash
openlist --data /etc/openlist admin random
```

Or set a password manually.

```bash
openlist --data /etc/openlist admin set NEW_PASSWORD
```

### Cannot start the service?

- Check the configured port and make sure it is not already in use.
- View the log page for more details.
- Alternatively, open an issue for this project.

### 🛠 Build

- It is assumed that you are already in the SDK root directory.
- Select `Network -> openlist` together with `LuCI -> Applications -> luci-app-oplist`
  (the dependency is resolved automatically once `luci-app-oplist` is selected).
- The `openlist` binary is built from source; no prebuilt binary download is needed.

## ⚖️ License

This application was licensed under the [GNU Affero General Public License Version 3 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.html).

We also have included the [OpenList](https://github.com/OpenListTeam/OpenList), the `OpenList project` aslo based on the `AGPL-v3.0`.

The log viewer contains code adapted from <https://github.com/Internet1235/luci-app-openlist/blob/main/luci-app-openlist/htdocs/luci-static/resources/view/openlist/log.js>, licensed under Apache-2.0. Here change to `AGPL-v3.0`.
