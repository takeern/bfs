const journalInfo = {
  JISSR: {
    getTimeList: 'http://www.jissr.net/api/getList',
    getJournalList: 'http://www.jissr.net/api/getPageList',
    path: (time, index) => `http://www.jissr.net/src/assets/pdf/${time}_${index}.pdf`,
  },
  IJPEE: {
    getTimeList: 'http://ijpee.net/api/getList',
    getJournalList: 'http://www.ijpee.net/api/getPageList',
    path: (time, index) => `http://www.ijpee.net/src/assets/pdf/${time}_${index}.pdf`,
  },
  IJER: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=IJER',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=IJER',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/IJER-${time}_${index}.pdf`,
  },
  JRVE: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JRVE',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JRVE',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JRVE-${time}_${index}.pdf`,
  },
  JPCE: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JPCE',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JPCE',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JPCE-${time}_${index}.pdf`,
  },
  JPME: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JPME',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JPME',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JPME-${time}_${index}.pdf`,
  },
  JCMP: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JCMP',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JCMP',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JCMP-${time}_${index}.pdf`,
  },
  JRSE: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JRSE',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JRSE',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JRSE-${time}_${index}.pdf`,
  },
  JERP: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JERP',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JERP',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JERP-${time}_${index}.pdf`,
  },
  JMME: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JMME',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JMME',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JMME-${time}_${index}.pdf`,
  },
  JGEBF: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JGEBF',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JGEBF',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JGEBF-${time}_${index}.pdf`,
  },
  JES: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JES',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JES',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JES-${time}_${index}.pdf`,
  },
  JSSH: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JSSH',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JSSH',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JSSH-${time}_${index}.pdf`,
  },
  JAH: {
    getTimeList: 'http://www.bryanhousepub.org/api/getList?journal=JAH',
    getJournalList: 'http://www.bryanhousepub.org/api/getPageList?journal=JAH',
    path: (time, index) => `http://www.bryanhousepub.org/src/static/pdf/JAH-${time}_${index}.pdf`,
  },
};

export default journalInfo;