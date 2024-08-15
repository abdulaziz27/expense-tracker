const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID').format(number)
}

export default formatRupiah
