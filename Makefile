include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-oplist
PKG_VERSION:=0.5.6
PKG_RELEASE:=1
PKG_LICENSE:=AGPL-3.0

LUCI_TITLE:=LuCI support for OpenList
LUCI_PKGARCH:=x86_64

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
