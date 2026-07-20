include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-oplist
PKG_VERSION:=0.8.9
PKG_RELEASE:=1
PKG_LICENSE:=AGPL-3.0

LUCI_TITLE:=LuCI support for OpenList
LUCI_PKGARCH:=x86_64
LUCI_DEPENDS:=+ucode-mod-digest

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
