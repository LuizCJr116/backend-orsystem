const PdfPrinter = require('pdfmake')

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
}

const Report = async (
  title = 'Relatório sem título',
  widths = [],
  body = [],
  lineHeight = 1
) => {
  var printer = new PdfPrinter(fonts)
  var docDefinition = {
    footer: function (currentPage, pageCount) {
      return {
        text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
        alignment: 'center',
      }
    },
    header: function (currentPage, pageCount, pageSize) {
      return [
        {
          text: title,
          alignment: 'center',
          style: 'tableHeader',
          margin: 20,
        },
      ]
    },
    content: {
      table: {
        headerRows: 1,
        widths: widths,
        body: body,
      },

    },
    defaultStyle: {
      font: 'Helvetica'
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true

      },
      tableHeaderGeral: {
        fontSize: 10,
        bold: true
      },
      bodyGeral: {
        fontSize: 10,
        lineHeight: lineHeight,
        margin: [0, 5.5]

        // margin: [0, 7, 0, 0]
      },
      tableHeaderEspecifico: {
        bold: true,
        fontSize: 10,
        // margin: [0, 7, 0, 0]
      },
      tableBody: {

      },
    },
  }
  var pdfDoc = printer.createPdfKitDocument(docDefinition)

  return new Promise((resolve, reject) => {
    try {
      var chunks = []
      pdfDoc.on('data', (chunk) => chunks.push(chunk))
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)))
      pdfDoc.end()
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = Report
