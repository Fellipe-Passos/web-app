import * as Yup from 'yup';

export const transactionsSchema = Yup.object().shape({
    startDate: Yup.date()
        .required('O campo Nome é obrigatório.'),

    finalDate: Yup.date()
        .required('O campo é obrigatório.'),

    clientId: Yup.string()
        .nullable(),
});

export const transactionsSchemaInitialValues = {
    startDate: '',
    finalDate: '',
    clientId: undefined
}
