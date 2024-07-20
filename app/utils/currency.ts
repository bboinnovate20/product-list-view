export function currencyConvert(currency: number) {
    return new Intl.NumberFormat('en-US').format(currency);
}