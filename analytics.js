(function () {
    if (typeof window === 'undefined' || window.__GA_INITIALIZED__) return

    const scriptTag = document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script')
        for (let i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].getAttribute('data-ga-id')) return scripts[i]
        }
    })()

    if (!scriptTag) {
        console.warn('[Analytics] Script tag não encontrada ou atributo data-ga-id ausente.')
        return
    }

    const gaId = scriptTag.getAttribute('data-ga-id')
    const envAttr = scriptTag.getAttribute('data-env') || 'prod'
    const debug = scriptTag.getAttribute('data-debug') === 'true'

    if (!gaId || !/^[A-Z0-9-]+$/i.test(gaId)) {
        console.error('[Analytics] ID inválido ou ausente.')
        return
    }

    const allowedEnvs = ['prod', 'staging', 'dev']
    const env = allowedEnvs.includes(envAttr) ? envAttr : 'prod'

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ gaId }`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag () { dataLayer.push(arguments) }

    window.gtag = window.gtag || gtag

    gtag('js', new Date())

    const config = {
        'send_page_view': true,
        'environment': env
    }

    if (debug) {
        config['debug_mode'] = true
        console.log(`[Analytics] Inicializado (${ env }) com ID: ${ gaId }`)
    }

    gtag('config', gaId, config)

    window.track = function (eventName, params = {}) {
        try {
            if (typeof window.gtag === 'function') {
                const eventParams = Object.assign({}, params, {
                    'env': env,
                    'timestamp': new Date().toISOString()
                })

                window.gtag('event', eventName, eventParams)

                if (debug) {
                    console.log(`[Analytics] Evento enviado: ${ eventName }`, eventParams)
                }
            } else {
                if (debug) console.warn('[Analytics] GTAG não está disponível.')
            }
        } catch (err) {
            if (debug) console.error('[Analytics] Erro ao enviar evento:', err)
        }
    }

    window.__GA_INITIALIZED__ = true
})()
