let i18nService = {};

i18nService.translate = function (key) {
    return i18nService.translations['de'][key];
};

i18nService.translations = {};
i18nService.translations['de'] = {
    DISPLAY_VISUAL_CHK: 'visuell (Beschriftungen / Displays)',
    DISPLAY_AUDITIVE_CHK: 'auditiv (Sprachausgabe / Signaltöne)',
    DISPLAY_HAPTIC_CHK: 'haptisch / taktil (Drehknöpfe / Taster / taktile Beschriftungen)',
    USAGE_HAPTIC_CHK: 'haptische Elemente (Drehknöpfe / Taster)',
    USAGE_SPEECH_CHK: 'Spracheingabe',
    USAGE_TOUCH_CHK: 'Touchscreen',
    DISPLAY_VISUAL: 'Visuelle Darbietung von Informationen',
    DISPLAY_AUDITIVE: 'Auditive Darbietung von Informationen',
    DISPLAY_HAPTIC: 'Haptische Darbietung von Informationen',
    USAGE_HAPTIC: 'Bedienung des Geräts durch haptische Elemente',
    USAGE_SPEECH: 'Bedienung des Geräts durch Spracheingabe',
    USAGE_TOUCH: 'Bedienung des Geräts via Touchscreen',
    USAGE_GENERAL: 'Allgemeine Bedienung und Einfachheit',
};

i18nService.translations['en'] = {

};

export {i18nService};