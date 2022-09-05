const VALID_PAYMENT_METHODS = ['credit_card', 'boleto']

module.exports.isPaymentMethodValid = function(paymentMethod) {
    return VALID_PAYMENT_METHODS.includes(paymentMethod)
}

module.exports.isDocumentValid = function(document) {
    document = document.replace(/[^\d]+/g,'')
    if(document === '') return false

    if (document.length !== 11 ||
        document == "00000000000" ||
        document == "11111111111" ||
        document == "22222222222" ||
        document == "33333333333" ||
        document == "44444444444" ||
        document == "55555555555" ||
        document == "66666666666" ||
        document == "77777777777" ||
        document == "88888888888" ||
        document == "99999999999")
        return false

    let add = 0
    for (let i = 0; i < 9; i ++)
        add += parseInt(document.charAt(i)) * (10 - i)

    let rev = 11 - (add % 11)
    if (rev == 10 || rev == 11)
        rev = 0
    if (rev != parseInt(document.charAt(9)))
        return false

    add = 0
    for (let i = 0; i < 10; i ++)
        add += parseInt(document.charAt(i)) * (11 - i)
    rev = 11 - (add % 11)
    if (rev == 10 || rev == 11)
        rev = 0
    if (rev != parseInt(document.charAt(10)))
        return false

    return true
}