import * as Yup from 'yup';

export const inventorySchema = Yup.object().shape({
    startDate: Yup.date()
        .required('O campo Nome é obrigatório.'),

    finalDate: Yup.date()
        .required('O campo é obrigatório.'),

    product: Yup.string()
        .nullable(),

    table: Yup.string()
        .nullable(),
});

export const inventorySchemaInitialValues = {
    startDate: '',
    finalDate: '',
    product: undefined,
    table: undefined
}
