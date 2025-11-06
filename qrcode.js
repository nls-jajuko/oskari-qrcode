const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

class QrCodeExtension extends BasicBundle {
    name = 'QR';

    linkToolVisible = false;

    linkUrl = undefined;
    linkQrCode = undefined;

    conf = {
    }


    eventHandlers = {

         // TODO add layer visibility etc events
        'AfterMapMoveEvent': ev => {
            this.updateQrCode();
        },
        'MapLayerEvent': ev => {
            this.updateQrCode();
        },
        'AfterChangeMapLayerOpacityEvent': ev => {
            this.updateQrCode();
        },
        'AfterRearrangeSelectedMapLayerEvent': ev => {
            this.updateQrCode();
        },
        'AfterMapLayerRemoveEvent': ev => {
            this.updateQrCode();
        },
        'AfterChangeMapLayerStyleEvent': ev => {
            this.updateQrCode();
        },
        
        'Toolbar.ToolSelectedEvent': ev => {
            if(ev.getToolId()=='link') {
                this.updateQrCode();
            } else {
                this.linkQrCode = undefined;
                this.linkUrl = undefined;
            
            }
        }
    }

    updateQrCode() {
        var el = document.querySelector('.t_oskari-maplink');
        this.linkToolVisible = el !== undefined;
        if(el) {
                    this.qr(el);
        } else {
            this.linkQrCode = undefined;
            this.linkUrl = undefined;
        }
    }

    getSandbox() { return this.sandbox; }
    getLocalization(key) { return this.locale[key]; }
    start(sandbox) {
        super.start(sandbox);

        this.locale = Oskari.getLocalization(this.name);

    }


    getMapUrl() {
        var url = null;

        // setup current url as base if none configured
        return this.getSandbox().createURL(url || window.location.pathname, true);
    }


    qr(el) {

        var mapUrlPrefix = this.getMapUrl();
        var linkParams = this.getSandbox().generateMapLinkParameters({});
        var baseUrl = mapUrlPrefix + linkParams + '&noSavedState=true';

        if(this.linkUrl && baseUrl == this.linkUrl) {
            return;
        }

        this.linkUrl = baseUrl;

        var qr = new QRious({
            value: baseUrl
        });

        var qrurl = qr.toDataURL();

        var img = el.querySelector('.qr');
        if(!img) { img = document.createElement('img'); el.appendChild(img);}
        img.setAttribute('src', qrurl);
        img.style.width = '12rem';
        img.classList.add('qr');
    }

}

class QrCodeBundle {
    create() {
        return new QrCodeExtension();
    }
}

function register(impl, bundleId, implClassName) {
    Oskari.clazz.defineES(
        implClassName,
        impl, {
        "protocol": ["Oskari.bundle.Bundle",
            "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "bundle": {
            "manifest": {
                "Bundle-Identifier": bundleId,
                "Bundle-Name": bundleId,
                "Bundle-Version": "1.0.0",
            }
        }
    });

    Oskari.bundle_manager.installBundleClass(bundleId,
        implClassName);
}

register(QrCodeBundle, 'qr', "Oskari.qr.QrCodeBundle");

new QrCodeBundle().create().start(Oskari.getSandbox());
