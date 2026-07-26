const SHEET_CONFIG = {
  'Half Yearly': {
    'Six-A':   { id: '1gEIz5ZSNQh6cBEnrsN6vaEuuJ05lzUZcY4SJKHxrIkY', sheetName: 'Result_Book' },
    'Six-B':   { id: '1e9wRw2qWvNfQGI8osTSrHDSTXcEpaGYbhZGjlulJ--E', sheetName: 'Result_Book' },
    'Six-C':   { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_SIX_C_HERE',   sheetName: 'Result_Book' },

    'Seven-A': { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_SEVEN_A_HERE', sheetName: 'Result_Book' },
    'Seven-B': { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_SEVEN_B_HERE', sheetName: 'Result_Book' },
    'Seven-C': { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_SEVEN_C_HERE', sheetName: 'Result_Book' },

    'Eight-A': { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_EIGHT_A_HERE', sheetName: 'Result_Book' },
    'Eight-B': { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_EIGHT_B_HERE', sheetName: 'Result_Book' },
    'Eight-C': { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_EIGHT_C_HERE', sheetName: 'Result_Book' },

    'Nine-Science':          { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_NINE_SCIENCE_HERE',          sheetName: 'Result_Book' },
    'Nine-Humanities':       { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_NINE_HUMANITIES_HERE',       sheetName: 'Result_Book' },
    'Nine-Business Studies': { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_NINE_BUSINESS_STUDIES_HERE', sheetName: 'Result_Book' },

    'Ten-Science':           { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_TEN_SCIENCE_HERE',           sheetName: 'Result_Book' },
    'Ten-Humanities':        { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_TEN_HUMANITIES_HERE',        sheetName: 'Result_Book' },
    'Ten-Business Studies':  { id: 'PASTE_SPREADSHEET_ID_HALFYEARLY_TEN_BUSINESS_STUDIES_HERE',  sheetName: 'Result_Book' }
  },

  'Annual': {
    'Six-A':   { id: 'PASTE_SPREADSHEET_ID_ANNUAL_SIX_A_HERE',   sheetName: 'Result_Book' },
    'Six-B':   { id: 'PASTE_SPREADSHEET_ID_ANNUAL_SIX_B_HERE',   sheetName: 'Result_Book' },
    'Six-C':   { id: 'PASTE_SPREADSHEET_ID_ANNUAL_SIX_C_HERE',   sheetName: 'Result_Book' },

    'Seven-A': { id: 'PASTE_SPREADSHEET_ID_ANNUAL_SEVEN_A_HERE', sheetName: 'Result_Book' },
    'Seven-B': { id: 'PASTE_SPREADSHEET_ID_ANNUAL_SEVEN_B_HERE', sheetName: 'Result_Book' },
    'Seven-C': { id: 'PASTE_SPREADSHEET_ID_ANNUAL_SEVEN_C_HERE', sheetName: 'Result_Book' },

    'Eight-A': { id: 'PASTE_SPREADSHEET_ID_ANNUAL_EIGHT_A_HERE', sheetName: 'Result_Book' },
    'Eight-B': { id: 'PASTE_SPREADSHEET_ID_ANNUAL_EIGHT_B_HERE', sheetName: 'Result_Book' },
    'Eight-C': { id: 'PASTE_SPREADSHEET_ID_ANNUAL_EIGHT_C_HERE', sheetName: 'Result_Book' },

    'Nine-Science':          { id: 'PASTE_SPREADSHEET_ID_ANNUAL_NINE_SCIENCE_HERE',          sheetName: 'Result_Book' },
    'Nine-Humanities':       { id: 'PASTE_SPREADSHEET_ID_ANNUAL_NINE_HUMANITIES_HERE',       sheetName: 'Result_Book' },
    'Nine-Business Studies': { id: 'PASTE_SPREADSHEET_ID_ANNUAL_NINE_BUSINESS_STUDIES_HERE', sheetName: 'Result_Book' },

    'Ten-Science':           { id: 'PASTE_SPREADSHEET_ID_ANNUAL_TEN_SCIENCE_HERE',           sheetName: 'Result_Book' },
    'Ten-Humanities':        { id: 'PASTE_SPREADSHEET_ID_ANNUAL_TEN_HUMANITIES_HERE',        sheetName: 'Result_Book' },
    'Ten-Business Studies':  { id: 'PASTE_SPREADSHEET_ID_ANNUAL_TEN_BUSINESS_STUDIES_HERE',  sheetName: 'Result_Book' }
  },

  'Pre-Test': {
    // প্রয়োজন হলে Pre-Test পরীক্ষার জন্য একইভাবে প্রতিটি ক্লাস-সেকশনের Sheet আইডি বসান
  },

  'Test': {
    // প্রয়োজন হলে Test পরীক্ষার জন্য একইভাবে প্রতিটি ক্লাস-সেকশনের Sheet আইডি বসান
  }
};

function getStudentResult(roll, className, section, examName, examYear) {
  try {
    if (!className || !section) {
      return { success: false, error: 'Class/Section প্রয়োজন', message: 'className ও section পাঠাতে হবে' };
    }

    if (!examName || !examYear) {
      return { success: false, error: 'Exam/Year প্রয়োজন', message: 'examName ও examYear পাঠাতে হবে' };
    }

    const examConfig = SHEET_CONFIG[examName];
    if (!examConfig) {
      return { success: false, error: 'পরীক্ষার কনফিগ পাওয়া যায়নি', message: 'এই পরীক্ষার জন্য কোনো Sheet কনফিগ নেই: ' + examName };
    }

    const key = className + '-' + section;
    const config = examConfig[key];

    if (!config || config.id.indexOf('PASTE_SPREADSHEET_ID') === 0) {
      return { success: false, error: 'Sheet কনফিগ পাওয়া যায়নি', message: 'এই পরীক্ষা ও ক্লাস-সেকশনের জন্য Sheet ID বসানো হয়নি: ' + examName + ' / ' + key };
    }

    const ss = SpreadsheetApp.openById(config.id);
    const sheet = ss.getSheetByName(config.sheetName);
    if (!sheet) throw new Error('Sheet "' + config.sheetName + '" not found in ' + key);

    const data = sheet.getDataRange().getValues();
    const sectionCell = sheet.getRange('C3').getValue(); // ✅ Section from C3
    const sheetExamName = sheet.getRange('D3').getValue(); // শীটে যা লেখা আছে (fallback)
    const classNameCell = sheet.getRange('B3').getValue(); // ✅ Class from B3
    const session = sheet.getRange('E3').getValue();     // ✅ Session from E3

    // ইউজারের সিলেক্ট করা পরীক্ষার নাম ও সাল, না থাকলে শীটের মান ব্যবহার হবে
    const displayExamName = (examName && examYear) ? (examName + ' - ' + examYear) : (sheetExamName || '');

    if (!roll || roll.toString().trim() === '') {
      return { error: 'Roll number is required' };
    }

    const searchRoll = String(roll).trim();

    for (let i = 5; i < data.length; i++) {
      if (String(data[i][1]).trim() === searchRoll) {
        return {
          success: true,
          examName: displayExamName,
          studentInfo: {
            roll: data[i][1],
            name: data[i][2],
            father: data[i][3],
            mother: data[i][4],
            section: sectionCell || '',
            session: session || '',
            className: classNameCell || ''
          },
          results: {
            totalMarks: data[i][43],
            fullMarks: 750,
            totalGPA: data[i][44],
            gpa: data[i][45],
            letterGrade: data[i][46],
            totalAPlus: data[i][47],
            totalFail: data[i][48],
            position: data[i][49]
          },
          subjects: [
            {
              name: 'Bangla',
              parts: [
                { name: 'Bangla 1st', cq: data[i][5], mcq: data[i][6] },
                { name: 'Bangla 2nd', cq: data[i][7], mcq: data[i][8] }
              ],
              final: { total: data[i][9], gpa: data[i][10], grade: data[i][11] }
            },
            {
              name: 'English',
              parts: [
                { name: 'English 1st', cq: data[i][12] },
                { name: 'English 2nd', cq: data[i][13] }
              ],
              final: { total: data[i][14], gpa: data[i][15], grade: data[i][16] }
            },
            {
              name: 'Mathematics',
              cq: data[i][17],
              mcq: data[i][18],
              total: data[i][19],
              gpa: data[i][20],
              grade: data[i][21]
            },
            {
              name: 'Religion',
              cq: data[i][22],
              mcq: data[i][23],
              total: data[i][24],
              gpa: data[i][25],
              grade: data[i][26]
            },
            {
              name: 'Science',
              cq: data[i][27],
              mcq: data[i][28],
              total: data[i][29],
              gpa: data[i][30],
              grade: data[i][31]
            },
            {
              name: 'BGS',
              cq: data[i][32],
              mcq: data[i][33],
              total: data[i][34],
              gpa: data[i][35],
              grade: data[i][36]
            },
            {
              name: 'ICT',
              cq: data[i][37],
              mcq: data[i][38],
              total: data[i][39],
              gpa: data[i][40],
              grade: data[i][41]
            }
          ],
          additional: [
            {
              name: 'Agriculture',
              total: data[i][42]
            }
          ]
        };
      }
    }

    return {
      success: false,
      error: 'Student not found',
      message: 'No student found with roll number: ' + searchRoll + ' (' + key + ')'
    };

  } catch (error) {
    console.error('Error in getStudentResult:', error);
    return {
      success: false,
      error: 'System error',
      message: error.message
    };
  }
}

// ✅ doGet ফাংশন (ওয়েব অ্যাপের এন্ট্রি পয়েন্ট)
// ব্যবহার: ...?roll=123&class=Six&section=A
function doGet(e) {
  const roll = e.parameter.roll;
  const className = e.parameter.class;
  const section = e.parameter.section;
  const examName = e.parameter.examName;
  const examYear = e.parameter.examYear;

  if (roll && className && section && examName && examYear) {
    // API mode - return JSON
    const result = getStudentResult(roll, className, section, examName, examYear);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    // Web app mode - return HTML
    return HtmlService.createHtmlOutputFromFile('Transcript')
      .setTitle('Academic Transcript')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// ✅ doPost ফাংশন (POST requests এর জন্য)
// body: { action: 'getResult', roll, className, section }
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'getResult') {
      const result = getStudentResult(data.roll, data.className, data.section, data.examName, data.examYear);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === 'getBatch') {
      const result = getBatchResults(data.rolls, data.className, data.section);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === 'getRanking') {
      const result = getClassRanking(data.limit, data.className, data.section);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Request processing failed',
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}