import xlxs from 'xlsx'
import Big from 'big.js';

export const canParseFile = (filename) => {
    return /^\d{8}-(current|finished)-investments.xlsx$/.test(filename);
}

export const parseFileIntoInvestments = (filename, content) => {
    let binary = '';
    const bytes = new Uint8Array(content);
    for (var i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    const workbook = xlxs.read(binary, {
        type: 'binary',
        cellDates: true,
        cellStyles: true
    });

    let investments = [];
    xlxs.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).forEach(element => {
        investments.push(convertToInvestment(element))
    });

    return investments;
}

const convertToInvestment = element => {
    return {
        amortization: element['Amortization Method'],
        amountSecondary: Big(element['Amount in Secondary Market']),
        hasBuybackGuarantee: element['Buyback Guarantee'] === 'Yes',
        country: element['Country'],
        investmentDate: element['Date of Investment'],
        id: element['ID'],
        interest: element['Interest Rate'],
        issueDate: element['Issue Date'],
        ltv: element['LTV'],
        loanAmount: Big(element['Loan Amount']),
        loanOriginator: element['Loan Originator'],
        loanType: element['Loan Type'],
        rating: element['Mintos Rating'],
        amountInvestment: Big(element['My Investments']),
        amountOutstanding: Big(element['Outstanding Principal']),
        receivedPaymentsCount: element['Payments Received'],
        amountPendingPayment: Big(element['Pending Payments']),
        price: Big(element['Price']),
        amountReceived: Big(element['Received Payments']),
        loanAmountRemaining: Big(element['Remaining Principal']),
        hasScheduleExtension: element['Schedule extension'] === 'Yes',
        status: element['Status'],

        // Properties for current investments
        secondaryDiscount: element['Discount/Premium'],
        estimatedNextPayment: Big('Estimated Next Payment' in element ? element['Estimated Next Payment'] : 0),
        estimatedNextPaymentDate: element['Next Payment'],
        remainingTerm: element['Remaining Term'],

        // Properties for finished investments
        closingDate: element['Closing Date'],
        isCompleted: element['Finished'],
        initialTerm: element['Initial Term'],
        rebuyReasons: element['Rebuy reasons'],
    };
}