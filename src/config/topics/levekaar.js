import { apiUrl, baseUrl } from '../../util/config';
import source from './dataSources';

const API = `${apiUrl}/api/dataset`;

export default {
  text: 'Levekårsindikatorer',
  value: 'levekaar',
  cards: [
    {
      size: 'large',
      heading: 'Levekår',
      about: {
        info: 'Se detaljert forklaring av levekårsindikatorene i de respektive boksene under.',
        sources: [source.ssb],
      },
      tabs: [
        {
          help: 'Verdier under 100% betyr en lavere forekomst enn i Oslo, mens over 100% betyr en større forekomst.',
          label: 'Sammenlignet med Oslo',
          template: 'livingConditions',
          heading: 'Ulike levekårsindikatorer (%) sammenlignet med Oslo',
          method: 'ratio',
          mode: 'osloRatio',
          id: 'total_levekar_status_oslo',
          url: `${API}/levekar-totalt-status`,
        },
        {
          label: 'Sammenlignet med bydelen',
          help: 'Verdier under 100% betyr en lavere forekomst enn i bydelen, mens over 100% betyr en større forekomst.',
          template: 'livingConditions',
          heading: 'Ulike levekårsindikatorer (%) sammenlignet med bydelen',
          method: 'ratio',
          mode: 'districtRatio',
          id: 'totalt_levekar_status_bydeler',
          url: `${API}/levekar-totalt-status`,
        },
      ],
    },
    {
      size: 'small',
      heading: 'Lav utdanning',
      sources: [source.ssb],
      about: {
        externalInfo:
          'https://statistikkbanken.oslo.kommune.no/statbank/pxweb/no/db1/db1__Barnehage,%20skole%20og%20utdanning__Utdanningsniv%C3%A5%20og%20ikke%20fullf%C3%B8rt%20VGS/',
        info: 'Statistikken omfatter personer 30–59 år, per 1.1, med utdanningsnivå per 1.10 året før. År i figur/tabell svarer til året for utdanningsnivået. Lav utdanning omfatter personer med kun grunnskole, ingen eller uoppgitt utdanning. Fra og med 1.10.2014 har SSB gjort endringer i beregningsmetode over utdanningsnivå for innvandrere som står med uoppgitt i registeret. SSB bruker imputerte verdier på disse dataene. Dette har ført til brudd i tidsserien; utdanningsnivå fra og med 2015 er ikke direkte sammenlignbart med tidligere år.',
      },
      map: {
        labels: ['Færre', 'Flere'],
        url: `${API}/levekar-lav-utdanning-status`,
        heading: 'Personer 30–59 år med lav utdanning',
        reverse: true,
        method: 'ratio',
      },
      tabs: [
        {
          label: 'Andel',
          id: 'levekar_lav-utdanning_andel',
          heading: 'Personer 30–59 år med lav utdanning',
          template: 'bars',
          method: 'ratio',
          url: `${API}/levekar-lav-utdanning-status`,
        },
        {
          label: 'Antall',
          id: 'levekar_lav-utdanning_antall',
          heading: 'Personer 30–59 år med lav utdanning',
          template: 'bars',
          method: 'value',
          url: `${API}/levekar-lav-utdanning-status`,
        },
        {
          label: 'Historisk (andel)',
          id: 'levekar_lav-utdanning_historisk_andel',
          heading: 'Personer 30–59 år med lav utdanning',
          help: 'Skifte i datagrunnlaget fra SSB mellom 2014 og 2015.',
          method: 'ratio',
          template: 'lines',
          url: `${API}/levekar-lav-utdanning-historisk`,
        },
        {
          label: 'Historisk (antall)',
          id: 'levekar_lav-utdanning_historisk_antall',
          heading: 'Personer 30–59 år med lav utdanning',
          help: 'Skifte i datagrunnlaget fra SSB mellom 2014 og 2015.',
          method: 'value',
          template: 'lines',
          url: `${API}/levekar-lav-utdanning-historisk`,
        },
      ],
    },
    {
      size: 'small',
      heading: 'Lavinntekt',
      about: {
        externalInfo: 'https://statistikkbanken.oslo.kommune.no/statbank/pxweb/no/db1/db1__Inntekt/',
        info: 'Statistikken viser husholdninger med barn under 18 år med lav inntekt, i henhold til EU-skala. Det vil si, husholdningens inntekt etter skatt per forbruksenhet er under 60 prosent av medianinntekten for Oslo. I henhold til EU-skalaen er husholdningsinntekten skalert med forbruksvekter ved å gi første voksne i husholdningen vekten 1, andre voksne vekten 0,5 hver, mens hvert barn får vekten 0,3. Inntekten er videre korrigert for formue, det vil si at husholdninger som har brutto finanskapital per forbruksenhet over 1G, uansett ikke regnes som lavinntektshusholdninger.',
        sources: [source.ssb],
      },
      map: {
        labels: ['Færre', 'Flere'],
        heading: 'Barnehusholdninger med lav inntekt korrigert for formue',
        reverse: true,
        method: 'ratio',
        url: `${API}/fattige-barnehusholdninger-status`,
      },
      tabs: [
        {
          label: 'Andel',
          id: 'levekar_fattige_andel',
          heading: 'Barnehusholdninger med lav inntekt korrigert for formue',
          template: 'bars',
          method: 'ratio',
          url: `${API}/fattige-barnehusholdninger-status`,
        },
        {
          label: 'Antall',
          id: 'levekar_fattige_antall',
          heading: 'Barnehusholdninger med lav inntekt korrigert for formue',
          template: 'bars',
          method: 'value',
          url: `${API}/fattige-barnehusholdninger-status`,
        },
        {
          label: 'Historisk (andel)',
          id: 'levekar_fattige_historisk_andel',
          heading: 'Barnehusholdninger med lav inntekt korrigert for formue',
          method: 'ratio',
          template: 'lines',
          url: `${API}/fattige-barnehusholdninger-historisk`,
        },
        {
          label: 'Historisk (antall)',
          id: 'levekar_fattige_historisk_antall',
          heading: 'Barnehusholdninger med lav inntekt korrigert for formue',
          method: 'value',
          template: 'lines',
          url: `${API}/fattige-barnehusholdninger-historisk`,
        },
      ],
    },
    {
      size: 'small',
      heading: 'Ikke fullført videregående skole',
      about: {
        info: 'Statistikken omfatter bosatte personer 21–29 år, per 1.1, som har startet i videregående utdanning uten å fullføre i løpet av 5 år. Fullføring er oppdatert per 1.oktober året før. Årstallet i overskriften relateres til året for fullføring.',
        sources: [source.ssb],
        externalInfo:
          'https://statistikkbanken.oslo.kommune.no/statbank/pxweb/no/db1/db1__Barnehage,%20skole%20og%20utdanning__Utdanningsniv%C3%A5%20og%20ikke%20fullf%C3%B8rt%20VGS/',
      },
      map: {
        labels: ['Færre', 'Flere'],
        url: `${API}/ikke-fullfort-vgs-status`,
        heading: 'Personer 21–29 uten fullført VGS',
        method: 'ratio',
        reverse: true,
      },
      tabs: [
        {
          label: 'Andel',
          id: 'levekar_vgs_andel',
          heading: 'Personer 21–29 år som ikke har fullført videregående skole',
          template: 'bars',
          method: 'ratio',
          url: `${API}/ikke-fullfort-vgs-status`,
        },
        {
          label: 'Antall',
          id: 'levekar_vgs_antall',
          heading: 'Personer 21–29 år som ikke har fullført videregående skole',
          template: 'bars',
          method: 'value',
          url: `${API}/ikke-fullfort-vgs-status`,
        },
        {
          label: 'Historisk (andel)',
          id: 'levekar_vgs-historisk_andel',
          heading: 'Personer 21–29 år som ikke har fullført videregående skole',
          template: 'lines',
          method: 'ratio',
          url: `${API}/ikke-fullfort-vgs-historisk`,
        },

        {
          label: 'Historisk (antall)',
          id: 'levekar_vgs-historisk_antall',
          heading: 'Personer 21–29 år som ikke har fullført videregående skole',
          template: 'lines',
          method: 'value',
          url: `${API}/ikke-fullfort-vgs-historisk`,
        },
      ],
    },
    {
      size: 'small',
      heading: 'NEETs',
      about: {
        info: '<p>Statistikken viser andel av befolkningen i aldersgruppe 15–29 år som er klassifisert som NEETs. NEET er en forkortelse av «Not in Education, Employment or Training» og er en fellesbetegnelse for personer som verken er i arbeid, utdanning eller opplæring.</p><p>Se følgende artikkel hos SSB for mer informasjon om denne klassifiseringen – <a href="https://www.ssb.no/arbeid-og-lonn/artikler-og-publikasjoner/ungdom-som-verken-er-i-arbeid-eller-utdanning">https://www.ssb.no/arbeid-og-lonn/artikler-og-publikasjoner/ungdom-som-verken-er-i-arbeid-eller-utdanning</a>.</p>',
        sources: [source.ssb],
        externalInfo: 'https://statistikkbanken.oslo.kommune.no/statbank/pxweb/no/db1/db1__Sysselsetting/',
      },
      map: {
        labels: ['Færre', 'Flere'],
        url: `${API}/neets-status`,
        heading: 'Personer i aldersgruppe 15–29 år klassifisert som NEETs',
        method: 'ratio',
        reverse: true,
      },
      tabs: [
        {
          label: 'Andel',
          id: 'neets_andel',
          heading: 'Personer i aldersgruppe 15–29 år klassifisert som NEETs',
          template: 'bars',
          method: 'ratio',
          url: `${API}/neets-status`,
        },
        {
          label: 'Antall',
          id: 'neets_antall',
          heading: 'Personer i aldersgruppe 15–29 år klassifisert som NEETs',
          template: 'bars',
          method: 'value',
          url: `${API}/neets-status`,
        },
        {
          label: 'Historisk (antall)',
          id: 'neets_historisk_antall',
          heading: 'Personer i aldersgruppe 15–29 år klassifisert som NEETs',
          template: 'lines',
          method: 'value',
          url: `${API}/neets-historisk`,
        },
        {
          label: 'Historisk (andel)',
          id: 'neets_historisk_andel',
          heading: 'Personer i aldersgruppe 15–29 år klassifisert som NEETs',
          template: 'lines',
          method: 'ratio',
          url: `${API}/neets-historisk`,
        },
      ],
    },
    {
      size: 'small',
      heading: 'Ikke sysselsatte',
      about: {
        info: 'Statistikken omfatter bosatte i Oslo, 30–59 år, som ikke er registrert sysselsatt per 4. kvartal. En sysselsatt er her definert som enten lønnstaker eller selvstendig næringsdrivende. En lønnstaker er en som har utført inntektsgivende arbeid av minst én times varighet i løpet av referanseuken.',
        sources: [source.ssb],
        externalInfo: 'https://statistikkbanken.oslo.kommune.no/statbank/pxweb/no/db1/db1__Sysselsetting/',
      },
      map: {
        labels: ['Færre', 'Flere'],
        url: `${API}/levekar-ikke-sysselsatte-status`,
        heading: 'Ikke-sysselsatte 30–59 år',
        method: 'ratio',
        reverse: true,
      },
      tabs: [
        {
          label: 'Andel',
          id: 'levekaar_ikke_sysselsatte_status_andel',
          heading: 'Ikke sysselsatte 30–59 år',
          template: 'bars',
          method: 'ratio',
          url: `${API}/levekar-ikke-sysselsatte-status`,
        },
        {
          label: 'Antall',
          id: 'levekaar_ikke_sysselsatte_status_antall',
          heading: 'Ikke sysselsatte 30–59 år',
          template: 'bars',
          method: 'value',
          url: `${API}/levekar-ikke-sysselsatte-status`,
        },
        {
          label: 'Historisk (antall)',
          id: 'levekaar_ikke_sysselsatte_historisk_antall',
          heading: 'Ikke sysselsatte 30–59 år',
          template: 'lines',
          method: 'value',
          url: `${API}/levekar-ikke-sysselsatte-historisk`,
        },
        {
          label: 'Historisk (andel)',
          id: 'levekaar_ikke_sysselsatte_historisk_andel',
          heading: 'Ikke sysselsatte 30–59 år',
          template: 'lines',
          method: 'ratio',
          url: `${API}/levekar-ikke-sysselsatte-historisk`,
        },
      ],
    },
    {
      size: 'small',
      heading: 'Kort botid',
      about: {
        info: 'Statistikken omfatter personer som har innvandret til Norge fra Asia, Afrika, Latin-Amerika og Øst-Europa for mindre enn fem år siden.',
        sources: [source.ssb],
        externalInfo: 'https://statistikkbanken.oslo.kommune.no/statbank/pxweb/no/db1/db1__Befolkning__Innvandrere/',
      },
      map: {
        labels: ['Færre', 'Flere'],
        url: `${API}/levekar-innvandrere-ikke-vestlige-kort-status`,
        heading: 'Ikke-vestlige innvandrere med kort botid',
        method: 'ratio',
        reverse: true,
      },
      tabs: [
        {
          label: 'Andel',
          id: 'levekaar_innvandrere_ikke_vestlige_kort_status_andel',
          heading: 'Innvandrere fra Asia, Afrika, Latin-Amerika og Øst-Europa utenfor EU med botid kortere enn fem år',
          template: 'bars',
          method: 'ratio',
          url: `${API}/levekar-innvandrere-ikke-vestlige-kort-status`,
        },
        {
          label: 'Antall',
          id: 'levekaar_innvandrere_ikke_vestlige_kort_status_antall',
          heading: 'Innvandrere fra Asia, Afrika, Latin-Amerika og Øst-Europa utenfor EU med botid kortere enn fem år',
          template: 'bars',
          method: 'value',
          url: `${API}/levekar-innvandrere-ikke-vestlige-kort-status`,
        },
        {
          label: 'Historisk (antall)',
          id: 'levekar_innvandrere_ikke_vestlige_kort_historisk_antall',
          heading: 'Innvandrere fra Asia, Afrika, Latin-Amerika og Øst-Europa utenfor EU med botid kortere enn fem år',
          template: 'lines',
          method: 'value',
          url: `${API}/levekar-innvandrere-ikke-vestlige-kort-historisk`,
        },
        {
          label: 'Historisk (andel)',
          id: 'levekar_innvandrere_ikke_vestlige_kort_historisk_andel',
          heading: 'Innvandrere fra Asia, Afrika, Latin-Amerika og Øst-Europa utenfor EU med botid kortere enn fem år',
          template: 'lines',
          method: 'ratio',
          url: `${API}/levekar-innvandrere-ikke-vestlige-kort-historisk`,
        },
      ],
    },
    {
      size: 'small',
      heading: 'Trangboddhet',
      about: {
        info: 'Statistikken viser trangbodde husholdninger per 1.1. Husholdninger regnes som trangbodd dersom: (1) Antall rom i boligen er mindre enn antall personer eller én person bor på ett rom, og (2) antall kvadratmeter (p-areal) er under 25 kvm per person. I tilfeller hvor det mangler opplysninger om antall rom eller p-areal, vil husholdninger regnes som trangbodde dersom en av de to betingelsene er oppfylt.',
        sources: [source.ssb],
        externalInfo:
          'https://statistikkbanken.oslo.kommune.no/statbank/pxweb/no/db1/db1__Husholdninger%20og%20boforhold/',
      },

      map: {
        labels: ['Færre', 'Flere'],
        heading: 'Trangbodde husholdninger',
        url: `${API}/levekar-trangbodde-status`,
        method: 'ratio',
        reverse: true,
      },
      tabs: [
        {
          label: 'Andel',
          id: 'levekar_trangbodde_status_andel',
          heading: 'Trangbodde husholdninger',
          template: 'bars',
          method: 'ratio',
          url: `${API}/levekar-trangbodde-status`,
        },
        {
          label: 'Antall',
          id: 'levekar_trangbodde_status_antall',
          heading: 'Trangbodde husholdninger',
          template: 'bars',
          method: 'value',
          url: `${API}/levekar-trangbodde-status`,
        },
        {
          label: 'Historisk (andel)',
          id: 'levekar_trangbodde_historisk_andel',
          heading: 'Trangbodde husholdninger',
          method: 'ratio',
          template: 'lines',
          url: `${API}/levekar-trangbodde-historisk`,
        },
        {
          label: 'Historisk (antall)',
          id: 'levekar_trangbodde_historisk_antall',
          heading: 'Trangbodde husholdninger',
          method: 'value',
          template: 'lines',
          url: `${API}/levekar-trangbodde-historisk`,
        },
      ],
    },
  ],
  options: {
    kategori: 'Levekår',
    tema: 'Levekårs&shy;indikatorer',
    bgImage: `${baseUrl}/img/levekaar`,
    txtColor: 'rgb(244, 206, 138)',
  },
  related: ['husholdninger', 'innvandrerbefolkningen', 'rom-per-person'],
};
