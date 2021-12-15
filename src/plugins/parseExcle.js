import XLSX from 'xlsx';


export const parseExcel = async (data) => {
  const workbook = XLSX.read(data, {
    type: 'buffer',
  });

  // console.log(workbook);
  const sheetNames = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNames[0]];
  const list = XLSX.utils.sheet_to_json(worksheet);
  
  list.every(item => {
    console.log(item);
    for (let key in item) {
      if (item[key]) {
        item[key] = encodeXml(item[key]);
      }
    }
  });

  return writeXML(list);
};

const encodeXml = (text) => {
  text = text.toString();
  text = text.replaceAll('&', '&amp;');
  text = text.replaceAll('<', '&lt;');
  text = text.replaceAll('>', '&gt;');
  text = text.replaceAll('"', '&quot;');
  text = text.replaceAll("'", '&apos;');
  console.log(text);
  return text;
}

const writeXML = (json) => {
  const records = json.map((item) => {
    return writeRecord(item, parseAuthor(item), parseAffiliationName(item));
  });

  const recordsStr = records.join('');
  const xml = `
    <records xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://doaj.org/static/doaj/doajArticles.xsd">
      ${recordsStr}
    </records>
  `;

  return xml;
};

const parseAuthor = (json) => {
  const map = [];
  let i = 0;
  while (true) {
    const author = json[`author${i}`];

    if (author) {
      const affiliationId = json[`affiliationId${i}`];
      const email = json[`email${i}`];
      // todo 错误提示
      map.push({
        author,
        affiliationId,
        email,
      });
    } else {
      break;
    }
    i++;
  }

  return map;
};

const parseAffiliationName = (json) => {
  const map = [];
  let i = 0;
  while (true) {
    const affiliationName = json[`affiliationName${i}`];

    if (affiliationName) {
      // todo 错误提示
      map.push(affiliationName);
    } else {
      break;
    }
    i++;
  }

  return map;
};

const writeRecord = (data, authorList = [], affiliationNames = []) => {
  const { language,
    publisher,
    journalTitle,
    issn,
    volume,
    issue,
    startPage = '',
    endPage = '',
    publisherRecordId,
    doi,
    documentType,
    title,
    abstract,
    keywords = '',
    fullTextUrl,
  } = data || {};
  let authorStr = '';
  let fiStr = '';
  let keyStr = '';

  authorList.every((item) => {
    const { author, email = '', affiliationId } = item;
    authorStr += `
      <author>
        <name>${author}</name>
        <email>${email}</email>
        <affiliationId>${affiliationId}</affiliationId>
      </author>
    `;
    return true;
  });

  affiliationNames.every((item, index) => {
    fiStr += `<affiliationName affiliationId="${index}">${item}</affiliationName>`;
    return true;
  });


  keywords.split(',').every((item) => {
    keyStr += `<keyword>${item.trim()}</keyword>`;
    return true;
  });


  const record = `
    <record>
      <language>${language}</language>
      <publisher>${publisher}</publisher>
      <journalTitle>${journalTitle}</journalTitle>
      <issn>${issn}</issn>
      <eissn></eissn>
      <publicationDate>2018-09-11</publicationDate>
      <volume>${volume}</volume>
      <issue>${issue}</issue>
      <startPage>${startPage}</startPage>
      <endPage>${endPage}</endPage>
      <doi>${doi}</doi>
      <publisherRecordId>${publisherRecordId}</publisherRecordId>
      <documentType>${documentType}</documentType>
      <title language="eng">${title}</title>
      <authors>
        ${authorStr}
      </authors>
      <affiliationsList>
        ${fiStr}
      </affiliationsList>
      <abstract language="eng">${abstract}</abstract>
      <fullTextUrl format="html">${fullTextUrl}</fullTextUrl>
      <keywords>${keyStr}</keywords>
    </record>
  `;

  return record;
};
