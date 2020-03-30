let i18nService = {};

i18nService.translate = function (key) {
    return i18nService.translations['de'][key];
};

i18nService.translations = {};
i18nService.translations['de'] = {
    DISPLAY_VISUAL_CHK: 'visuell (Beschriftungen / Displays)',
    DISPLAY_ACOUSTIC_CHK: 'akustisch (Signaltöne)',
    DISPLAY_SPEECH_CHK: 'Sprachausgabe',
    DISPLAY_HAPTIC_CHK: 'haptisch / taktil (Drehknöpfe / Taster / taktile Beschriftungen)',
    USAGE_HAPTIC_CHK: 'haptische Elemente (Drehknöpfe / Taster)',
    USAGE_SPEECH_CHK: 'Spracheingabe',
    USAGE_TOUCH_CHK: 'Touchscreen',
    DISPLAY_VISUAL: 'Visuelle Darbietung von Informationen',
    DISPLAY_ACOUSTIC: 'Akustische Darbietung von Informationen',
    DISPLAY_SPEECH: 'Sprachausgabe als Informationsdarbietung',
    DISPLAY_HAPTIC: 'Haptische Darbietung von Informationen',
    USAGE_HAPTIC: 'Bedienung des Geräts durch haptische Elemente',
    USAGE_SPEECH: 'Bedienung des Geräts durch Spracheingabe',
    USAGE_TOUCH: 'Bedienung des Geräts via Touchscreen',
    USAGE_GENERAL: 'Allgemeine Bedienung und Einfachheit',
    TARGETGROUP_VISUAL_IMPAIRMENT: 'Visuell eingeschränkte Personen',
    TARGETGROUP_BLIND: 'Blinde Personen',
    TARGETGROUP_MOTOR_IMPAIRMENT: 'Motorisch eingeschränkte Personen',
    TARGETGROUP_COGNITIVE_IMPAIRMENT: 'Kognitiv eingeschränkte Personen'
};

i18nService.translations['en'] = {

};

export {i18nService};