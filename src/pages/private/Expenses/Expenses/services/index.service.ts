export const months = [
    { label: "Janeiro", value: "01" },
    { label: "Fevereiro", value: "02" },
    { label: "Março", value: "03" },
    { label: "Abril", value: "04" },
    { label: "Maio", value: "05" },
    { label: "Junho", value: "06" },
    { label: "Julho", value: "07" },
    { label: "Agosto", value: "08" },
    { label: "Setembro", value: "09" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
];

export function getMonthsByMonthValue(m: string) {
    const arr = m?.split(',')

    const selecteds: string[] = []

    months?.forEach((month) => {
        arr?.forEach((m) => {
            if (m === month?.value) {
                selecteds.push(month?.label)
            }
        })
    })

    return selecteds?.join(',')
}