include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-oplist
PKG_VERSION:=0.2.9
PKG_RELEASE:=$(shell date +%Y%m%d%H%M%S)
PKG_LICENSE:=GPL-3.0

LUCI_TITLE:=LuCI support for OpenList
LUCI_PKGARCH:=x86_64

include $(TOPDIR)/feeds/luci/luci.mk

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/oplist

	$(CP) ./root/etc/config/oplist $(1)/etc/config/
	$(CP) ./root/usr/share/luci/menu.d/*.json $(1)/usr/share/luci/menu.d/
	$(CP) ./root/usr/share/rpcd/acl.d/*.json $(1)/usr/share/rpcd/acl.d/
	$(CP) ./htdocs/luci-static/resources/view/oplist/*.js $(1)/www/luci-static/resources/view/oplist/

	$(INSTALL_BIN) ./root/etc/init.d/oplist $(1)/etc/init.d/oplist
	$(INSTALL_BIN) ./root/usr/bin/openlist $(1)/usr/bin/openlist
endef

# call BuildPackage - OpenWrt buildroot signature
