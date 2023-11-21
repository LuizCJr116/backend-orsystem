const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  
  const validDate = (date) => {
    const _date = new Date(date)
    return _date === 'Invalid Date' ? false : true
  }
  
  const currencyFormatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'BRL',
  })
  
  const numberFormatter = new Intl.NumberFormat(['pt-BR'], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  const floatFormatter = new Intl.NumberFormat(['pt-BR'], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  const validValue = (valor) => {
    let _valor = valor.replace(/\D/g, '')
    // console.log(currencyFormatter.format(_valor));
    return currencyFormatter.format(_valor)
  }
  
  module.exports = { floatFormatter, dateFormatter }
  