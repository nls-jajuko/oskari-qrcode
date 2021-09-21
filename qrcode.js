
const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

class QrCodeExtension extends BasicBundle {
    name = 'QR';

    conf = {
    }


    eventHandlers = {
        'AfterMapMoveEvent': ev => {
            this.qr();
        }
    }


    getSandbox() { return this.sandbox; }
    getLocalization(key) { return this.locale[key]; }
    start(sandbox) {
        super.start(sandbox);

        this.locale = Oskari.getLocalization(this.name);

        this.qr();

    }


    getMapUrl() {
        var url = null;

        // setup current url as base if none configured
        return this.getSandbox().createURL(url || window.location.pathname, true);
    }


    qr() {

        var mapUrlPrefix = this.getMapUrl();
        var linkParams = this.getSandbox().generateMapLinkParameters({});
        var baseUrl = mapUrlPrefix + linkParams + '&noSavedState=true';

        var qr = new QRious({
            value: baseUrl
        });

        var qrurl = qr.toDataURL();

        var img = document.createElement('img');
        img.setAttribute('src', qrurl);

        var el = document.getElementById('oskari-system-messages');
        while (el.firstChild) {
            el.firstChild.remove();
        }
        el.appendChild(img);
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


