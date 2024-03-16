import * as Yup from 'yup';

export const financialSchema = Yup.object().shape({
    startDate: Yup.date()
        .required('O campo Nome é obrigatório.'),

    finalDate: Yup.date()
        .required('O campo é obrigatório.'),

    clientId: Yup.string()
        .nullable(),
});

export const financialSchemaInitialValues = {
    startDate: '',
    finalDate: '',
    clientId: undefined
}
